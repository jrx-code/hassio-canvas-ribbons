// Full theme mode forces dark glass surfaces; with a light theme the text tokens must switch to light values as well.
// Loads the shipped dist file into JSDOM and reads the style tag the plugin injects.
const { JSDOM } = require("jsdom");
const fs = require("fs");
const assert = require("assert");

const code = fs.readFileSync(__dirname + "/dist/ha-canvas-ribbons.js", "utf8");
let passed = 0, failed = 0;
const queue = [];
function test(name, fn) { queue.push([name, fn]); }

function load(htmlStyle, config) {
  const dom = new JSDOM('<!DOCTYPE html><html style="' + htmlStyle + '"><head></head><body></body></html>', { runScripts: "outside-only", pretendToBeVisual: true, url: "https://ha.example/lovelace/0" });
  const w = dom.window;
  w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, { get: (t, k) => (k in t ? t[k] : k === "createLinearGradient" ? () => ({ addColorStop() {} }) : () => {}), set: (t, k, v) => { t[k] = v; return true; } });
  if (config) w.canvasRibbonsConfig = config;
  w.eval(code);
  return { w, css: () => (w.document.getElementById("ha-canvas-ribbons-style") || {}).textContent || "" };
}

test("light theme (dark text): text tokens switch to light values", () => {
  const { css } = load("--primary-text-color: #141414", { themeMode: "full" });
  assert.ok(/--primary-text-color: #e1e1e1 !important/.test(css()), css());
  assert.ok(/--secondary-text-color: #9b9b9b !important/.test(css()));
  assert.ok(/color-scheme: dark/.test(css()));
});

test("dark theme (light text): the theme's own text tokens are left alone", () => {
  const { css } = load("--primary-text-color: #e1e1e1", { themeMode: "full" });
  assert.ok(!/--primary-text-color/.test(css()), css());
});

test("rgb() text colour is understood", () => {
  const { css } = load("--primary-text-color: rgb(20, 20, 20)", { themeMode: "full" });
  assert.ok(/--primary-text-color: #e1e1e1/.test(css()));
});

test("theme without the variable: no text override, no throw", () => {
  const { css } = load("", { themeMode: "full" });
  assert.ok(css().length > 0 && !/--primary-text-color/.test(css()));
});

test("canvas-only mode never touches text tokens", () => {
  const { css } = load("--primary-text-color: #141414", { themeMode: "canvas-only" });
  assert.ok(!/--primary-text-color/.test(css()), css());
});

test("switching the theme on <html> rebuilds the override", () => {
  const { w, css } = load("--primary-text-color: #e1e1e1", { themeMode: "full" });
  assert.ok(!/--primary-text-color/.test(css()));
  w.document.documentElement.style.setProperty("--primary-text-color", "#141414");
  return new Promise((resolve, reject) => setTimeout(() => { try { assert.ok(/--primary-text-color: #e1e1e1 !important/.test(css()), css()); resolve(); } catch (e) { reject(e); } }, 120));
});

(async () => {
  for (const [name, fn] of queue) {
    try { await fn(); console.log("  PASS  " + name); passed++; } catch (e) { console.log("  FAIL  " + name + "\n        " + e.message); failed++; }
  }
  console.log("\n" + passed + " passed, " + failed + " failed");
  process.exit(failed ? 1 : 0);
})();
