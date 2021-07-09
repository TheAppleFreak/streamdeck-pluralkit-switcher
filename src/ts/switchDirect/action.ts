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
import GlobalPluralKit from "../libraries/globalPluralkit";

export default class SwitchDirectAction extends BaseAction<SwitchDirectAction> {
    private pk?: GlobalPluralKit;

    constructor(plugin: RootPlugin, actionName: string) {
        super(plugin, actionName);
    }

    @SDOnActionEvent("willAppear")
    public async onContextAppear(event: WillAppearEvent<SwitchDirectSettingsInterface>) {
        this.updateMetadata(event);

        // Not sure why a new instance would have this set before willAppear, but eh
        if (!this.pk) {
            if (event.payload.settings.token && event.payload.settings.token !== "") {
                this.pk = new GlobalPluralKit(event.payload.settings.token);
    
                try {
                    await this.pk.isUsable();
                } catch (err) {
                    this.plugin.setTitle("err", this.context);
                }
            }
        } else {
            
        }
    }

    @SDOnActionEvent("willDisappear")
    public onContextDisappear(event: WillDisappearEvent<SwitchDirectSettingsInterface>) {

    }

    @SDOnActionEvent("keyDown") 
    public onKeyDown(event: KeyDownEvent<SwitchDirectSettingsInterface>) {
        
    }
}