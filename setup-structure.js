import fs from "fs";
import path from "path";

const root = path.resolve(process.cwd(), "src");

const dirs = [
  "assets/font",
  "assets/images/icon",
  "assets/images/portal",
  "assets/images/map",
  "assets/images/admin",
  "assets/common",
  "js/common",
  "js/pages/portal",
  "js/pages/map",
  "js/pages/admin",
  "scss/abstracts",
  "scss/base",
  "scss/layout",
  "scss/components",
  "scss/pages/portal",
  "scss/pages/map",
  "scss/pages/admin",
  "partials/layout",
  "partials/components",
  "partials/abstracts",
  "portal",
  "map",
  "admin",
];

// 폴더 생성
dirs.forEach((dir) => {
  const fullPath = path.join(root, dir);
  fs.mkdirSync(fullPath, { recursive: true });
});

// placeholder JS
const jsSamples = {
  "js/common/ui.js": `export function initUI(){console.log("✅ Common UI loaded")}`,
  "js/pages/portal/main.js": `import { initUI } from '../../common/ui.js'; initUI(); console.log("Portal main page JS loaded");`,
  "js/pages/map/main.js": `import { initUI } from '../../common/ui.js'; initUI(); console.log("Map main page JS loaded");`,
  "js/pages/admin/main.js": `import { initUI } from '../../common/ui.js'; initUI(); console.log("Admin main page JS loaded");`,
};

for (const [file, content] of Object.entries(jsSamples)) {
  fs.writeFileSync(path.join(root, file), content);
}

// placeholder SCSS
const scssSamples = {
  "scss/common.scss": `@import "./abstracts/variables";\n@import "./base/reset";\n@import "./layout/layout";`,
  "scss/pages/portal/_main.scss": `.portal-main { color: #333; }`,
  "scss/pages/map/_main.scss": `.map-main { color: #333; }`,
  "scss/pages/admin/_main.scss": `.admin-main { color: #333; }`,
  "scss/main.scss": `@import "./common";`,
};

for (const [file, content] of Object.entries(scssSamples)) {
  fs.writeFileSync(path.join(root, file), content);
}

// placeholder HTML
const htmlSamples = {
  "portal/01_main.html": `<!-- @pageTitle Portal Main -->\n<!DOCTYPE html>\n<html><head><title>Portal Main</title></head><body><h1>Portal</h1></body></html>`,
  "map/01_index.html": `<!-- @pageTitle Map Index -->\n<!DOCTYPE html>\n<html><head><title>Map</title></head><body><h1>Map</h1></body></html>`,
  "admin/01_dashboard.html": `<!-- @pageTitle Admin Dashboard -->\n<!DOCTYPE html>\n<html><head><title>Admin</title></head><body><h1>Admin</h1></body></html>`,
};

for (const [file, content] of Object.entries(htmlSamples)) {
  fs.writeFileSync(path.join(root, file), content);
}

console.log("✅ 기본 src 구조 및 placeholder 생성 완료");
