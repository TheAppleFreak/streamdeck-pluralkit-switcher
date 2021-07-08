import {
    KeyDownEvent,
    KeyUpEvent,
    SDOnActionEvent,
    WillAppearEvent,
    WillDisappearEvent
} from "streamdeck-typescript";

import { BaseAction, RootPlugin } from "../base";
import "../libraries/ESDTimerFix";
import PluralKit from "../libraries/pluralkit";

import { SwitchChooseSettingsInterface } from ".";

export default class SwitchChooseAction extends BaseAction<SwitchChooseAction> {
    private pk: PluralKit; 

    constructor(plugin: RootPlugin, actionName: string) {
        super(plugin, actionName);

        this.pk = new PluralKit();
    }

    @SDOnActionEvent("willAppear")
    public onContextAppear(event: WillAppearEvent<SwitchChooseSettingsInterface>) {
        this.updateMetadata(event);
    }

    @SDOnActionEvent("willDisappear")
    public onContextDisappear(event: WillDisappearEvent<SwitchChooseSettingsInterface>) {
        
    }

    @SDOnActionEvent("keyDown") 
    public async onKeyDown(event: KeyDownEvent<SwitchChooseSettingsInterface>) {
        this.log.debug(`Has auth token: ${this.pk.hasAuthToken()}`);
        this.log.debug(await this.pk.getSystemInfo("txrnm"));
    }
}