import axios, { AxiosInstance } from "axios";

export default class PluralKit {
    private axios: AxiosInstance;
    private _semaphore: Promise<Status>;
    private _resolve: any;
    private _reject: any;
    
    private _sysId?: string;
    
    public thing: number;

    constructor(token: string) {
        this.axios = axios.create({
            baseURL: "https://api.pluralkit.me/v1",
            headers: {
                Authorization: token
            }
        });

        this._semaphore = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });

        this.validateToken();

        this.thing = Math.floor(Math.random() * 100);
    }

    private async validateToken(): Promise<void> {
        try {
            const res = await this.getSystemInfo();

            this._sysId = res.id;
            this._resolve!({
                usable: true,
                status: null
            });

            console.log("validated");
        } catch (err: any) {
            this._reject!({
                usable: false,
                status: err.message
            });

            throw err;
        }
    }

    public isUsable(): Promise<Status> {
        return this._semaphore;
    }

    public async getSystemId(): Promise<string> {
        await this.isUsable();

        return this._sysId!
    }

    /**
     * Makes an authorized request against the PluralKit API. 
     * @param {string} endpoint - The endpoint to query, with a leading slash (`/`)
     * @param {"GET" | "POST" | "PATCH" | "DELETE"} [method="GET"] - The HTTP method to use for the response
     * @param {any} [params] - Any parameters to use
     * @returns Returns the API response data from Axios. Throws if the PK API sends an error
     */
    public async makeRequest(endpoint: string, method: "GET" | "POST" | "PATCH" | "DELETE" = "GET", params?: any): Promise<any> {
        try {
            const res = await this.axios({
                method,
                url: endpoint,
                data: params
            });

            return res.data;
        } catch (err: any) {
            // This is more than likely an Axios error. If it isn't, I don't know.
            if (err.response) {
                // Server responded with something that wasn't in the range of 2xx
                throw new Error(`PK API responded with nonstandard status code - ${err.response.status}`);
            } else if (err.request) {
                // The request was made but no response was received
                throw new Error(`No response received from PK API`);
            } else {
                // yeah I don't know
                throw new Error(`Something unknown happened - ${err}`);
            }
        }
    }

    public getSystemInfo(id?: string): Promise<any> {
        if (id) {
            return this.makeRequest(`/s/${id}`);
        } else {
            return this.makeRequest(`/s`);
        }
    }

    public getMembers(id?: string): Promise<any> {
        if (id) {
            return this.makeRequest(`/s/${id}/members`);
        } else {
            return this.makeRequest(`/s/${this._sysId}/members`);
        }
    }

    public getFronters(id?: string): Promise<any> {
        if (id) {
            return this.makeRequest(`/s/${id}/fronters`);
        } else {
            return this.makeRequest(`/s/${this._sysId}/fronters`);
        }
    }

    public getSwitches(id?: string): Promise<any> {
        if (id) {
            return this.makeRequest(`/s/${id}/switches`);
        } else {
            return this.makeRequest(`/s/${this._sysId}/switches`);
        }
    }
    
    public postSwitch(members: string[] = []): Promise<any> {
        return this.makeRequest(`/s/members`, "POST", {members});
    }
}

interface Status {
    usable: boolean, 
    status: string | null
}