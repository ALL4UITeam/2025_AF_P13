import glob from 'fast-glob'
import fs from 'fs'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import handlebars from 'vite-plugin-handlebars'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const basePath = './'

  // 📂 HTML 수집
  const htmlFiles = glob.sync('src/**/*.html', { ignore: ['src/index.html'] })

  // 📋 메타 추출
  const pageMetaList = htmlFiles.map(file => {
    const content = fs.readFileSync(file, 'utf-8')
    const lines = content.split('\n').slice(0, 10)
    const meta = {}
    lines.forEach(line => {
      const match = line.match(/@(\w+)\s+(.+?)\s*-->/)
      if (match) {
        const [, key, value] = match
        meta[key] = value.trim()
      }
    })

    const relative = file.replace(/\\/g, '/').replace(/^src\//, '')
    const name = relative.replace('.html', '')

    return {
      path: relative,
      name,
      title: meta.pageTitle || path.basename(file, '.html'),
      note: meta.pageNote || '',
      created: meta.pageCreated || '',
      updated: meta.pageUpdated || ''
    }
  })

  // 📌 진입점 생성
  const inputEntries = Object.fromEntries(
    pageMetaList.map(p => [p.name, path.resolve(__dirname, `src/${p.path}`)])
  )

  // 📦 자동 그룹 감지
  const detectGroup = (raw) => {
    const normalized = raw.replace(/\\/g, '/')

    // images/portal/bg.png → portal
    const imgMatch = normalized.match(/assets\/images\/([^\/]+)/)
    if (imgMatch) return imgMatch[1]

    // 경로에 /portal/, /admin/, /map/ 포함되면
    const groupMatch = normalized.match(/\/(portal|admin|map|mypage|main)\//)
    if (groupMatch) return groupMatch[1]

    return 'common'
  }

  return {
    root: 'src',
    base: basePath,
    publicDir: path.resolve(__dirname, 'public'),

    css: {
      preprocessorOptions: {
        scss: {}
      }
    },

    build: {
      outDir: path.resolve(__dirname, 'dist'),
      emptyOutDir: true,
      cssCodeSplit: true,
      minify: false,
      assetsInlineLimit: 0,
      rollupOptions: {
        input: inputEntries,
        output: {
          entryFileNames: `assets/js/[name].js`,
          chunkFileNames: `assets/js/[name].js`,
          assetFileNames: assetInfo => {
            const raw = assetInfo.name || ''
            const ext = path.extname(raw)
            const clean = path.basename(raw, ext)
            const group = detectGroup(raw)

            // CSS
            if (/\.(css)$/.test(raw)) return `assets/css/${group}[extname]`

            // 이미지
            if (/\.(png|jpe?g|gif|svg|webp)$/.test(raw))
              return `assets/images/${group}/[name][extname]`

            // 폰트
            if (/\.(woff2?|ttf|otf|eot)$/.test(raw))
              return `assets/fonts/[name][extname]`

            // 나머지
            return `assets/${clean}[extname]`
          }
        },
        manualChunks(id) {
          if (id.includes('/src/js/common/')) return 'common'
        }
      }
    },

    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') }
    },

    plugins: [
      handlebars({
        partialDirectory: [
          path.resolve(__dirname, 'src/partials'),
          path.resolve(__dirname, 'src/components'),
          path.resolve(__dirname, 'src/layout'),
        ],
        context(pagePath) {
          const relativePath = pagePath.replace(/\\/g, '/').replace(/^src\//, '')
          const current = pageMetaList.find(p => p.path === relativePath)

          return {
            pages: pageMetaList,
            page: current || {}
          }
        }
      }),

      {
        name: 'cleanup-html',
        closeBundle() {
          const distPath = path.resolve(__dirname, 'dist')
          if (!fs.existsSync(distPath)) return
      
          setTimeout(() => {
            const htmlFiles = glob.sync(`${distPath}/**/*.html`)
            htmlFiles.forEach(file => {
              let content = fs.readFileSync(file, 'utf-8')
      
              const before = content
      
              content = content
                .replace(/<script\s+([^>]*?)\s*type="module"\s+crossorigin([^>]*)>/g, '<script $1 type="module"$2>')
                .replace(/<script\s+([^>]*?)\s+crossorigin([^>]*)>/g, '<script $1$2>')
                .replace(/<link\s+([^>]*?)\s+crossorigin([^>]*)>/g, '<link $1$2>')
                .replace(/<link[^>]*rel=["']modulepreload["'][^>]*>/g, '')
      
              if (before !== content) {
                console.log(`🧹 cleanup-html: 수정됨 → ${file.replace(distPath + '/', '')}`)
                fs.writeFileSync(file, content, 'utf-8')
              } else {
                console.log(`🚫 cleanup-html: 무시됨 → ${file.replace(distPath + '/', '')}`)
              }
            })
      
            console.log('✅ [cleanup-html] crossorigin, modulepreload 정리 완료')
          }, 500)
        }
      }
    ]
  }
})
