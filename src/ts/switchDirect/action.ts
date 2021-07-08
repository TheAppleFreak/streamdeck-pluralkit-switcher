import {
    KeyDownEvent,
    KeyUpEvent,
    SDOnActionEvent,
    WillAppearEvent,
    WillDisappearEvent
} from "streamdeck-typescript";

import { BaseAction, RootPlugin } from "../base";
import "../libraries/ESDTimerFix";

import { SwitchDirectSettingsInterface } from ".";

export default class SwitchDirectAction extends BaseAction<SwitchDirectAction> {
    constructor(plugin: RootPlugin, actionName: string) {
        super(plugin, actionName);
    }

    @SDOnActionEvent("willAppear")
    public onContextAppear(event: WillAppearEvent<SwitchDirectSettingsInterface>) {
        this.updateMetadata(event);
    }

    @SDOnActionEvent("willDisappear")
    public onContextDisappear(event: WillDisappearEvent<SwitchDirectSettingsInterface>) {

    }

    @SDOnActionEvent("keyDown") 
    public onKeyDown(event: KeyDownEvent<SwitchDirectSettingsInterface>) {
        
    }
}