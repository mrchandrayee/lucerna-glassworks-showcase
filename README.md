# LUCERNA — Glassworks / Seven Shades

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://mrchandrayee.github.io/lucerna-glassworks-showcase/)
[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org) [![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org) [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

A responsive, interactive vanilla HTML/CSS/JavaScript recreation of the supplied 6.33-second screen recording.

## Run locally
1. Extract `lucerna-glassworks-showcase.zip`.
2. Open `index.html` in a modern browser.
3. No npm, build step or server is required.

Optional:
```bash
python3 -m http.server 8000
```
Open `http://localhost:8000`.

## What is visible in the video

The product experience is branded **LUCERNA** with the descriptor **“LUCERNA GLASSWORKS · SEVEN SHADES”** and the headline:

> Hand-blown glass you can switch on.

Seven pendant lights hang from a horizontal rail. The instruction line reads:

> Brush along the rail to light a pendant, slide it along, click it to dim.

The video demonstrates the amber shade lighting up, then opens product-detail views for:
- **Goccia** — Cognac teardrop; €620; 18 × 38 cm; cognac mouth-blown glass; 2200 K; 2 m cut to length; limited.
- **Corallo** — Coral glass cylinder; €300; 20 × 24 cm; coral mouth-blown glass; 2700 K; 2 m cut to length.

The first selected amber dome detail is labelled **Orra** in the visible interface. The other in-between product names/specifications are not readable in the recording; those are sample content created to complete the seven-shade interaction and are not claimed to be recovered source facts.

## Implemented interactions

- Seven distinct glass pendant silhouettes (dome, sphere, drop, opal, teardrop and cylinder forms)
- Hover or focus a pendant to illuminate it
- Click a pendant to select it and open its detail panel
- Drag pendants horizontally along the rail; spring motion and pendulum lag animate the movement
- Product detail modal with previous/next navigation
- Dimmer slider that changes the selected product's glow
- Reserve this shade action (local demo toast only)
- Shop the collection opens the first product detail
- Warm/cool ambient background toggle
- Responsive layout and Escape / arrow-key controls for the detail modal

## Code visible in the video

The code panel is titled `src/rail.ts`. It shows a private `tick` method that:
1. Reads `clockNow()` and calculates a capped delta time (`Math.min(0.033, ...)`).
2. Scales gravity (`G * this.scale`).
3. Loops over `this.bodies`.
4. Applies a spring force to each carriage using `SPRING_K` and `SPRING_C`.
5. Updates velocity and x-position.
6. Calculates pendulum angular acceleration from gravity, damping and carriage acceleration.
7. Updates angular velocity and angle.

The readable excerpt is included in the code panel and below:

```ts
private tick = () => {
  const now = clockNow();
  const dt = Math.min(0.033, (now - this.last) / 1000);
  const g = G * this.scale;
  for (const b of this.bodies) {
    // the carriage springs to where the hand put it
    const a = (b.target - b.x) * SPRING_K - b.v * SPRING_C;
    b.v += a * dt;
    b.x += b.v * dt;
    // a pendulum on a moving pivot: the shade lags behind
    const alpha = -(g / b.len) * Math.sin(b.th)
      - DAMP * b.om - (a / b.len) * Math.cos(b.th);
    b.om += alpha * dt;
    b.th += b.om * dt;
  }
};
```

The excerpt is legible in the recording and is transcribed above. The video does not show the full original repository, assets or all seven product records. The project is a fresh implementation inspired by the visible design and motion model, not a recovery of the unseen original app.

## Demo limitations
- Pendant artwork is recreated with inline SVG and CSS rather than the original 3D/glass assets.
- Only Goccia, Corallo and Orra names/specifications are readable enough to identify in the recording. Remaining shade names and specifications are illustrative.
- The reservation button is a frontend demo; no inventory, checkout, reservation API or email service is connected.
- The animation uses a local spring-and-pendulum simulation inspired by the displayed TypeScript excerpt. It does not use the original GSAP/Three.js/WebGL code or original product assets.

## 👨‍💻 Author

**mrchandrayee** · [GitHub](https://github.com/mrchandrayee)

## 📄 License

[MIT License](./LICENSE)
