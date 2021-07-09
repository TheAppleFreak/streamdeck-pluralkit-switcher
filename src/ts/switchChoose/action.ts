import {
    KeyDownEvent,
    KeyUpEvent,
    SDOnActionEvent,
    WillAppearEvent,
    WillDisappearEvent
} from "streamdeck-typescript";

import { BaseAction, RootPlugin } from "../base";
import GlobalPluralKit from "../libraries/globalPluralkit";
import "../libraries/ESDTimerFix";

import { SwitchChooseSettingsInterface } from ".";

export default class SwitchChooseAction extends BaseAction<SwitchChooseAction> {
    private pk?: GlobalPluralKit; 

    constructor(plugin: RootPlugin, actionName: string) {
        super(plugin, actionName);
    }

    @SDOnActionEvent("willAppear")
    public async onContextAppear(event: WillAppearEvent<SwitchChooseSettingsInterface>) {
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
    public async onContextDisappear(event: WillDisappearEvent<SwitchChooseSettingsInterface>) {
        this.plugin.setTitle("choose", this.context);
    }

    @SDOnActionEvent("keyDown") 
    public async onKeyDown(event: KeyDownEvent<SwitchChooseSettingsInterface>) {
        this.log.debug(await this.pk?.isUsable());
        this.log.debug(await this.pk?.instance.getSystemInfo());
    }
}