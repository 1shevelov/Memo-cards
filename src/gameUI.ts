import { Application, Container, EventEmitter, Text } from "pixi.js";
import { CARDS_SHOW_DELAY } from "./config";

export enum UiEvents {
	SET_COUNTER = "set_counter",
    RESET_COUNTER = "reset_counter",
	SHOW_MATCH_MESSAGE = "show_match_message",
};

export class GameUI extends Container {
	private readonly COUNTER_STARTING_VALUE = 0;
	
	private uiEvents: EventEmitter;
	private counter: Text;
	private matchMesage: Text;

	constructor(app: Application, uiEvents: EventEmitter) {
		super();

		this.uiEvents = uiEvents;
		this.create(app);
		this.setCounter(this.COUNTER_STARTING_VALUE);
		app.stage.addChild(this);

		uiEvents.on(UiEvents.SET_COUNTER, this.setCounter, this);
        uiEvents.on(UiEvents.RESET_COUNTER, () => this.setCounter(this.COUNTER_STARTING_VALUE));
		uiEvents.on(UiEvents.SHOW_MATCH_MESSAGE, this.showMatchMessage, this);
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
	}
}
