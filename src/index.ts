import {
  Application,
  AbstractRenderer,
  // Assets,
  EventEmitter,
} from "pixi.js";
import { LoadAssets } from "./assets";
import { FieldView } from "./fieldView";
import { GameOfCards } from "./gameOfCards";

(async () => {
  const CANVAS_ID = "game-canvas";
  const app = new Application();
  AbstractRenderer.defaultOptions.roundPixels = true; // Crisp pixels
  // AbstractRenderer.defaultOptions.resolution = window.devicePixelRatio || 1; // Crisp pixels

  const events = new EventEmitter();

  // Initialize the application
  await app.init({
    // width: 800,
    // height: 600,
    background: "#1099bb",
    resizeTo: window,
    canvas: document.getElementById(CANVAS_ID) as HTMLCanvasElement,
  });
  // document.body.appendChild(app.canvas);

  await LoadAssets()
  // .then(() => {
  //   console.log("Assets loaded");
  //   const gameOfCards = new GameOfCards(events);
  //   new FieldView(app, events, gameOfCards.getCards());
  // });
  // console.log(Assets.cache);

  const gameOfCards = new GameOfCards(events);
  new FieldView(app, events, gameOfCards.getCards());

  app.ticker.add((time) => {
    // * Delta is 1 if running at 100% performance *
    // * Creates frame-independent transformation *
    // bunny.rotation += 0.001 * time.deltaTime;
  });
})();
