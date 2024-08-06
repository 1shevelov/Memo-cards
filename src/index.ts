import { Application, Assets, AbstractRenderer, Sprite } from 'pixi.js';

(async () =>
{
    const IMAGE_URL = 'assets/images/cv.jpg';
    const CANVAS_ID = 'game-canvas';
    const app = new Application();
    AbstractRenderer.defaultOptions.roundPixels = true; // Crisp pixels
    // AbstractRenderer.defaultOptions.resolution = window.devicePixelRatio || 1; // Crisp pixels

    // Initialize the application
    await app.init({
        // width: 800,
        // height: 600,
        background: '#1099bb',
        resizeTo: window,
        canvas: document.getElementById(CANVAS_ID) as HTMLCanvasElement,
    });
    // document.body.appendChild(app.canvas);

    // Load the bunny texture
    const texture = await Assets.load(IMAGE_URL);
    const bunny = new Sprite(texture);
    bunny.anchor.set(0.5);
    bunny.x = app.screen.width / 2;
    bunny.y = app.screen.height / 2;

    app.stage.addChild(bunny);

    app.ticker.add((time) =>
    {
        // * Delta is 1 if running at 100% performance *
        // * Creates frame-independent transformation *
        bunny.rotation += 0.001 * time.deltaTime;
    });
})();
