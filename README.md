# Canvas Ribbons Background for Home Assistant

**License:** MIT | **HACS:** Default | **HA:** 2024.1+

Animated canvas ribbon background for Home Assistant dashboards. Adds smooth, flowing ribbon animations behind your HA interface with full GUI configuration.

Based on `animation.79.canvas-ribbons` from [lovelace-bg-animation](https://github.com/ibz0q/lovelace-bg-animation) by [@ibz0q](https://github.com/ibz0q), which itself is based on [Boris Šehovac's CodePen](https://codepen.io/bsehovac/pen/LQVzxJ). Rewritten as a standalone, lightweight HACS plugin with live GUI configuration.

![Preview](screenshots/preview.png)

## Changelog

| Version | Type | Description |
|---|---|---|
| **1.x** | **Major** | **Single-file HACS plugin with canvas ribbon animation** |
| 1.12.0 | Fix | Every slider applies live again: speed, wave count, shorter trail and performance mode no longer need a reload ([#7](https://github.com/jrx-code/hassio-canvas-ribbons/issues/7)); alpha sliders greyed out in canvas-only mode; `?canvas-ribbons=settings` also works on in-app navigation, e.g. from a dashboard button in the Companion app ([#8](https://github.com/jrx-code/hassio-canvas-ribbons/issues/8)) |
| 1.11.1 | Fix | Repository renamed to `hassio-canvas-ribbons`: HACS path is now `/hacsfiles/hassio-canvas-ribbons/`, see *Moving from ha-canvas-ribbons* |
| 1.11 | Fix | Theme mode canvas-only for Material You (#4); Firefox/low perf mode (DPR cap + frame skip) (#3) |
| 1.10 | Minor | Configurable button position ([#1](https://github.com/jrx-code/hassio-canvas-ribbons/issues/1)) |
| 1.9 | Minor | Catalan (ca) translation |
| 1.8 | Minor | Auto-preset based on sun position (elevation + rising) |
| 1.7 | Minor | Save & close button (blue, default action) |
| 1.7.1 | Fix | Preset dropdown: dark theme colors, retain selection |
| 1.7.2 | Fix | HACS validation: remove deprecated type field, add topics |
| 1.6 | Minor | 16 presets in 4 categories (Games, Seasons, Time of day, Themes) |
| 1.5 | Minor | Saturation and brightness controls |
| 1.4 | Minor | Hue position+range sliders with rainbow gradient and color preview |
| 1.3 | Minor | i18n: PL, EN, DE, ES, CS with auto-detection |
| 1.2 | Minor | Per-panel enable/disable, security fixes (H1–H4) |
| 1.1 | Minor | GUI configuration panel, localStorage persistence |
| 1.0 | Minor | Initial release — canvas ribbons, HA theme transparency |

## Features

- Animated ribbon background rendered on HTML5 Canvas
- **GUI configuration panel** — click the button in the bottom-right corner
- **16 presets** (Pip-Boy, Neon City, seasons, iOS Dark, Material You…)
- Configurable parameters (waves, speed, colors, saturation, brightness, transparency)
- **Theme override**: full (cards/header/sidebar) or canvas-only (Material You compatible)
- **Performance mode**: auto / high / low (auto uses low on Firefox)
- Settings persisted to `localStorage`
- Lightweight, no dependencies
- HACS compatible

## Installation

### HACS (recommended)

[![Open your Home Assistant instance and open this repository inside HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=jrx-code&repository=hassio-canvas-ribbons&category=plugin)

1. Open HACS and search for **Canvas Ribbons Background** (it is in the HACS default store, no custom repository needed)
2. Download it
3. Add resource in **Settings → Dashboards → Resources**:
   - URL: `/hacsfiles/hassio-canvas-ribbons/ha-canvas-ribbons.js`
   - Type: JavaScript Module
4. Refresh browser (**Ctrl+Shift+R**)

### Moving from ha-canvas-ribbons

The repository was renamed from `ha-canvas-ribbons` to `hassio-canvas-ribbons` in 1.11.1.
HACS installs into a folder named after the repository, so after updating it adds a new
dashboard resource `/hacsfiles/hassio-canvas-ribbons/ha-canvas-ribbons.js` next to the
old `/hacsfiles/ha-canvas-ribbons/...` one. Loading both breaks the card. After updating:

1. **Settings → Dashboards → Resources**: delete the entry starting with `/hacsfiles/ha-canvas-ribbons/`
2. Delete the old folder `/config/www/community/ha-canvas-ribbons/`
3. Refresh browser (**Ctrl+Shift+R**)

Your settings are kept: they live in the browser under the same keys as before.

### Manual

1. Copy `dist/ha-canvas-ribbons.js` to your HA `/config/www/` directory
2. Add resource in **Settings → Dashboards → Resources**:
   - URL: `/local/ha-canvas-ribbons.js`
   - Type: JavaScript Module
3. Refresh browser (**Ctrl+Shift+R**)

## GUI Configuration

Click the floating button in the bottom-right corner to open the settings panel:

| Parameter | Range | Live | Description |
|---|---|---|---|
| Enable on panel | on/off | yes | Enable/disable ribbons per HA panel (stored per URL path) |
| Theme override | full / canvas-only | yes | `canvas-only` leaves card/header/sidebar to the theme (fixes Material You) |
| Performance | auto / high / low | yes | `low` caps DPR and skips frames; `auto` picks low on Firefox |
| Waves | 1–8 | yes | Number of ribbon waves |
| Trail width | 20–300 | yes | Length of ribbon trail |
| Rotation | 0–360° | yes | Rotation angle |
| Amplitude | 0.1–2.0 | yes | Wave amplitude |
| Speed min/max | 0.001–0.04 | yes | Animation speed range |
| Hue | 0–30 | yes | Color hue position (rainbow slider) |
| Hue range | 0–15 | yes | Color oscillation width |
| Saturation | 0–1 | yes | Color saturation |
| Brightness | 0–1 | yes | Color brightness |
| Card alpha | 0–1 | yes | Card background opacity (full theme mode only) |
| Header alpha | 0–1 | yes | Header opacity (full theme mode only) |
| Sidebar alpha | 0–1 | yes | Sidebar opacity (full theme mode only) |

Settings are saved to `localStorage` and persist across page reloads. Click **Reset** to restore defaults.
`localStorage` is per browser and per device: the Companion app on a phone keeps its own settings,
including the button position.

### Hidden button: opening the settings again

With **Button** set to *Hidden*, add `?canvas-ribbons=settings` to any dashboard URL, e.g.
`https://ha.example.com/lovelace/0?canvas-ribbons=settings`. In the Companion app, where the
address cannot be edited, add a button card that navigates there:

```yaml
type: button
name: Ribbons settings
icon: mdi:palette
tap_action:
  action: navigate
  navigation_path: /lovelace/0?canvas-ribbons=settings
```

Switching **Button** back to a corner position brings the floating button back.

## Advanced Configuration

You can also set config programmatically via `window.canvasRibbonsConfig`:

```html
<script>
  window.canvasRibbonsConfig = {
    waves: 3,
    width: 120,
    rotation: 45,
    amplitude: 0.5,
    speed: [0.004, 0.008],
    hue: [11, 14],
    saturation: 0.8,
    brightness: 1.0,
    cardAlpha: 0.85,
    headerAlpha: 0.7,
    sidebarAlpha: 0.8,
    themeMode: "full",           // or "canvas-only"
    performanceMode: "auto",     // or "high" / "low"
  };
</script>
```

Config priority: defaults → localStorage → `window.canvasRibbonsConfig`

## How it works

1. Injects a `<canvas>` element on `document.body` with `z-index: 0` and `pointer-events: none`
2. Adds CSS custom properties for HA backgrounds (`full`) or only page background (`canvas-only`)
3. Renders animated Bézier curves (ribbons) via `requestAnimationFrame`
4. No iframes, no shadow DOM hacks — clean DOM injection

## Development

```bash
# Install dependencies (for tests)
npm install

# Run tests (20 unit tests, jsdom)
node canvas-ribbons.test.js

# Generate screenshot
node scripts/generate-screenshot.js
```

## License

[MIT](LICENSE) — Copyright (c) 2026 JI ENGINEERING

Based on `animation.79.canvas-ribbons` from [lovelace-bg-animation](https://github.com/ibz0q/lovelace-bg-animation) by [@ibz0q](https://github.com/ibz0q).
Original animation by [Boris Šehovac](https://codepen.io/bsehovac/pen/LQVzxJ).
