// Canvas Ribbons — animated background for Home Assistant
// https://github.com/jrx-code/hassio-canvas-ribbons
// Based on Boris Šehovac's CodePen (https://codepen.io/bsehovac/pen/LQVzxJ)

const VERSION = "1.13.0";

(function () {
  "use strict";

  const STORAGE_KEY = "ha-canvas-ribbons-config";
  const PANELS_KEY = "ha-canvas-ribbons-panels";
  const BUTTON_KEY = "ha-canvas-ribbons-button";
  // This device's own animation choice: "on", "off", or absent = follow the Home Assistant-wide default.
  const DEVICE_KEY = "ha-canvas-ribbons-device";
  // Optional helper the admin creates to set the default for every device (issue #9).
  const DEFAULT_ENTITY = "input_boolean.canvas_ribbons";
  const TAU = 2 * Math.PI;

  // --- i18n ---
  var TRANSLATIONS = {
    en: {
      title: "Canvas Ribbons",
      deviceAnim: "Animation on this device",
      deviceAnimDefault: "Home Assistant default",
      deviceAnimOn: "On",
      deviceAnimOff: "Off",
      enablePanel: "Enabled on this panel",
      reset: "Reset",
      waves: "Waves",
      trailWidth: "Trail width",
      rotation: "Rotation",
      amplitude: "Amplitude",
      speedMin: "Speed min",
      speedMax: "Speed max",
      huePosition: "Hue",
      hueRange: "Hue range",
      saturation: "Saturation",
      brightness: "Brightness",
      cardAlpha: "Card alpha",
      headerAlpha: "Header alpha",
      themeMode: "Theme override",
      themeModeFull: "Full (cards + header)",
      themeModeCanvas: "Canvas only (Material You OK)",
      perfMode: "Performance",
      perfAuto: "Auto",
      perfHigh: "High",
      perfLow: "Low (Firefox-friendly)",
      sidebarAlpha: "Sidebar alpha",
      preset: "Preset",
      presetCustom: "Custom",
      presetCatGames: "Games",
      presetCatSeasons: "Seasons",
      presetCatDaytime: "Time of day",
      presetCatThemes: "Themes",
      saveClose: "Save & close",
      autoSun: "Auto (sun)",
      sunEntity: "Sun entity",
      sunPhase: "Phase",
      buttonPos: "Button",
      btnBottomRight: "Bottom-right",
      btnBottomLeft: "Bottom-left",
      btnTopRight: "Top-right",
      btnTopLeft: "Top-left",
      btnHidden: "Hidden",
    },
    pl: {
      title: "Canvas Ribbons",
      deviceAnim: "Animacja na tym urządzeniu",
      deviceAnimDefault: "Domyślnie (Home Assistant)",
      deviceAnimOn: "Włączona",
      deviceAnimOff: "Wyłączona",
      enablePanel: "Włączone na tym panelu",
      reset: "Reset",
      waves: "Wstęgi",
      trailWidth: "Dług. śladu",
      rotation: "Rotacja",
      amplitude: "Amplituda",
      speedMin: "Prędk. min",
      speedMax: "Prędk. max",
      huePosition: "Barwa",
      hueRange: "Zakres barwy",
      saturation: "Nasycenie",
      brightness: "Jasność",
      cardAlpha: "Karty alfa",
      headerAlpha: "Header alfa",
      themeMode: "Nadpisanie motywu",
      themeModeFull: "Pełne (karty + header)",
      themeModeCanvas: "Tylko canvas (Material You OK)",
      perfMode: "Wydajność",
      perfAuto: "Auto",
      perfHigh: "Wysoka",
      perfLow: "Niska (Firefox)",
      sidebarAlpha: "Sidebar alfa",
      preset: "Preset",
      presetCustom: "Własny",
      presetCatGames: "Gry",
      presetCatSeasons: "Pory roku",
      presetCatDaytime: "Pora dnia",
      presetCatThemes: "Motywy",
      saveClose: "Zapisz i zamknij",
      autoSun: "Auto (słońce)",
      sunEntity: "Encja słońca",
      sunPhase: "Faza",
      buttonPos: "Przycisk",
      btnBottomRight: "Prawy dół",
      btnBottomLeft: "Lewy dół",
      btnTopRight: "Prawy góra",
      btnTopLeft: "Lewy góra",
      btnHidden: "Ukryty",
    },
    de: {
      title: "Canvas Ribbons",
      deviceAnim: "Animation auf diesem Gerät",
      deviceAnimDefault: "Home-Assistant-Standard",
      deviceAnimOn: "An",
      deviceAnimOff: "Aus",
      enablePanel: "Auf diesem Panel aktiviert",
      reset: "Zurücksetzen",
      waves: "Wellen",
      trailWidth: "Spurlänge",
      rotation: "Drehung",
      amplitude: "Amplitude",
      speedMin: "Geschw. min",
      speedMax: "Geschw. max",
      huePosition: "Farbton",
      hueRange: "Farbtonbreite",
      saturation: "Sättigung",
      brightness: "Helligkeit",
      cardAlpha: "Karten-Alpha",
      headerAlpha: "Header-Alpha",
      themeMode: "Theme-Override",
      themeModeFull: "Voll (Karten + Header)",
      themeModeCanvas: "Nur Canvas (Material You OK)",
      perfMode: "Leistung",
      perfAuto: "Auto",
      perfHigh: "Hoch",
      perfLow: "Niedrig (Firefox)",
      sidebarAlpha: "Sidebar-Alpha",
      preset: "Vorlage",
      presetCustom: "Eigene",
      presetCatGames: "Spiele",
      presetCatSeasons: "Jahreszeiten",
      presetCatDaytime: "Tageszeit",
      presetCatThemes: "Designs",
      saveClose: "Speichern & schließen",
      autoSun: "Auto (Sonne)",
      sunEntity: "Sonnen-Entität",
      sunPhase: "Phase",
      buttonPos: "Schaltfläche",
      btnBottomRight: "Unten rechts",
      btnBottomLeft: "Unten links",
      btnTopRight: "Oben rechts",
      btnTopLeft: "Oben links",
      btnHidden: "Versteckt",
    },
    es: {
      title: "Canvas Ribbons",
      deviceAnim: "Animación en este dispositivo",
      deviceAnimDefault: "Predeterminado de Home Assistant",
      deviceAnimOn: "Activada",
      deviceAnimOff: "Desactivada",
      enablePanel: "Activado en este panel",
      reset: "Restablecer",
      waves: "Ondas",
      trailWidth: "Longitud estela",
      rotation: "Rotación",
      amplitude: "Amplitud",
      speedMin: "Veloc. mín",
      speedMax: "Veloc. máx",
      huePosition: "Tono",
      hueRange: "Rango tono",
      saturation: "Saturación",
      brightness: "Brillo",
      cardAlpha: "Tarjetas alfa",
      headerAlpha: "Header alfa",
      themeMode: "Anulación de tema",
      themeModeFull: "Completo (tarjetas + header)",
      themeModeCanvas: "Solo canvas (Material You OK)",
      perfMode: "Rendimiento",
      perfAuto: "Auto",
      perfHigh: "Alto",
      perfLow: "Bajo (Firefox)",
      sidebarAlpha: "Sidebar alfa",
      preset: "Preajuste",
      presetCustom: "Personal.",
      presetCatGames: "Juegos",
      presetCatSeasons: "Estaciones",
      presetCatDaytime: "Hora del día",
      presetCatThemes: "Temas",
      saveClose: "Guardar y cerrar",
      autoSun: "Auto (sol)",
      sunEntity: "Entidad sol",
      sunPhase: "Fase",
      buttonPos: "Botón",
      btnBottomRight: "Abajo dcha.",
      btnBottomLeft: "Abajo izda.",
      btnTopRight: "Arriba dcha.",
      btnTopLeft: "Arriba izda.",
      btnHidden: "Oculto",
    },
    ca: {
      title: "Canvas Ribbons",
      deviceAnim: "Animació en aquest dispositiu",
      deviceAnimDefault: "Per defecte de Home Assistant",
      deviceAnimOn: "Activada",
      deviceAnimOff: "Desactivada",
      enablePanel: "Activat en aquest panell",
      reset: "Restablir",
      waves: "Ones",
      trailWidth: "Longitut estel·la",
      rotation: "Rotació",
      amplitude: "Amplitut",
      speedMin: "Veloc. mín",
      speedMax: "Veloc. máx",
      huePosition: "To",
      hueRange: "Rang del to",
      saturation: "Saturació",
      brightness: "Brillantor",
      cardAlpha: "Targetes alfa",
      headerAlpha: "Capçalera alfa",
      themeMode: "Substitució del tema",
      themeModeFull: "Complet (targetes + capçalera)",
      themeModeCanvas: "Només canvas (Material You OK)",
      perfMode: "Rendiment",
      perfAuto: "Auto",
      perfHigh: "Alt",
      perfLow: "Baix (Firefox)",
      sidebarAlpha: "Barra lateral alfa",
      preset: "Preajust",
      presetCustom: "Personal.",
      presetCatGames: "Jocs",
      presetCatSeasons: "Estacions",
      presetCatDaytime: "Hora del dia",
      presetCatThemes: "Temes",
      saveClose: "Guardar i tancar",
      autoSun: "Auto (sol)",
      sunEntity: "Entitat sol",
      sunPhase: "Fase solar",
      buttonPos: "Botó",
      btnBottomRight: "Baix dreta",
      btnBottomLeft: "Baix esq.",
      btnTopRight: "Dalt dreta",
      btnTopLeft: "Dalt esq.",
      btnHidden: "Ocult",
    },
    cs: {
      title: "Canvas Ribbons",
      deviceAnim: "Animace na tomto zařízení",
      deviceAnimDefault: "Výchozí Home Assistant",
      deviceAnimOn: "Zapnuto",
      deviceAnimOff: "Vypnuto",
      enablePanel: "Povoleno na tomto panelu",
      reset: "Obnovit",
      waves: "Vlny",
      trailWidth: "Délka stopy",
      rotation: "Rotace",
      amplitude: "Amplituda",
      speedMin: "Rychl. min",
      speedMax: "Rychl. max",
      huePosition: "Odstín",
      hueRange: "Rozsah odstínu",
      saturation: "Sytost",
      brightness: "Jas",
      cardAlpha: "Karty alfa",
      headerAlpha: "Header alfa",
      themeMode: "Přepsání motivu",
      themeModeFull: "Plné (karty + header)",
      themeModeCanvas: "Jen canvas (Material You OK)",
      perfMode: "Výkon",
      perfAuto: "Auto",
      perfHigh: "Vysoký",
      perfLow: "Nízký (Firefox)",
      sidebarAlpha: "Sidebar alfa",
      preset: "Předvolba",
      presetCustom: "Vlastní",
      presetCatGames: "Hry",
      presetCatSeasons: "Roční období",
      presetCatDaytime: "Denní doba",
      presetCatThemes: "Motivy",
      saveClose: "Uložit a zavřít",
      autoSun: "Auto (slunce)",
      sunEntity: "Entita slunce",
      sunPhase: "Fáze",
      buttonPos: "Tlačítko",
      btnBottomRight: "Vpravo dole",
      btnBottomLeft: "Vlevo dole",
      btnTopRight: "Vpravo nahoře",
      btnTopLeft: "Vlevo nahoře",
      btnHidden: "Skryté",
    },
  };

  function detectLang() {
    var lang = (document.documentElement.lang || navigator.language || "en").toLowerCase().split("-")[0];
    return TRANSLATIONS[lang] ? lang : "en";
  }
  var T = TRANSLATIONS[detectLang()];

  // --- Button position ---
  var BTN_POSITIONS = {
    "bottom-right": { bottom: "16px", right: "16px" },
    "bottom-left":  { bottom: "16px", left: "16px" },
    "top-right":    { top: "16px", right: "16px" },
    "top-left":     { top: "16px", left: "16px" },
    "hidden":       null,
  };

  function getButtonPosition() {
    return localStorage.getItem(BUTTON_KEY) || "bottom-right";
  }

  function setButtonPosition(pos) {
    localStorage.setItem(BUTTON_KEY, pos);
    var btn = document.getElementById("ha-canvas-ribbons-toggle");
    if (pos === "hidden") {
      if (btn) btn.style.display = "none";
    } else {
      var coords = BTN_POSITIONS[pos] || BTN_POSITIONS["bottom-right"];
      if (btn) {
        btn.style.top = coords.top || "auto";
        btn.style.bottom = coords.bottom || "auto";
        btn.style.left = coords.left || "auto";
        btn.style.right = coords.right || "auto";
        btn.style.display = "flex";
      }
    }
  }

  // --- Presets ---
  var PRESETS = [
    // Games
    { id: "pipboy",       cat: "presetCatGames",   name: "Pip-Boy",       waves:2, width:80,  rotation:30,  amplitude:0.3, speed:[0.002,0.005], hue:[19,21], saturation:0.9,  brightness:0.6  },
    { id: "neoncity",     cat: "presetCatGames",   name: "Neon City",     waves:4, width:150, rotation:60,  amplitude:0.8, speed:[0.006,0.012], hue:[8,16],  saturation:1.0,  brightness:1.0  },
    { id: "digitalrain",  cat: "presetCatGames",   name: "Digital Rain",  waves:6, width:200, rotation:90,  amplitude:0.2, speed:[0.004,0.008], hue:[19.5,20.5], saturation:1.0, brightness:0.45 },
    { id: "underworld",   cat: "presetCatGames",   name: "Underworld",    waves:3, width:100, rotation:40,  amplitude:0.6, speed:[0.004,0.008], hue:[3.5,6.5], saturation:0.95, brightness:0.7  },
    // Seasons
    { id: "spring",       cat: "presetCatSeasons",  name: "Wiosna",        waves:3, width:120, rotation:45,  amplitude:0.5, speed:[0.003,0.006], hue:[17.5,22.5], saturation:0.7, brightness:0.9  },
    { id: "summer",       cat: "presetCatSeasons",  name: "Lato",          waves:4, width:140, rotation:50,  amplitude:0.6, speed:[0.004,0.008], hue:[23,27], saturation:0.85, brightness:1.0  },
    { id: "autumn",       cat: "presetCatSeasons",  name: "Jesień",        waves:3, width:100, rotation:35,  amplitude:0.4, speed:[0.003,0.006], hue:[2,8],   saturation:0.75, brightness:0.65 },
    { id: "winter",       cat: "presetCatSeasons",  name: "Zima",          waves:2, width:90,  rotation:40,  amplitude:0.3, speed:[0.002,0.005], hue:[13.5,16.5], saturation:0.25, brightness:0.85 },
    // Time of day
    { id: "dawn",         cat: "presetCatDaytime",  name: "Świt",          waves:3, width:130, rotation:45,  amplitude:0.5, speed:[0.003,0.006], hue:[20,30], saturation:0.6,  brightness:0.75 },
    { id: "noon",         cat: "presetCatDaytime",  name: "Południe",      waves:2, width:80,  rotation:45,  amplitude:0.3, speed:[0.002,0.005], hue:[12.5,17.5], saturation:0.5, brightness:1.0  },
    { id: "sunset",       cat: "presetCatDaytime",  name: "Zachód",        waves:4, width:150, rotation:55,  amplitude:0.7, speed:[0.004,0.008], hue:[1,9],   saturation:1.0,  brightness:0.8  },
    { id: "night",        cat: "presetCatDaytime",  name: "Noc",           waves:2, width:100, rotation:40,  amplitude:0.4, speed:[0.002,0.005], hue:[10,14], saturation:0.6,  brightness:0.35 },
    // Themes
    { id: "iosdark",      cat: "presetCatThemes",   name: "iOS Dark",      waves:2, width:90,  rotation:40,  amplitude:0.3, speed:[0.002,0.004], hue:[14,16], saturation:0.2,  brightness:0.5  },
    { id: "materialyou",  cat: "presetCatThemes",   name: "Material You",  waves:3, width:120, rotation:45,  amplitude:0.5, speed:[0.004,0.007], hue:[15,21], saturation:0.9,  brightness:0.85 },
    { id: "amoled",       cat: "presetCatThemes",   name: "AMOLED",        waves:2, width:70,  rotation:35,  amplitude:0.2, speed:[0.002,0.004], hue:[9,11],  saturation:0.4,  brightness:0.2  },
    { id: "monokai",      cat: "presetCatThemes",   name: "Monokai",       waves:3, width:110, rotation:45,  amplitude:0.5, speed:[0.004,0.007], hue:[2.5,7.5], saturation:0.8, brightness:0.55 },
  ];

  function rnd(a, b) { return b === undefined ? Math.random() * a : a + Math.random() * (b - a); }
  function rndSign() { return Math.random() > 0.5 ? 1 : -1; }
  function degToRad(d) { return (d * Math.PI) / 180; }

  class Line {
    constructor(wave, color) {
      const { angle, speed } = wave;
      this.angle = [
        Math.sin((angle[0] += speed[0])),
        Math.sin((angle[1] += speed[1])),
        Math.sin((angle[2] += speed[2])),
        Math.sin((angle[3] += speed[3])),
      ];
      this.color = color;
    }
  }

  class Wave {
    constructor(r) {
      this.ribbons = r;
      this.lines = [];
      this.angle = [rnd(TAU), rnd(TAU), rnd(TAU), rnd(TAU)];
      // Each angle keeps its place in the speed range and its direction, so a
      // new range from the GUI rescales the running wave instead of needing a reload.
      this.mix = [rnd(1), rnd(1), rnd(1), rnd(1)];
      this.sign = [rndSign(), rndSign(), rndSign(), rndSign()];
      this.setSpeed(r.options.speed);
    }
    setSpeed(range) {
      const lo = range[0], hi = range[1];
      this.speed = this.mix.map((m, i) => (lo + m * (hi - lo)) * this.sign[i]);
    }
    update() {
      this.lines.push(new Line(this, this.ribbons.color));
      // while, not if: a shorter trail from the GUI takes effect at once
      while (this.lines.length > this.ribbons.options.width) this.lines.shift();
    }
    draw(ctx) {
      const r = this.ribbons;
      const radius = r.radius, cx = r.cx, cy = r.cy, options = r.options;
      const r3 = radius / 3, rot = degToRad(options.rotation), amp = options.amplitude;
      for (const l of this.lines) {
        const a = l.angle;
        ctx.strokeStyle = l.color;
        ctx.beginPath();
        ctx.moveTo(cx - radius * Math.cos(a[0] * amp + rot), cy - radius * Math.sin(a[0] * amp + rot));
        ctx.bezierCurveTo(
          cx - r3 * Math.cos(a[1] * amp * 2), cy - r3 * Math.sin(a[1] * amp * 2),
          cx + r3 * Math.cos(a[2] * amp * 2), cy + r3 * Math.sin(a[2] * amp * 2),
          cx + radius * Math.cos(a[3] * amp + rot), cy + radius * Math.sin(a[3] * amp + rot)
        );
        ctx.stroke();
      }
    }
  }

  const DEFAULTS = {
    rotation: 45,
    waves: 3,
    width: 120,
    hue: [11, 14],
    amplitude: 0.5,
    speed: [0.004, 0.008],
    saturation: 0.8,
    brightness: 1.0,
    cardAlpha: 0.85,
    headerAlpha: 0.7,
    sidebarAlpha: 0.8,
    themeMode: "full",
    performanceMode: "auto",
  };

  // Clamp value to valid range
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function isFirefox() {
    return typeof navigator !== "undefined" && /firefox/i.test(navigator.userAgent || "");
  }

  function effectivePerfMode(mode) {
    if (mode === "high" || mode === "low") return mode;
    return isFirefox() ? "low" : "high";
  }

  // Parses #rgb, #rrggbb, #rrggbbaa, rgb() and rgba() into [r, g, b]; returns null for anything else.
  function parseColor(str) {
    var v = String(str || "").trim().toLowerCase();
    var m = v.match(/^#([0-9a-f]{3,8})$/);
    if (m) {
      var h = m[1];
      if (h.length === 3 || h.length === 4) h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2);
      if (h.length < 6) return null;
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    }
    m = v.match(/^rgba?\(\s*([0-9.]+)[\s,]+([0-9.]+)[\s,]+([0-9.]+)/);
    if (m) return [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])];
    return null;
  }

  // True when the active theme draws dark text, i.e. it is a light theme. The theme's variables live on <html>;
  // this plugin overrides them on <home-assistant>, so reading <html> still returns the theme's own value.
  function themeTextIsDark() {
    try {
      var c = parseColor(getComputedStyle(document.documentElement).getPropertyValue("--primary-text-color"));
      if (!c) return false;
      return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2] < 128;
    } catch (e) {
      return false;
    }
  }

  function buildThemeCss(opts) {
    var base =
      "html, body { background: #000 !important; }\n" +
      "home-assistant {\n" +
      "  --primary-background-color: transparent !important;\n" +
      "  --secondary-background-color: rgba(0,0,0,0.3) !important;\n";
    if (opts.themeMode === "canvas-only") {
      // Leave card/header/sidebar to the active theme (Material You, etc.)
      return base + "  --divider-color: rgba(255,255,255,0.08) !important;\n" + "}";
    }
    var cA = "rgba(32,33,36," + opts.cardAlpha + ")";
    var hA = "rgba(32,33,36," + opts.headerAlpha + ")";
    var sA = "rgba(32,33,36," + opts.sidebarAlpha + ")";
    return (
      base +
      "  --card-background-color: " + cA + " !important;\n" +
      "  --ha-card-background: " + cA + " !important;\n" +
      "  --app-header-background-color: " + hA + " !important;\n" +
      "  --sidebar-background-color: " + sA + " !important;\n" +
      // The header and sidebar are forced dark above, so their text has to be light too: with a light
      // theme the theme's dark text sits on the dark header and the view tabs disappear.
      "  --app-header-text-color: #e8eaed !important;\n" +
      "  --app-header-selection-bar-color: #e8eaed !important;\n" +
      "  --sidebar-text-color: #e8eaed !important;\n" +
      "  --sidebar-icon-color: #c4c7cc !important;\n" +
      "  --sidebar-selected-text-color: #ffffff !important;\n" +
      "  --sidebar-selected-icon-color: #ffffff !important;\n" +
      "  --divider-color: rgba(255,255,255,0.08) !important;\n" +
      // The surfaces above are always dark glass. With a light theme every other piece of text (cards, dialogs, lists)
      // would keep the theme's dark colour on that dark glass, so the text tokens switch to the dark-theme values too.
      (themeTextIsDark()
        ? "  --primary-text-color: #e1e1e1 !important;\n" +
          "  --secondary-text-color: #9b9b9b !important;\n" +
          "  --disabled-text-color: #6f6f6f !important;\n" +
          "  --outline-color: rgba(225,225,225,0.12) !important;\n" +
          "  --input-fill-color: rgba(255,255,255,0.05) !important;\n" +
          "  color-scheme: dark;\n"
        : "") +
      "}"
    );
  }

  // Validate and sanitize a config value
  function sanitizeConfig(parsed) {
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
    var clean = {};
    if (typeof parsed.waves === "number" && isFinite(parsed.waves))
      clean.waves = clamp(Math.round(parsed.waves), 1, 8);
    if (typeof parsed.width === "number" && isFinite(parsed.width))
      clean.width = clamp(Math.round(parsed.width), 20, 300);
    if (typeof parsed.rotation === "number" && isFinite(parsed.rotation))
      clean.rotation = clamp(parsed.rotation, 0, 360);
    if (typeof parsed.amplitude === "number" && isFinite(parsed.amplitude))
      clean.amplitude = clamp(parsed.amplitude, 0.1, 2.0);
    if (typeof parsed.cardAlpha === "number" && isFinite(parsed.cardAlpha))
      clean.cardAlpha = clamp(parsed.cardAlpha, 0, 1);
    if (typeof parsed.headerAlpha === "number" && isFinite(parsed.headerAlpha))
      clean.headerAlpha = clamp(parsed.headerAlpha, 0, 1);
    if (typeof parsed.saturation === "number" && isFinite(parsed.saturation))
      clean.saturation = clamp(parsed.saturation, 0, 1);
    if (typeof parsed.brightness === "number" && isFinite(parsed.brightness))
      clean.brightness = clamp(parsed.brightness, 0, 1);
    if (typeof parsed.sidebarAlpha === "number" && isFinite(parsed.sidebarAlpha))
      clean.sidebarAlpha = clamp(parsed.sidebarAlpha, 0, 1);
    if (parsed.themeMode === "full" || parsed.themeMode === "canvas-only")
      clean.themeMode = parsed.themeMode;
    if (parsed.performanceMode === "auto" || parsed.performanceMode === "high" || parsed.performanceMode === "low")
      clean.performanceMode = parsed.performanceMode;
    if (Array.isArray(parsed.speed) && parsed.speed.length === 2 &&
        typeof parsed.speed[0] === "number" && typeof parsed.speed[1] === "number" &&
        isFinite(parsed.speed[0]) && isFinite(parsed.speed[1]))
      clean.speed = [clamp(parsed.speed[0], 0.001, 0.02), clamp(parsed.speed[1], 0.002, 0.04)];
    if (Array.isArray(parsed.hue) && parsed.hue.length === 2 &&
        typeof parsed.hue[0] === "number" && typeof parsed.hue[1] === "number" &&
        isFinite(parsed.hue[0]) && isFinite(parsed.hue[1]))
      clean.hue = [clamp(parsed.hue[0], 0, 30), clamp(parsed.hue[1], 0, 30)];
    return clean;
  }

  // Load saved config from localStorage
  function loadConfig() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? sanitizeConfig(JSON.parse(raw)) : {};
    } catch (e) { return {}; }
  }

  function saveConfig(cfg) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  }

  // --- Per-panel enable/disable ---
  function getCurrentPanel() {
    return location.pathname;
  }

  function loadPanelStates() {
    try {
      var raw = localStorage.getItem(PANELS_KEY);
      var parsed = raw ? JSON.parse(raw) : {};
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
      return parsed;
    } catch (e) { return {}; }
  }

  function savePanelStates(states) {
    localStorage.setItem(PANELS_KEY, JSON.stringify(states));
  }

  function isPanelEnabled(path) {
    var states = loadPanelStates();
    // Default: enabled (true). Only disabled if explicitly set to false.
    return states[path] !== false;
  }

  function setPanelEnabled(path, enabled) {
    var states = loadPanelStates();
    if (enabled) {
      delete states[path]; // Remove entry = default (enabled)
    } else {
      states[path] = false;
    }
    savePanelStates(states);
  }

  // --- Animation on/off: Home Assistant-wide default + per-device override (issue #9) ---
  // The decision is made before anything is drawn, so a device that should stay off never creates the canvas.
  function getDeviceAnimation() {
    try {
      var v = localStorage.getItem(DEVICE_KEY);
      return v === "on" || v === "off" ? v : "default";
    } catch (e) { return "default"; }
  }

  function setDeviceAnimation(v) {
    if (v === "on" || v === "off") localStorage.setItem(DEVICE_KEY, v);
    else localStorage.removeItem(DEVICE_KEY);
  }

  function windowEnabled() {
    var cfg = window.canvasRibbonsConfig;
    return cfg && typeof cfg.enabled === "boolean" ? cfg.enabled : null;
  }

  function defaultEntityId() {
    var cfg = window.canvasRibbonsConfig;
    return cfg && typeof cfg.enabledEntity === "string" && cfg.enabledEntity.length > 0 ? cfg.enabledEntity : DEFAULT_ENTITY;
  }

  function prefersReducedMotion() {
    try {
      return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    } catch (e) { return false; }
  }

  // Home Assistant-wide default, ignoring this device's own choice:
  // window.canvasRibbonsConfig.enabled > input_boolean.canvas_ribbons > prefers-reduced-motion > on.
  function globalDefault(hass) {
    var w = windowEnabled();
    if (w !== null) return { enabled: w, source: "canvasRibbonsConfig.enabled" };
    var id = defaultEntityId();
    var s = hass && hass.states ? hass.states[id] : null;
    if (s && (s.state === "on" || s.state === "off")) return { enabled: s.state === "on", source: id };
    if (prefersReducedMotion()) return { enabled: false, source: "prefers-reduced-motion" };
    return { enabled: true, source: "default" };
  }

  // This device's choice always wins, so a powerful device can turn the animation back on.
  function animationDecision(hass) {
    var d = getDeviceAnimation();
    if (d !== "default") return { enabled: d === "on", source: "this device" };
    return globalDefault(hass);
  }

  function currentHass() {
    try {
      var ha = document.querySelector("home-assistant");
      return ha && ha.hass && ha.hass.states ? ha.hass : null;
    } catch (e) { return null; }
  }

  // Calls cb(hass) once the decision can be made. Waits for hass only when the default entity could matter;
  // outside the HA frontend (no <home-assistant>) it answers at once. Polling is cheap and draws nothing.
  function whenDecidable(cb) {
    if (getDeviceAnimation() !== "default" || windowEnabled() !== null) { cb(currentHass()); return; }
    var tries = 0;
    (function poll() {
      if (!document.querySelector("home-assistant")) { cb(null); return; }
      var hass = currentHass();
      if (hass) { cb(hass); return; }
      tries++;
      setTimeout(poll, tries < 100 ? 100 : 1000);
    })();
  }

  // --- Auto-sun ---
  var SUN_KEY = "ha-canvas-ribbons-sun";

  function loadSunConfig() {
    try {
      var raw = localStorage.getItem(SUN_KEY);
      var parsed = raw ? JSON.parse(raw) : {};
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return { enabled: false, entity: "sun.sun" };
      return {
        enabled: parsed.enabled === true,
        entity: typeof parsed.entity === "string" && parsed.entity.length > 0 ? parsed.entity : "sun.sun",
      };
    } catch (e) { return { enabled: false, entity: "sun.sun" }; }
  }

  function saveSunConfig(cfg) {
    localStorage.setItem(SUN_KEY, JSON.stringify(cfg));
  }

  // Map sun elevation + rising to a daytime preset id
  function sunToPresetId(elevation, rising) {
    if (elevation < -6) return "night";
    if (elevation < 0) return rising ? "dawn" : "sunset";
    if (elevation < 15) return rising ? "dawn" : "sunset";
    return "noon";
  }

  function getHassState(entityId) {
    try {
      var ha = document.querySelector("home-assistant");
      if (ha && ha.hass && ha.hass.states && ha.hass.states[entityId]) {
        return ha.hass.states[entityId];
      }
    } catch (e) {}
    return null;
  }

  // --- GUI ---
  function buildGUI(opts, state, reinit) {
    var panel = document.getElementById("ha-canvas-ribbons-gui");
    if (panel) { panel.style.display = panel.style.display === "none" ? "flex" : "none"; return; }

    var sliders = [
      { key: "waves",        label: T.waves,        min: 1,     max: 8,     step: 1,     val: opts.waves         },
      { key: "width",        label: T.trailWidth,    min: 20,    max: 300,   step: 10,    val: opts.width         },
      { key: "rotation",     label: T.rotation,      min: 0,     max: 360,   step: 5,     val: opts.rotation      },
      { key: "amplitude",    label: T.amplitude,     min: 0.1,   max: 2.0,   step: 0.1,   val: opts.amplitude     },
      { key: "speedMin",     label: T.speedMin,      min: 0.001, max: 0.02,  step: 0.001, val: opts.speed[0]      },
      { key: "speedMax",     label: T.speedMax,      min: 0.002, max: 0.04,  step: 0.001, val: opts.speed[1]      },
      { key: "saturation",  label: T.saturation,    min: 0,     max: 1,     step: 0.05,  val: opts.saturation    },
      { key: "brightness",  label: T.brightness,    min: 0,     max: 1,     step: 0.05,  val: opts.brightness    },
      { key: "cardAlpha",   label: T.cardAlpha,     min: 0,     max: 1,     step: 0.05,  val: opts.cardAlpha     },
      { key: "headerAlpha",  label: T.headerAlpha,   min: 0,     max: 1,     step: 0.05,  val: opts.headerAlpha   },
      { key: "sidebarAlpha", label: T.sidebarAlpha,  min: 0,     max: 1,     step: 0.05,  val: opts.sidebarAlpha  },
    ];

    panel = document.createElement("div");
    panel.id = "ha-canvas-ribbons-gui";
    panel.style.cssText =
      "position:fixed;top:50%;right:16px;transform:translateY(-50%);z-index:1000;" +
      "background:rgba(20,20,24,0.95);border:1px solid rgba(255,255,255,0.15);border-radius:12px;" +
      "padding:16px 18px;display:flex;flex-direction:column;gap:6px;pointer-events:auto;" +
      "font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#eee;font-size:12px;" +
      "min-width:240px;box-shadow:0 8px 32px rgba(0,0,0,0.6);backdrop-filter:blur(12px);";

    // Title bar
    var titleBar = document.createElement("div");
    titleBar.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;";
    var title = document.createElement("span");
    title.textContent = T.title;
    title.style.cssText = "font-size:14px;font-weight:600;letter-spacing:0.3px;";
    var closeBtn = document.createElement("button");
    closeBtn.textContent = "\u2715";
    closeBtn.style.cssText = "background:none;border:none;color:#888;font-size:16px;cursor:pointer;padding:0 2px;";
    closeBtn.onclick = function () { panel.style.display = "none"; };
    titleBar.appendChild(title);
    titleBar.appendChild(closeBtn);
    panel.appendChild(titleBar);

    // Animation on this device: follow the HA-wide default, or force on/off here. Applied with a reload, so
    // turning it on starts the canvas cleanly and turning it off releases it completely.
    var deviceRow = document.createElement("div");
    deviceRow.style.cssText = "display:flex;align-items:center;gap:8px;padding:4px 0 6px 0;border-bottom:1px solid rgba(255,255,255,0.08);margin-bottom:4px;";
    var deviceLbl = document.createElement("label");
    deviceLbl.textContent = T.deviceAnim;
    deviceLbl.style.cssText = "min-width:90px;color:#aaa;font-size:11px;";
    var deviceSel = document.createElement("select");
    deviceSel.id = "ha-canvas-ribbons-device";
    deviceSel.style.cssText = "flex:1;background:#1a1a22;color:#eee;border:1px solid rgba(255,255,255,0.15);border-radius:4px;padding:3px 6px;font-size:11px;cursor:pointer;";
    var gDefault = globalDefault(currentHass());
    var curDevice = getDeviceAnimation();
    [
      { value: "default", label: T.deviceAnimDefault + " (" + (gDefault.enabled ? T.deviceAnimOn : T.deviceAnimOff) + ")" },
      { value: "on", label: T.deviceAnimOn },
      { value: "off", label: T.deviceAnimOff },
    ].forEach(function (o) {
      var opt = document.createElement("option");
      opt.value = o.value;
      opt.textContent = o.label;
      if (o.value === curDevice) opt.selected = true;
      deviceSel.appendChild(opt);
    });
    deviceSel.onchange = function () {
      setDeviceAnimation(deviceSel.value);
      location.reload();
    };
    deviceRow.appendChild(deviceLbl);
    deviceRow.appendChild(deviceSel);
    panel.appendChild(deviceRow);

    // Per-panel toggle
    var panelPath = getCurrentPanel();
    var toggleRow = document.createElement("div");
    toggleRow.style.cssText = "display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.08);margin-bottom:4px;";

    var toggleLabel = document.createElement("label");
    toggleLabel.style.cssText = "flex:1;color:#aaa;font-size:11px;cursor:pointer;display:flex;align-items:center;gap:6px;";

    var toggleCb = document.createElement("input");
    toggleCb.type = "checkbox";
    toggleCb.checked = isPanelEnabled(panelPath);
    toggleCb.style.cssText = "accent-color:#6d8fff;cursor:pointer;width:14px;height:14px;";

    var toggleText = document.createElement("span");
    toggleText.textContent = T.enablePanel;

    var panelPathLabel = document.createElement("div");
    panelPathLabel.textContent = panelPath;
    panelPathLabel.style.cssText = "color:#666;font-size:9px;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:200px;";

    toggleCb.onchange = function () {
      setPanelEnabled(panelPath, this.checked);
      var container = document.getElementById("ha-canvas-ribbons");
      var ribbonStyle = document.getElementById("ha-canvas-ribbons-style");
      if (this.checked) {
        if (container) container.style.display = "";
        if (ribbonStyle) ribbonStyle.disabled = false;
      } else {
        if (container) container.style.display = "none";
        if (ribbonStyle) ribbonStyle.disabled = true;
      }
    };

    toggleLabel.appendChild(toggleCb);
    toggleLabel.appendChild(toggleText);
    toggleRow.appendChild(toggleLabel);
    panel.appendChild(toggleRow);
    panel.appendChild(panelPathLabel);

    // --- Auto-sun toggle ---
    var sunCfg = loadSunConfig();
    var sunRow = document.createElement("div");
    sunRow.style.cssText = "display:flex;align-items:center;gap:8px;padding:4px 0;";

    var sunLabel = document.createElement("label");
    sunLabel.style.cssText = "flex:1;color:#aaa;font-size:11px;cursor:pointer;display:flex;align-items:center;gap:6px;";

    var sunCb = document.createElement("input");
    sunCb.type = "checkbox";
    sunCb.checked = sunCfg.enabled;
    sunCb.style.cssText = "accent-color:#f0a030;cursor:pointer;width:14px;height:14px;";

    var sunText = document.createElement("span");
    sunText.textContent = T.autoSun;

    sunLabel.appendChild(sunCb);
    sunLabel.appendChild(sunText);
    sunRow.appendChild(sunLabel);
    panel.appendChild(sunRow);

    // Sun entity input
    var sunEntityRow = document.createElement("div");
    sunEntityRow.style.cssText = "display:flex;align-items:center;gap:8px;padding:0 0 4px 0;";
    var sunEntityLbl = document.createElement("label");
    sunEntityLbl.textContent = T.sunEntity;
    sunEntityLbl.style.cssText = "min-width:90px;color:#aaa;font-size:11px;";
    var sunEntityInput = document.createElement("input");
    sunEntityInput.type = "text";
    sunEntityInput.value = sunCfg.entity;
    sunEntityInput.style.cssText = "flex:1;background:rgba(255,255,255,0.08);color:#ccc;border:1px solid rgba(255,255,255,0.15);" +
      "border-radius:4px;padding:3px 6px;font-size:11px;font-family:monospace;outline:none;";
    sunEntityInput.onchange = function () {
      sunCfg.entity = this.value.trim() || "sun.sun";
      saveSunConfig(sunCfg);
    };
    sunEntityRow.appendChild(sunEntityLbl);
    sunEntityRow.appendChild(sunEntityInput);
    panel.appendChild(sunEntityRow);

    // Sun phase display
    var sunPhaseRow = document.createElement("div");
    sunPhaseRow.style.cssText = "display:flex;align-items:center;gap:8px;padding:0 0 6px 0;border-bottom:1px solid rgba(255,255,255,0.08);margin-bottom:4px;";
    var sunPhaseLbl = document.createElement("label");
    sunPhaseLbl.textContent = T.sunPhase;
    sunPhaseLbl.style.cssText = "min-width:90px;color:#aaa;font-size:11px;";
    var sunPhaseVal = document.createElement("span");
    sunPhaseVal.style.cssText = "font-size:11px;color:#f0a030;";
    sunPhaseVal.textContent = "—";

    function updateSunPhaseDisplay() {
      var s = getHassState(sunCfg.entity);
      if (s && s.attributes) {
        var elev = s.attributes.elevation;
        var rising = s.attributes.rising;
        var pid = sunToPresetId(elev, rising);
        var p = PRESETS.find(function (x) { return x.id === pid; });
        sunPhaseVal.textContent = (p ? p.name : pid) + " (" + (typeof elev === "number" ? elev.toFixed(1) + "\u00B0" : "?") + ")";
      } else {
        sunPhaseVal.textContent = "—";
      }
    }
    updateSunPhaseDisplay();

    sunPhaseRow.appendChild(sunPhaseLbl);
    sunPhaseRow.appendChild(sunPhaseVal);
    panel.appendChild(sunPhaseRow);

    sunCb.onchange = function () {
      sunCfg.enabled = this.checked;
      saveSunConfig(sunCfg);
      if (this.checked) {
        updateSunPhaseDisplay();
        // Trigger immediate sun-based preset change
        var s = getHassState(sunCfg.entity);
        if (s && s.attributes) {
          var pid = sunToPresetId(s.attributes.elevation, s.attributes.rising);
          var p = PRESETS.find(function (x) { return x.id === pid; });
          if (p) {
            presetSelect.value = pid;
            applyPreset(p);
          }
        }
      }
    };

    // --- Preset selector ---
    var presetRow = document.createElement("div");
    presetRow.style.cssText = "display:flex;align-items:center;gap:8px;padding:4px 0 6px 0;border-bottom:1px solid rgba(255,255,255,0.08);margin-bottom:4px;";
    var presetLbl = document.createElement("label");
    presetLbl.textContent = T.preset;
    presetLbl.style.cssText = "min-width:90px;color:#aaa;font-size:11px;";
    var presetSelect = document.createElement("select");
    presetSelect.style.cssText = "flex:1;background:rgba(255,255,255,0.08);color:#ccc;border:1px solid rgba(255,255,255,0.15);" +
      "border-radius:4px;padding:3px 6px;font-size:11px;cursor:pointer;outline:none;color-scheme:dark;";

    var customOpt = document.createElement("option");
    customOpt.value = "";
    customOpt.textContent = T.presetCustom;
    presetSelect.appendChild(customOpt);

    var lastCat = "";
    PRESETS.forEach(function (p) {
      if (p.cat !== lastCat) {
        var grp = document.createElement("optgroup");
        grp.label = T[p.cat] || p.cat;
        PRESETS.forEach(function (pp) {
          if (pp.cat === p.cat) {
            var o = document.createElement("option");
            o.value = pp.id;
            o.textContent = pp.name;
            grp.appendChild(o);
          }
        });
        presetSelect.appendChild(grp);
        lastCat = p.cat;
      }
    });

    var applyingPreset = false;

    function applyPreset(p) {
      applyingPreset = true;
      opts.waves = p.waves; opts.width = p.width; opts.rotation = p.rotation;
      opts.amplitude = p.amplitude; opts.speed = [p.speed[0], p.speed[1]];
      opts.hue = [p.hue[0], p.hue[1]]; opts.saturation = p.saturation;
      opts.brightness = p.brightness;

      // Update all slider inputs
      var inputs = panel.querySelectorAll("input[type=range]");
      inputs.forEach(function (inp) {
        var key = inp.dataset.key;
        if (!key) return;
        var v;
        if (key === "speedMin") v = opts.speed[0];
        else if (key === "speedMax") v = opts.speed[1];
        else if (key === "saturation") v = opts.saturation;
        else if (key === "brightness") v = opts.brightness;
        else v = opts[key];
        if (v !== undefined) {
          inp.value = v;
          var ev = new Event("input", { bubbles: true });
          inp.dispatchEvent(ev);
        }
      });

      // Update hue position/range sliders
      if (huePosInput) {
        huePos = (p.hue[0] + p.hue[1]) / 2;
        hueWidth = p.hue[1] - p.hue[0];
        huePosInput.value = huePos;
        huePosVal.textContent = huePos.toFixed(1);
        hueRngInput.value = hueWidth;
        hueRngVal.textContent = hueWidth.toFixed(1);
        huePosInput.style.background = buildRainbowGradient();
        updateHuePreview();
      }

      saveConfig({
        waves: opts.waves, width: opts.width, rotation: opts.rotation,
        amplitude: opts.amplitude, speed: [opts.speed[0], opts.speed[1]],
        hue: [opts.hue[0], opts.hue[1]], saturation: opts.saturation,
        brightness: opts.brightness, cardAlpha: opts.cardAlpha,
        headerAlpha: opts.headerAlpha, sidebarAlpha: opts.sidebarAlpha,
          themeMode: opts.themeMode, performanceMode: opts.performanceMode,
      });
      applyingPreset = false;
    }

    presetSelect.onchange = function () {
      var id = this.value;
      if (!id) return;
      var p = PRESETS.find(function (x) { return x.id === id; });
      if (p) applyPreset(p);
    };

    presetRow.appendChild(presetLbl);
    presetRow.appendChild(presetSelect);
    
    panel.appendChild(presetRow);

    function addSelectRow(label, key, choices) {
      var row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;gap:8px;margin:6px 0;";
      var lbl = document.createElement("label");
      lbl.textContent = label;
      lbl.style.cssText = "min-width:90px;color:#aaa;font-size:11px;";
      var sel = document.createElement("select");
      sel.style.cssText = "flex:1;background:#1a1a1a;color:#eee;border:1px solid #333;border-radius:4px;padding:4px;font-size:11px;";
      choices.forEach(function (c) {
        var o = document.createElement("option");
        o.value = c.value; o.textContent = c.label;
        if (opts[key] === c.value) o.selected = true;
        sel.appendChild(o);
      });
      sel.onchange = function () {
        opts[key] = this.value;
        if (key === "themeMode") { updateStyle(); syncAlphaRows(); }
        saveConfig({
          waves: opts.waves, width: opts.width, rotation: opts.rotation,
          amplitude: opts.amplitude, speed: [opts.speed[0], opts.speed[1]],
          hue: [opts.hue[0], opts.hue[1]], saturation: opts.saturation,
          brightness: opts.brightness, cardAlpha: opts.cardAlpha,
          headerAlpha: opts.headerAlpha, sidebarAlpha: opts.sidebarAlpha,
          themeMode: opts.themeMode, performanceMode: opts.performanceMode,
        });
      };
      row.appendChild(lbl); row.appendChild(sel); panel.appendChild(row);
    }

    // Canvas-only mode leaves cards, header and sidebar to the active theme,
    // so the transparency sliders have nothing to act on: grey them out.
    function syncAlphaRows() {
      var off = opts.themeMode === "canvas-only";
      panel.querySelectorAll("input[data-key$='Alpha']").forEach(function (inp) {
        inp.disabled = off;
        inp.parentNode.style.opacity = off ? "0.4" : "1";
        inp.parentNode.title = off ? T.themeModeCanvas : "";
      });
    }
    addSelectRow(T.themeMode, "themeMode", [
      { value: "full", label: T.themeModeFull },
      { value: "canvas-only", label: T.themeModeCanvas },
    ]);
    addSelectRow(T.perfMode, "performanceMode", [
      { value: "auto", label: T.perfAuto },
      { value: "high", label: T.perfHigh },
      { value: "low", label: T.perfLow },
    ]);


    var valueDisplays = {};

    function updateStyle() {
      var s = document.getElementById("ha-canvas-ribbons-style");
      if (!s) return;
      s.textContent = buildThemeCss(opts);
    }

    sliders.forEach(function (s) {
      var row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;gap:8px;";

      var lbl = document.createElement("label");
      lbl.textContent = s.label;
      lbl.style.cssText = "min-width:90px;color:#aaa;font-size:11px;";

      var input = document.createElement("input");
      input.type = "range";
      input.dataset.key = s.key;
      input.min = s.min;
      input.max = s.max;
      input.step = s.step;
      input.value = s.val;
      input.style.cssText = "flex:1;accent-color:#6d8fff;height:4px;cursor:pointer;";

      var valSpan = document.createElement("span");
      valSpan.textContent = Number(s.val).toFixed(s.step < 1 ? String(s.step).split(".")[1].length : 0);
      valSpan.style.cssText = "min-width:36px;text-align:right;font-size:11px;color:#ccc;font-variant-numeric:tabular-nums;";
      valueDisplays[s.key] = valSpan;

      input.oninput = function () {
        var v = parseFloat(this.value);
        var decimals = s.step < 1 ? String(s.step).split(".")[1].length : 0;
        valSpan.textContent = v.toFixed(decimals);
        if (!applyingPreset) {
          presetSelect.value = "";
          // Disable auto-sun on manual change
          if (sunCb.checked) { sunCb.checked = false; sunCfg.enabled = false; saveSunConfig(sunCfg); }
        }

        if (s.key === "speedMin") { opts.speed[0] = v; }
        else if (s.key === "speedMax") { opts.speed[1] = v; }
        else { opts[s.key] = v; }

        if (s.key === "cardAlpha" || s.key === "headerAlpha" || s.key === "sidebarAlpha") {
          updateStyle();
        }
        if (s.key === "saturation" || s.key === "brightness") {
          if (huePosInput) huePosInput.style.background = buildRainbowGradient();
          updateHuePreview();
        }

        // Save to localStorage
        saveConfig({
          waves: opts.waves, width: opts.width, rotation: opts.rotation,
          amplitude: opts.amplitude, speed: [opts.speed[0], opts.speed[1]],
          hue: [opts.hue[0], opts.hue[1]], saturation: opts.saturation,
          brightness: opts.brightness, cardAlpha: opts.cardAlpha,
          headerAlpha: opts.headerAlpha, sidebarAlpha: opts.sidebarAlpha,
          themeMode: opts.themeMode, performanceMode: opts.performanceMode,
        });
      };

      row.appendChild(lbl);
      row.appendChild(input);
      row.appendChild(valSpan);
      panel.appendChild(row);
    });
    syncAlphaRows();

    // Inject slider thumb styles for hue rainbow slider
    if (!document.getElementById("ha-canvas-ribbons-hue-style")) {
      var hueStyle = document.createElement("style");
      hueStyle.id = "ha-canvas-ribbons-hue-style";
      hueStyle.textContent =
        "#ha-canvas-ribbons-hue::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#fff;border:2px solid #333;box-shadow:0 1px 4px rgba(0,0,0,0.5);cursor:pointer;}" +
        "#ha-canvas-ribbons-hue::-moz-range-thumb{width:14px;height:14px;border-radius:50%;background:#fff;border:2px solid #333;box-shadow:0 1px 4px rgba(0,0,0,0.5);cursor:pointer;}" +
        "#ha-canvas-ribbons-hue::-moz-range-track{height:12px;border-radius:6px;}";
      document.head.appendChild(hueStyle);
    }

    // --- Hue position + range sliders with color preview ---
    function hueToRgb(h) {
      var r0 = 127 * Math.sin(0.3 * h) + 128;
      var g0 = 127 * Math.sin(0.3 * h + 2) + 128;
      var b0 = 127 * Math.sin(0.3 * h + 4) + 128;
      var gray = (r0 + g0 + b0) / 3;
      var sat = opts.saturation, brt = opts.brightness;
      var r = Math.floor((gray + (r0 - gray) * sat) * brt);
      var g = Math.floor((gray + (g0 - gray) * sat) * brt);
      var b = Math.floor((gray + (b0 - gray) * sat) * brt);
      return "rgb(" + r + "," + g + "," + b + ")";
    }

    function buildRainbowGradient() {
      var stops = [];
      for (var i = 0; i <= 10; i++) {
        var h = (i / 10) * 30;
        stops.push(hueToRgb(h) + " " + (i * 10) + "%");
      }
      return "linear-gradient(to right," + stops.join(",") + ")";
    }

    var huePos = (opts.hue[0] + opts.hue[1]) / 2;
    var hueWidth = opts.hue[1] - opts.hue[0];

    function updateHuePreview() {
      if (huePreviewBar) {
        var lo = Math.max(0, huePos - hueWidth / 2);
        var hi = Math.min(30, huePos + hueWidth / 2);
        var stops = [];
        var steps = Math.max(2, Math.round((hi - lo) * 2));
        for (var i = 0; i <= steps; i++) {
          var h = lo + (i / steps) * (hi - lo);
          stops.push(hueToRgb(h));
        }
        huePreviewBar.style.background = stops.length > 1
          ? "linear-gradient(to right," + stops.join(",") + ")"
          : stops[0];
      }
    }

    function onHueChange() {
      opts.hue[0] = Math.max(0, huePos - hueWidth / 2);
      opts.hue[1] = Math.min(30, huePos + hueWidth / 2);
      updateHuePreview();
      saveConfig({
        waves: opts.waves, width: opts.width, rotation: opts.rotation,
        amplitude: opts.amplitude, speed: [opts.speed[0], opts.speed[1]],
        hue: [opts.hue[0], opts.hue[1]], cardAlpha: opts.cardAlpha,
        headerAlpha: opts.headerAlpha, sidebarAlpha: opts.sidebarAlpha,
          themeMode: opts.themeMode, performanceMode: opts.performanceMode,
      });
    }

    // Hue position slider
    var huePosRow = document.createElement("div");
    huePosRow.style.cssText = "display:flex;align-items:center;gap:8px;";
    var huePosLbl = document.createElement("label");
    huePosLbl.textContent = T.huePosition;
    huePosLbl.style.cssText = "min-width:90px;color:#aaa;font-size:11px;";
    var huePosInput = document.createElement("input");
    huePosInput.id = "ha-canvas-ribbons-hue";
    huePosInput.type = "range";
    huePosInput.min = 0;
    huePosInput.max = 30;
    huePosInput.step = 0.5;
    huePosInput.value = huePos;
    huePosInput.style.cssText = "flex:1;height:12px;cursor:pointer;-webkit-appearance:none;appearance:none;" +
      "border-radius:6px;outline:none;background:" + buildRainbowGradient() + ";";
    var huePosVal = document.createElement("span");
    huePosVal.textContent = huePos.toFixed(1);
    huePosVal.style.cssText = "min-width:36px;text-align:right;font-size:11px;color:#ccc;font-variant-numeric:tabular-nums;";
    huePosInput.oninput = function () {
      huePos = parseFloat(this.value);
      huePosVal.textContent = huePos.toFixed(1);
      if (!applyingPreset) presetSelect.value = "";
      onHueChange();
    };
    huePosRow.appendChild(huePosLbl);
    huePosRow.appendChild(huePosInput);
    huePosRow.appendChild(huePosVal);
    panel.appendChild(huePosRow);

    // Hue range slider
    var hueRngRow = document.createElement("div");
    hueRngRow.style.cssText = "display:flex;align-items:center;gap:8px;";
    var hueRngLbl = document.createElement("label");
    hueRngLbl.textContent = T.hueRange;
    hueRngLbl.style.cssText = "min-width:90px;color:#aaa;font-size:11px;";
    var hueRngInput = document.createElement("input");
    hueRngInput.type = "range";
    hueRngInput.min = 0;
    hueRngInput.max = 15;
    hueRngInput.step = 0.5;
    hueRngInput.value = hueWidth;
    hueRngInput.style.cssText = "flex:1;accent-color:#6d8fff;height:4px;cursor:pointer;";
    var hueRngVal = document.createElement("span");
    hueRngVal.textContent = hueWidth.toFixed(1);
    hueRngVal.style.cssText = "min-width:36px;text-align:right;font-size:11px;color:#ccc;font-variant-numeric:tabular-nums;";
    hueRngInput.oninput = function () {
      hueWidth = parseFloat(this.value);
      hueRngVal.textContent = hueWidth.toFixed(1);
      if (!applyingPreset) presetSelect.value = "";
      onHueChange();
    };
    hueRngRow.appendChild(hueRngLbl);
    hueRngRow.appendChild(hueRngInput);
    hueRngRow.appendChild(hueRngVal);
    panel.appendChild(hueRngRow);

    // Color preview bar
    var huePreviewBar = document.createElement("div");
    huePreviewBar.style.cssText = "height:8px;border-radius:4px;margin:2px 0 4px 0;";
    updateHuePreview();
    panel.appendChild(huePreviewBar);

    // --- Button position selector ---
    var btnPosRow = document.createElement("div");
    btnPosRow.style.cssText = "display:flex;align-items:center;gap:8px;padding:4px 0 6px 0;border-bottom:1px solid rgba(255,255,255,0.08);margin-bottom:4px;";
    var btnPosLbl = document.createElement("label");
    btnPosLbl.textContent = T.buttonPos;
    btnPosLbl.style.cssText = "min-width:90px;color:#aaa;font-size:11px;";
    var btnPosSel = document.createElement("select");
    btnPosSel.style.cssText = "flex:1;background:#1a1a22;color:#eee;border:1px solid rgba(255,255,255,0.15);border-radius:4px;padding:3px 6px;font-size:11px;cursor:pointer;";
    var btnPosOptions = [
      { value: "bottom-right", label: T.btnBottomRight },
      { value: "bottom-left",  label: T.btnBottomLeft },
      { value: "top-right",    label: T.btnTopRight },
      { value: "top-left",     label: T.btnTopLeft },
      { value: "hidden",       label: T.btnHidden },
    ];
    var curBtnPos = getButtonPosition();
    btnPosOptions.forEach(function (o) {
      var opt = document.createElement("option");
      opt.value = o.value;
      opt.textContent = o.label;
      if (o.value === curBtnPos) opt.selected = true;
      btnPosSel.appendChild(opt);
    });
    btnPosSel.onchange = function () { setButtonPosition(btnPosSel.value); };
    btnPosRow.appendChild(btnPosLbl);
    btnPosRow.appendChild(btnPosSel);
    panel.appendChild(btnPosRow);

    // Reset button
    var btnRow = document.createElement("div");
    btnRow.style.cssText = "display:flex;gap:8px;margin-top:6px;";

    var resetBtn = document.createElement("button");
    resetBtn.textContent = T.reset;
    resetBtn.style.cssText =
      "flex:1;padding:6px 0;border:1px solid rgba(255,255,255,0.15);border-radius:6px;" +
      "background:rgba(255,255,255,0.06);color:#ccc;cursor:pointer;font-size:11px;";
    resetBtn.onclick = function () {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(BUTTON_KEY);
      location.reload();
    };
    btnRow.appendChild(resetBtn);

    var saveBtn = document.createElement("button");
    saveBtn.textContent = T.saveClose;
    saveBtn.style.cssText =
      "flex:1;padding:6px 0;border:1px solid rgba(100,140,255,0.4);border-radius:6px;" +
      "background:rgba(109,143,255,0.25);color:#9db8ff;cursor:pointer;font-size:11px;font-weight:600;";
    saveBtn.onclick = function () { panel.style.display = "none"; };
    btnRow.appendChild(saveBtn);
    panel.appendChild(btnRow);

    // Version + GitHub link
    var ver = document.createElement("div");
    ver.style.cssText = "text-align:center;font-size:10px;margin-top:2px;";
    var verText = document.createTextNode("v" + VERSION + " \u2022 ");
    var ghLink = document.createElement("a");
    ghLink.href = "https://github.com/jrx-code/ha-canvas-ribbons";
    ghLink.target = "_blank";
    ghLink.rel = "noopener noreferrer";
    ghLink.textContent = "GitHub";
    ghLink.style.cssText = "color:#6d8fff;text-decoration:none;";
    ver.style.color = "#555";
    ver.appendChild(verText);
    ver.appendChild(ghLink);
    panel.appendChild(ver);

    document.body.appendChild(panel);
  }

  // --- Floating toggle button ---
  function createToggleButton(opts, state) {
    var btn = document.createElement("button");
    btn.id = "ha-canvas-ribbons-toggle";
    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    var path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", "M4 12c0 0 4-8 8-8s8 8 8 8-4 8-8 8-8-8-8-8z");
    var circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", "12");
    circle.setAttribute("cy", "12");
    circle.setAttribute("r", "3");
    svg.appendChild(path);
    svg.appendChild(circle);
    btn.appendChild(svg);
    var btnPos = getButtonPosition();
    var coords = BTN_POSITIONS[btnPos] || BTN_POSITIONS["bottom-right"];
    var posStyle = btnPos === "hidden" ? "display:none;" : (
      "top:" + (coords.top || "auto") + ";bottom:" + (coords.bottom || "auto") + ";" +
      "left:" + (coords.left || "auto") + ";right:" + (coords.right || "auto") + ";"
    );
    btn.style.cssText =
      "position:fixed;" + posStyle + "z-index:999;width:40px;height:40px;" +
      "border-radius:50%;border:1px solid rgba(255,255,255,0.15);background:rgba(20,20,24,0.8);" +
      "color:#6d8fff;cursor:pointer;display:flex;align-items:center;justify-content:center;" +
      "pointer-events:auto;box-shadow:0 2px 12px rgba(0,0,0,0.4);backdrop-filter:blur(8px);" +
      "transition:transform 0.15s,background 0.15s;";
    btn.onmouseenter = function () { btn.style.transform = "scale(1.1)"; btn.style.background = "rgba(40,40,48,0.9)"; };
    btn.onmouseleave = function () { btn.style.transform = "scale(1)"; btn.style.background = "rgba(20,20,24,0.8)"; };
    btn.onclick = function () { buildGUI(opts, state); };
    document.body.appendChild(btn);

    // ?canvas-ribbons=settings opens the GUI (the way back when the button is
    // hidden). Checked on load and on every HA navigation, so a dashboard
    // button that navigates to "<view>?canvas-ribbons=settings" works in the
    // Companion app, where the address bar cannot be edited.
    function openFromUrl() {
      try {
        var params = new URLSearchParams(window.location.search);
        if (params.get("canvas-ribbons") !== "settings") return;
        var gui = document.getElementById("ha-canvas-ribbons-gui");
        if (gui && gui.style.display !== "none") return;
        setTimeout(function () { buildGUI(opts, state); }, 500);
      } catch (e) {}
    }
    openFromUrl();
    return openFromUrl;
  }

  // --- Main ---
  function buildOptions() {
    // Merge: defaults < localStorage < window config (all validated)
    var saved = loadConfig();
    var windowCfg = sanitizeConfig(window.canvasRibbonsConfig || {});
    var opts = Object.assign({}, DEFAULTS, saved, windowCfg);

    // Ensure arrays are proper
    if (!Array.isArray(opts.speed)) opts.speed = [DEFAULTS.speed[0], DEFAULTS.speed[1]];
    if (!Array.isArray(opts.hue)) opts.hue = [DEFAULTS.hue[0], DEFAULTS.hue[1]];
    return opts;
  }

  function isInjected() {
    return !!(document.getElementById("ha-canvas-ribbons") || document.getElementById("ha-canvas-ribbons-toggle"));
  }

  // Animation off on this device: no canvas, no theme override, no animation loop. Only the settings button
  // (and ?canvas-ribbons=settings) stays, so the animation can be turned on for this device.
  function createDisabled(decision) {
    var opts = buildOptions();
    var openGuiFromUrl = createToggleButton(opts, null);
    window.addEventListener("location-changed", openGuiFromUrl);
    window._haCanvasRibbonsDestroy = function () {
      window.removeEventListener("location-changed", openGuiFromUrl);
      ["ha-canvas-ribbons-gui", "ha-canvas-ribbons-toggle", "ha-canvas-ribbons-hue-style"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.remove();
      });
      delete window._haCanvasRibbonsDestroy;
    };
    console.info("[ha-canvas-ribbons] v" + VERSION + " animation off on this device (" + decision.source + ")");
  }

  function boot() {
    if (isInjected()) {
      console.info("[ha-canvas-ribbons] v" + VERSION + " already injected");
      return;
    }
    whenDecidable(function (hass) {
      if (isInjected()) return;
      var decision = animationDecision(hass);
      if (decision.enabled) createRibbonCanvas();
      else createDisabled(decision);
    });
  }

  function createRibbonCanvas() {
    var opts = buildOptions();

    // Container
    var container = document.createElement("div");
    container.id = "ha-canvas-ribbons";
    container.style.cssText =
      "position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:0;pointer-events:none;";

    var canvas = document.createElement("canvas");
    container.appendChild(canvas);
    document.body.prepend(container);

    // Transparent HA theme
    var style = document.createElement("style");
    style.id = "ha-canvas-ribbons-style";
    function applyStyle() {
      var css = buildThemeCss(opts);
      if (style.textContent !== css) style.textContent = css;
    }
    applyStyle();
    document.head.appendChild(style);

    // Switching the HA theme (light, dark, auto) rewrites the variables on <html>: rebuild the override so the text
    // tokens follow. The observer watches <html> only, so changing this style tag cannot retrigger it.
    var themeObserver = null;
    var themeRaf = 0;
    if (typeof MutationObserver !== "undefined") {
      themeObserver = new MutationObserver(function () {
        if (themeRaf) return;
        themeRaf = requestAnimationFrame(function () { themeRaf = 0; applyStyle(); });
      });
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["style", "class"] });
    }

    // Canvas state
    var ctx = canvas.getContext("2d");
    var state = {
      hue: opts.hue[0], hueFw: true, color: "rgba(128,128,128,0.1)",
      w: 0, h: 0, cx: 0, cy: 0, radius: 0, gradient: null, lastColor: null,
      options: opts,
    };

    function resize() {
      var perf = effectivePerfMode(opts.performanceMode);
      var dprCap = perf === "low" ? 1 : 1.25;
      var s = Math.min(window.devicePixelRatio || 1, dprCap);
      var w = window.innerWidth, h = window.innerHeight;
      canvas.width = w * s;
      canvas.height = h * s;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      state.w = canvas.width;
      state.h = canvas.height;
      state.cx = state.w / 2;
      state.cy = state.h / 2;
      state.radius = Math.sqrt(state.w * state.w + state.h * state.h) / 2;
      state.gradient = null;
    }

    resize();
    window.addEventListener("resize", resize);

    // Waves (clamped as defense-in-depth against malformed config)
    var waves = [];
    for (var i = 0; i < Math.min(opts.waves, 8); i++) waves.push(new Wave(state));

    function updateColor() {
      state.hue += state.hueFw ? 0.01 : -0.01;
      if (state.hue > opts.hue[1]) { state.hue = opts.hue[1]; state.hueFw = false; }
      else if (state.hue < opts.hue[0]) { state.hue = opts.hue[0]; state.hueFw = true; }
      var r0 = 127 * Math.sin(0.3 * state.hue) + 128;
      var g0 = 127 * Math.sin(0.3 * state.hue + 2) + 128;
      var b0 = 127 * Math.sin(0.3 * state.hue + 4) + 128;
      var gray = (r0 + g0 + b0) / 3;
      var sat = opts.saturation, brt = opts.brightness;
      var r = Math.floor((gray + (r0 - gray) * sat) * brt);
      var g = Math.floor((gray + (g0 - gray) * sat) * brt);
      var b = Math.floor((gray + (b0 - gray) * sat) * brt);
      state.color = "rgba(" + r + "," + g + "," + b + ",0.1)";
    }

    // Preload (clamped to safe maximums as defense-in-depth)
    var safeWaves = Math.min(opts.waves, 8);
    var safeWidth = Math.min(opts.width, 300);
    for (var i = 0; i < safeWaves; i++) {
      updateColor();
      for (var j = 0; j < safeWidth; j++) waves[i].update();
    }

    var rafId = null;
    var running = true;

    // Bring the running animation in line with opts. Called every frame, so
    // GUI sliders, presets and the auto-sun preset all apply without a reload.
    var appliedSpeed = opts.speed[0] + "," + opts.speed[1];
    var appliedPerf = effectivePerfMode(opts.performanceMode);
    function syncWithOptions() {
      var n = Math.max(1, Math.min(Math.round(opts.waves) || 1, 8));
      while (waves.length < n) {
        var w = new Wave(state);
        for (var j = 0; j < Math.min(opts.width, 300); j++) w.update();
        waves.push(w);
      }
      if (waves.length > n) waves.length = n;
      var speedKey = opts.speed[0] + "," + opts.speed[1];
      if (speedKey !== appliedSpeed) {
        appliedSpeed = speedKey;
        for (var q = 0; q < waves.length; q++) waves[q].setSpeed(opts.speed);
      }
      var perfNow = effectivePerfMode(opts.performanceMode);
      if (perfNow !== appliedPerf) {
        appliedPerf = perfNow;
        resize();
      }
    }

    var frameSkip = 0;
    function render() {
      if (!running) return;
      syncWithOptions();
      var perf = effectivePerfMode(opts.performanceMode);
      if (perf === "low") {
        frameSkip ^= 1;
        if (frameSkip) { rafId = requestAnimationFrame(render); return; }
      }
      // Low mode draws every other frame; advance the simulation twice per
      // drawn frame so ribbon speed, trail length and colour cycle stay the same.
      var steps = perf === "low" ? 2 : 1;
      for (var st = 1; st < steps; st++) {
        updateColor();
        for (var q = 0; q < waves.length; q++) waves[q].update();
      }
      updateColor();
      ctx.clearRect(0, 0, state.w, state.h);

      if (!state.gradient || state.lastColor !== state.color) {
        state.gradient = ctx.createLinearGradient(0, 0, 0, state.h);
        state.gradient.addColorStop(0, "#000");
        state.gradient.addColorStop(1, state.color);
        state.lastColor = state.color;
      }
      ctx.fillStyle = state.gradient;
      ctx.fillRect(0, 0, state.w, state.h);

      ctx.lineWidth = 1;
      for (var k = 0; k < waves.length; k++) { waves[k].update(); waves[k].draw(ctx); }
      rafId = requestAnimationFrame(render);
    }

    // Pause animation when tab is hidden to save resources
    function onVisibilityChange() {
      if (document.hidden) {
        running = false;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      } else if (isPanelEnabled(getCurrentPanel())) {
        running = true;
        render();
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Check per-panel state on init
    var currentEnabled = isPanelEnabled(getCurrentPanel());
    if (!currentEnabled) {
      container.style.display = "none";
      style.disabled = true;
      running = false;
    }

    if (running) render();

    // Listen for HA SPA navigation to show/hide per-panel
    function onNavigate() {
      var enabled = isPanelEnabled(getCurrentPanel());
      if (enabled && !running) {
        container.style.display = "";
        style.disabled = false;
        running = true;
        render();
      } else if (!enabled && running) {
        running = false;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        container.style.display = "none";
        style.disabled = true;
      }
      // Update GUI toggle if open
      var gui = document.getElementById("ha-canvas-ribbons-gui");
      if (gui) {
        var cb = gui.querySelector("input[type=checkbox]");
        if (cb) cb.checked = enabled;
      }
    }
    // HA fires 'location-changed' on window for SPA navigation
    window.addEventListener("location-changed", onNavigate);
    window.addEventListener("popstate", onNavigate);

    // Cleanup function for proper resource release
    window._haCanvasRibbonsDestroy = function () {
      running = false;
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      if (sunIntervalId) { clearInterval(sunIntervalId); sunIntervalId = null; }
      window.removeEventListener("resize", resize);
      window.removeEventListener("location-changed", onNavigate);
      window.removeEventListener("popstate", onNavigate);
      window.removeEventListener("location-changed", openGuiFromUrl);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (themeObserver) { themeObserver.disconnect(); themeObserver = null; }
      var el = document.getElementById("ha-canvas-ribbons");
      if (el) el.remove();
      var st = document.getElementById("ha-canvas-ribbons-style");
      if (st) st.remove();
      var gui = document.getElementById("ha-canvas-ribbons-gui");
      if (gui) gui.remove();
      var tog = document.getElementById("ha-canvas-ribbons-toggle");
      if (tog) tog.remove();
      var hs = document.getElementById("ha-canvas-ribbons-hue-style");
      if (hs) hs.remove();
      delete window._haCanvasRibbonsDestroy;
    };

    // GUI toggle button
    var openGuiFromUrl = createToggleButton(opts, state);
    window.addEventListener("location-changed", openGuiFromUrl);

    // --- Auto-sun polling ---
    var sunIntervalId = null;
    var lastSunPreset = null;

    function checkSun() {
      var cfg = loadSunConfig();
      if (!cfg.enabled) return;
      var s = getHassState(cfg.entity);
      if (!s || !s.attributes) return;
      var pid = sunToPresetId(s.attributes.elevation, s.attributes.rising);
      if (pid === lastSunPreset) return;
      lastSunPreset = pid;
      var p = PRESETS.find(function (x) { return x.id === pid; });
      if (!p) return;
      // Apply preset params directly (GUI may not be open)
      opts.waves = p.waves; opts.width = p.width; opts.rotation = p.rotation;
      opts.amplitude = p.amplitude; opts.speed = [p.speed[0], p.speed[1]];
      opts.hue = [p.hue[0], p.hue[1]]; opts.saturation = p.saturation;
      opts.brightness = p.brightness;
      saveConfig({
        waves: opts.waves, width: opts.width, rotation: opts.rotation,
        amplitude: opts.amplitude, speed: [opts.speed[0], opts.speed[1]],
        hue: [opts.hue[0], opts.hue[1]], saturation: opts.saturation,
        brightness: opts.brightness, cardAlpha: opts.cardAlpha,
        headerAlpha: opts.headerAlpha, sidebarAlpha: opts.sidebarAlpha,
          themeMode: opts.themeMode, performanceMode: opts.performanceMode,
      });
      console.info("[ha-canvas-ribbons] Sun auto-preset: " + p.name + " (elev=" + s.attributes.elevation + ")");
    }
    checkSun();
    sunIntervalId = setInterval(checkSun, 60000);

    console.info("[ha-canvas-ribbons] v" + VERSION + " loaded — " + opts.waves + " waves, width " + opts.width);
  }

  if (document.body) {
    boot();
  } else {
    document.addEventListener("DOMContentLoaded", boot);
  }
})();
