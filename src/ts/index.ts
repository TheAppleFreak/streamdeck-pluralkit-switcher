import { StreamDeckPluginHandler } from "streamdeck-typescript";
import { SwitchChooseAction } from "./switchChoose";
import { SwitchDirectAction } from "./switchDirect";

export default class PkSwitch extends StreamDeckPluginHandler {
    constructor() {
        super();
        new SwitchChooseAction(this, "me.theapplefreak.pkswitch.switchchoose");
        new SwitchDirectAction(this, "me.theapplefreak.pkswitch.switchdirect");
    }
}

new PkSwitch();