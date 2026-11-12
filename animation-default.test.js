// Issue #9: Home Assistant-wide animation default + per-device override.
// Loads the shipped dist file into JSDOM and checks whether the canvas (the expensive part) is created at all.
const { JSDOM } = require("jsdom");
const fs = require("fs");
const assert = require("assert");

const code = fs.readFileSync(__dirname + "/dist/ha-canvas-ribbons.js", "utf8");
let passed = 0, failed = 0;
const queue = [];
function test(name, fn) { queue.push([name, fn]); }
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// opts: { ha: undefined | null (element, no hass yet) | {states}, device, config, reducedMotion }
function load(opts) {
  opts = opts || {};
  const body = opts.ha !== undefined ? "<home-assistant></home-assistant>" : "";
  const dom = new JSDOM("<!DOCTYPE html><html><head></head><body>" + body + "</body></html>", { runScripts: "outside-only", pretendToBeVisual: true, url: "https://ha.example/lovelace/0" });
  const w = dom.window;
  let contexts = 0;
  w.HTMLCanvasElement.prototype.getContext = () => { contexts++; return new Proxy({}, { get: (t, k) => (k in t ? t[k] : k === "createLinearGradient" ? () => ({ addColorStop() {} }) : () => {}), set: (t, k, v) => { t[k] = v; return true; } }); };
  w.matchMedia = (q) => ({ matches: !!opts.reducedMotion && /prefers-reduced-motion: reduce/.test(q), addEventListener() {}, removeEventListener() {} });
  if (opts.ha) w.document.querySelector("home-assistant").hass = opts.ha;
  if (opts.device) w.localStorage.setItem("ha-canvas-ribbons-device", opts.device);
  if (opts.config) w.canvasRibbonsConfig = opts.config;
  w.console.info = () => {};
  w.eval(code);
  const $ = (id) => w.document.getElementById(id);
  return {
    w,
    canvas: () => !!$("ha-canvas-ribbons"),
    style: () => !!$("ha-canvas-ribbons-style"),
    button: () => !!$("ha-canvas-ribbons-toggle"),
    contexts: () => contexts,
    destroy: () => w._haCanvasRibbonsDestroy && w._haCanvasRibbonsDestroy(),
  };
}
const entity = (state) => ({ states: { "input_boolean.canvas_ribbons": { state } } });

test("no global default anywhere: ribbons start as before (backward compatible)", () => {
  const r = load({ ha: { states: {} } });
  assert.ok(r.canvas() && r.style() && r.button());
  r.destroy();
});

test("outside the HA frontend: starts synchronously, no waiting", () => {
  const r = load();
  assert.ok(r.canvas());
  r.destroy();
});

test("input_boolean.canvas_ribbons off: no canvas, no context, no theme override, button kept", () => {
  const r = load({ ha: entity("off") });
  assert.ok(!r.canvas() && !r.style());
  assert.strictEqual(r.contexts(), 0);
  assert.ok(r.button(), "settings button stays so the device can opt in");
  r.destroy();
});

test("input_boolean.canvas_ribbons on: ribbons start", () => {
  const r = load({ ha: entity("on") });
  assert.ok(r.canvas());
  r.destroy();
});

test("device 'on' wins over HA-wide off", () => {
  const r = load({ ha: entity("off"), device: "on" });
  assert.ok(r.canvas());
  r.destroy();
});

test("device 'off' wins over HA-wide on", () => {
  const r = load({ ha: entity("on"), device: "off" });
  assert.ok(!r.canvas() && r.contexts() === 0);
  r.destroy();
});

test("canvasRibbonsConfig.enabled=false is a global default, device 'on' still wins", () => {
  let r = load({ config: { enabled: false } });
  assert.ok(!r.canvas());
  r.destroy();
  r = load({ config: { enabled: false }, device: "on" });
  assert.ok(r.canvas());
  r.destroy();
});

test("custom entity via canvasRibbonsConfig.enabledEntity", () => {
  const r = load({ ha: { states: { "input_boolean.tablet_fx": { state: "off" } } }, config: { enabledEntity: "input_boolean.tablet_fx" } });
  assert.ok(!r.canvas());
  r.destroy();
});

test("prefers-reduced-motion: off by default, HA entity on or device on override it", () => {
  let r = load({ ha: { states: {} }, reducedMotion: true });
  assert.ok(!r.canvas());
  r.destroy();
  r = load({ ha: entity("on"), reducedMotion: true });
  assert.ok(r.canvas());
  r.destroy();
  r = load({ ha: { states: {} }, reducedMotion: true, device: "on" });
  assert.ok(r.canvas());
  r.destroy();
});

test("hass not ready yet: nothing is created until the entity can be read", async () => {
  const r = load({ ha: null });
  assert.ok(!r.canvas() && !r.button() && r.contexts() === 0, "must not start before the decision");
  r.w.document.querySelector("home-assistant").hass = entity("off");
  await wait(250);
  assert.ok(!r.canvas() && r.button() && r.contexts() === 0);
  r.destroy();
});

test("hass arrives later without the entity: ribbons start", async () => {
  const r = load({ ha: null });
  assert.ok(!r.canvas());
  r.w.document.querySelector("home-assistant").hass = { states: {} };
  await wait(250);
  assert.ok(r.canvas());
  r.destroy();
});

test("GUI device selector shows the HA default and stores the choice", () => {
  const r = load({ ha: entity("off") });
  r.w.document.getElementById("ha-canvas-ribbons-toggle").click();
  const sel = r.w.document.getElementById("ha-canvas-ribbons-device");
  assert.ok(sel, "device selector rendered");
  assert.strictEqual(sel.value, "default");
  assert.ok(/\(Off\)/.test(sel.options[0].textContent), sel.options[0].textContent);
  // location.reload is not implemented in jsdom; the choice must be stored before it is called
  r.w.console.error = () => {};
  sel.value = "on";
  try { sel.onchange(); } catch (e) {}
  assert.strictEqual(r.w.localStorage.getItem("ha-canvas-ribbons-device"), "on");
  sel.value = "default";
  try { sel.onchange(); } catch (e) {}
  assert.strictEqual(r.w.localStorage.getItem("ha-canvas-ribbons-device"), null);
  r.destroy();
});

(async () => {
  for (const [name, fn] of queue) {
    try { await fn(); console.log("  PASS  " + name); passed++; } catch (e) { console.log("  FAIL  " + name + "\n        " + e.message); failed++; }
  }
  console.log("\n" + passed + " passed, " + failed + " failed");
  process.exit(failed ? 1 : 0);
})();
