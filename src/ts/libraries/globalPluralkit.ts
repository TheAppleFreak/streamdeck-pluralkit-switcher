import { sha512 } from "js-sha512";
import PluralKit from "./pluralkit";

export default class GlobalPluralKit {
    private INSTANCE_KEY: symbol;
    
    constructor(token: string, namespace: string = "application") {
        // Construct symbol to act as index for global PK object
        this.INSTANCE_KEY = Symbol.for(sha512(`${namespace}.pluralkit::${token}`));

        // Instantiate instance of PluralKit if it doesn't already exist
        if (Object.getOwnPropertySymbols(globalThis).indexOf(this.INSTANCE_KEY) === -1) {
            (globalThis as globalWithPK)[this.INSTANCE_KEY] = new PluralKit(token);
        }
    }
    
    get instance(): PluralKit {
        return (globalThis as globalWithPK)[this.INSTANCE_KEY];
    }

    /**
     * Checks to see whether or not the system in PluralKit is valid.
     * @deprecated
     * @returns true. All systems are valid.
     */
    public isValid(): boolean {
        return true;
    }

    /**
     * Queries the PK object to see if it passed validation
     * @param {boolean} [rethrowErr=false] Whether or not to rethrow the error from the PK object
     * @returns {Promise<boolean>} Returns true if the PK instance is 
     */
    public async isUsable(rethrowErr: boolean = false): Promise<boolean> {
        try {
            await this.instance.isUsable();

            return true
        } catch (err) {
            if (rethrowErr) {
                throw err;
            } else {
                return false;
            }
        }
    }
}


interface globalWithPK {
    [key: string | number]: any;
    [key: symbol]: PluralKit
}