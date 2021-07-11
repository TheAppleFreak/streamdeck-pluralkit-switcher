import { DidReceiveSettingsEvent, SDOnPiEvent, StreamDeckPropertyInspectorHandler } from "streamdeck-typescript";
import { Log } from "../base";

import "../../scss/common.scss";
import { Logger } from "caterpillar";

class SwitchDirectPi extends StreamDeckPropertyInspectorHandler {
    private log: Logger;

    private systemSelect?: HTMLSelectElement;

    constructor() {
        super();

        this.log = Log;
    }

    @SDOnPiEvent("documentLoaded") 
    onDocumentReady() {
        this.systemSelect = document.getElementById("sys_select") as HTMLSelectElement;

    }
}

new SwitchDirectPi();