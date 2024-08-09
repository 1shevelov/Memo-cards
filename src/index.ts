import {
  Application,
  Assets,
  AbstractRenderer,
  Sprite,
  Container,
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

  await LoadAssets();
  // console.log(Assets.cache);
  // const bunny = new Sprite(Assets.get('clubs7'));
  // bunny.anchor.set(0.5);
  // const cont = new Container();
  // cont.addChild(bunny);
  // cont.x = app.screen.width / 2;
  // cont.y = app.screen.height / 2;

  // app.stage.addChild(cont);
  // bunny.scale = Math.min(150 / bunny.width, 150 / bunny.height);

  // console.log(Assets.get('back'));
  const gameOfCards = new GameOfCards(4);
  new FieldView(app, events, gameOfCards.getCards());

  app.ticker.add((time) => {
    // * Delta is 1 if running at 100% performance *
    // * Creates frame-independent transformation *
    // bunny.rotation += 0.001 * time.deltaTime;
  });
})();
