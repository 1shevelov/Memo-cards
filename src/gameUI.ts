import { Application, Assets, Container, EventEmitter, Sprite, Text } from "pixi.js";
import { CARDS_SHOW_DELAY } from "./config";

export enum UiEvents {
	SET_COUNTER = "set_counter",
    RESET_COUNTER = "reset_counter",
	SHOW_MATCH_MESSAGE = "show_match_message",
	SHOW_RELOAD = "show_reload",
	RELOAD_GAME = "reload_game",
};

export class GameUI extends Container {
	private readonly COUNTER_STARTING_VALUE = 0;
	
	private uiEvents: EventEmitter;
	private counter: Text;
	private matchMesage: Text;
	private reloadButton: Sprite;
	private reloadButtonActive: boolean = false;

	constructor(app: Application, uiEvents: EventEmitter) {
		super();
		this.uiEvents = uiEvents;
		this.create(app);
		this.setCounter(this.COUNTER_STARTING_VALUE);
		app.stage.addChild(this);

		this.uiEvents.on(UiEvents.SET_COUNTER, this.setCounter, this);
        this.uiEvents.on(UiEvents.RESET_COUNTER, () => this.setCounter(this.COUNTER_STARTING_VALUE));
		this.uiEvents.on(UiEvents.SHOW_MATCH_MESSAGE, this.showMatchMessage, this);
		this.uiEvents.on(UiEvents.SHOW_RELOAD, () => this.reloadButton.visible = true);

		app.ticker.add((time) => {
			if (this.reloadButtonActive) this.reloadButton.rotation += 0.01 * time.deltaTime;
		});
	}

	private showMatchMessage(): void {
		this.matchMesage.visible = true;
        setTimeout(() => {
            this.matchMesage.visible = false;
        }, CARDS_SHOW_DELAY);
    }

	private setCounter(counter: number): void {
		this.counter.text = counter.toString().padStart(2, "0");
    }

	private create(app: Application): void {
		this.counter = new Text({
			text: "",
			style: {
				fontFamily: "Arial",
				fontSize: 36,
				fill: "beige",
				align: "center",
			},
		});
		this.counter.anchor.set(0.5);
		this.counter.x = app.screen.width / 2;
		this.counter.y = 40;
		this.addChild(this.counter);

		this.matchMesage = new Text({
			text: "It's a match!",
			style: {
				fontFamily: "Arial",
				fontSize: 36,
				fill: "#EE4B2B", // bright red
				align: "center",
			},
		});
		this.matchMesage.anchor.set(0.5);
		this.matchMesage.x = app.screen.width / 2;
		this.matchMesage.y = app.screen.height - 60;
		this.matchMesage.visible = false;
		this.addChild(this.matchMesage);

		this.reloadButton = new Sprite(Assets.get("reload"));
        this.reloadButton.anchor.set(0.5);
		this.reloadButton.x = app.screen.width / 2;
		this.reloadButton.y = app.screen.height / 2;
		this.reloadButton.visible = false;
		this.reloadButton.interactive = true;
		this.reloadButton.cursor = 'pointer';
		this.reloadButton.on("pointerdown", () => {
            this.uiEvents.emit(UiEvents.RELOAD_GAME);
			this.destroyUI();
        });
		this.reloadButton.on("pointerover", () => this.reloadButtonActive = true);
		this.reloadButton.on("pointerout", () => this.reloadButtonActive = false);
        this.addChild(this.reloadButton);
	}

	private destroyUI(): void {
		this.parent.removeChild(this);
        this.destroy();
	}
}
