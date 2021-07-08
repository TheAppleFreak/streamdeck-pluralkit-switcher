import {
    StreamDeckAction,
    WillAppearEvent,
    WillDisappearEvent,
    StateType
} from "streamdeck-typescript";
import { Logger, Filter, Human, Browser } from "caterpillar";

import { RootPlugin } from ".";
import "../libraries/ESDTimerFix";

export default abstract class BaseAction<Instance> extends StreamDeckAction<RootPlugin, Instance> {
    protected log: Logger;
    
    protected context: string;
    protected coordinates: {
        column: number,
        row: number
    };
    protected state: StateType;
    protected isInMultiAction: boolean;
    
    protected constructor(protected plugin: RootPlugin, actionName: string) {
        super(plugin, actionName);

        this.context = "";
        this.coordinates = {
            column: -1, 
            row: -1
        }
        this.state = -1;
        this.isInMultiAction = false;

        this.log = new Logger();
        this.log.pipe(new Filter({filterLevel: 7})).pipe(new Human()).pipe(new Browser());
    }

    abstract onContextAppear(event: WillAppearEvent): void;
    abstract onContextDisappear(event: WillDisappearEvent): void;

    /**
     * Updates metadata for each instance of the action. Should be called somewhere in a WillAppear event.
     * @param event - The event data received from the Stream Deck software.
     */
    public updateMetadata(event: WillAppearEvent): void {
        const { payload } = event;
        
        this.context = event.context;
        this.coordinates = payload.coordinates;
        this.state = payload.state;
        this.isInMultiAction = payload.isInMultiAction;

        this.log.debug(`Updated action metadata for action ${event.action}`);
    }
}