import {
	Application,
	AbstractRenderer,
	// Assets,
	EventEmitter,
} from "pixi.js";
import { LoadAssets } from "./assets";
import { FieldView } from "./fieldView";
import { GameOfCards } from "./gameOfCards";
import { GameUI, UiEvents } from "./gameUI";

(async () => {
	const CANVAS_ID = "game-canvas";
	const app = new Application();
	AbstractRenderer.defaultOptions.roundPixels = true; // Crisp pixels
	// AbstractRenderer.defaultOptions.resolution = window.devicePixelRatio || 1; // Crisp pixels

	const gameEvents = new EventEmitter();
	const uiEvents = new EventEmitter();

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
	// .then(() => {
	//   console.log("Assets loaded");
	//   const gameOfCards = new GameOfCards(events);
	//   new FieldView(app, events, gameOfCards.getCards());
	// });
	// console.log(Assets.cache);

	startGame();

	function startGame(): void {
		gameEvents.removeAllListeners();
		uiEvents.removeAllListeners();
		uiEvents.on(UiEvents.RELOAD_GAME, () => startGame());
		const gameOfCards = new GameOfCards(gameEvents, uiEvents);
        new FieldView(app, gameEvents, uiEvents, gameOfCards.getCards());
        new GameUI(app, uiEvents);
    }

	app.ticker.add((time) => {
		// * Delta is 1 if running at 100% performance *
		// * Creates frame-independent transformation *
		// bunny.rotation += 0.001 * time.deltaTime;
	});
})();
