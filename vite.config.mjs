import glob from "fast-glob";
import fs from "fs";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import handlebars from "vite-plugin-handlebars";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const basePath = "./";

  // 📂 HTML 수집 (index.html도 포함)
  const htmlFiles = glob.sync("src/**/*.html", {
    ignore: [
      "src/partials/**/*.html",
      "src/components/**/*.html",
      "src/layout/**/*.html",
    ],
  });

  // 📋 메타 추출
  const pageMetaList = htmlFiles.map((file) => {
    const content = fs.readFileSync(file, "utf-8");
    const lines = content.split("\n").slice(0, 10);
    const meta = {};
    lines.forEach((line) => {
      const match = line.match(/@(\w+)\s+(.+?)\s*-->/);
      if (match) {
        const [, key, value] = match;
        meta[key] = value.trim();
      }
    });

    const relative = file.replace(/\\/g, "/").replace(/^src\//, "");
    let name = relative.replace(".html", "");

    // ✅ index.html은 상위 폴더 이름으로 치환 (portal/index → portal)
    if (name.endsWith("/index")) name = name.replace("/index", "");

    return {
      path: relative,
      name,
      title: meta.pageTitle || path.basename(file, ".html"),
      note: meta.pageNote || "",
      created: meta.pageCreated || "",
      updated: meta.pageUpdated || "",
    };
  });

  // 📌 진입점 생성 (index.html 항상 포함)
  const inputEntries = Object.fromEntries(
    pageMetaList.map((p) => [p.name, path.resolve(__dirname, `src/${p.path}`)])
  );

  // 📦 그룹 자동 감지
  const detectGroup = (raw) => {
    const normalized = raw.replace(/\\/g, "/");

    // images/portal/bg.png → portal
    const imgMatch = normalized.match(/assets\/images\/([^\/]+)/);
    if (imgMatch) return imgMatch[1];

    // 경로에 /portal/, /admin/, /map/, /mypage/, /main/
    const groupMatch = normalized.match(/\/(portal|admin|map|mypage|main)\//);
    if (groupMatch) return groupMatch[1];

    return "common";
  };

  return {
    root: "src",
    base: basePath,
    publicDir: path.resolve(__dirname, "public"),

    css: {
      preprocessorOptions: { scss: {} },
    },

    build: {
      outDir: path.resolve(__dirname, "dist"),
      emptyOutDir: true,
      cssCodeSplit: true,
      minify: false,
      assetsInlineLimit: 0,

      rollupOptions: {
        input: inputEntries,
        output: {
          // ✅ index.html → assets/js/portal.js 형태로
          entryFileNames: `assets/js/[name].js`,
          chunkFileNames: `assets/js/[name].js`,
          assetFileNames: (assetInfo) => {
            const raw = assetInfo.name || "";
            const ext = path.extname(raw);
            const clean = path.basename(raw, ext);
            const group = detectGroup(raw);

            // CSS
            if (/\.(css)$/.test(raw)) return `assets/css/${group}[extname]`;

            // 이미지
            if (/\.(png|jpe?g|gif|svg|webp)$/.test(raw))
              return `assets/images/${group}/[name][extname]`;

            // 폰트
            if (/\.(woff2?|ttf|otf|eot)$/.test(raw))
              return `assets/fonts/[name][extname]`;

            // 기타
            return `assets/${clean}[extname]`;
          },
        },
        manualChunks(id) {
          if (id.includes("/src/js/common/")) return "common";
        },
      },
    },

    resolve: {
      alias: { "@": path.resolve(__dirname, "src") },
    },

    plugins: [
      handlebars({
        partialDirectory: [
          path.resolve(__dirname, "src/partials"),
          path.resolve(__dirname, "src/components"),
          path.resolve(__dirname, "src/layout"),
        ],
        context(pagePath) {
          const relativePath = pagePath
            .replace(/\\/g, "/")
            .replace(/^src\//, "");
          const current = pageMetaList.find((p) => p.path === relativePath);

          return {
            pages: pageMetaList,
            page: current || {},
          };
        },
      }),

      {
        name: 'cleanup-html',
        enforce: 'post',
        generateBundle(_, bundle) {
          for (const [fileName, file] of Object.entries(bundle)) {
            if (fileName.endsWith('.html') && file.type === 'asset') {
              let html = file.source.toString()
      
              // ✅ 완전 제거 (개행 포함, 순서 무관)
              html = html
                .replace(/<link[\s\S]*?rel=["']modulepreload["'][\s\S]*?>/gi, '')
                .replace(/\s*crossorigin(=["'][^"']*["'])?/gi, '')
                .replace(/\s*type=["']module["']/gi, '')
                .replace(/[ \t]+\n/g, '\n')
                .replace(/\n{2,}/g, '\n')
      
              file.source = html
              console.log(`🧹 cleanup-html: ${fileName} 정리 완료`)
            }
          }
          console.log('✅ [cleanup-html] modulepreload / crossorigin / type="module" 완전 제거됨')
        }
      }
      
    ],
  };
});
