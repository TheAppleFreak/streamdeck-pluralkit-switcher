import axios, { AxiosInstance } from "axios";

export default class PluralKit {
    private axiosUnauthed: AxiosInstance;
    private axiosAuthed: AxiosInstance;
    private _authToken: string;
    public sysId: string;

    constructor(authToken: string = "") {
        this._authToken = authToken;
        this.sysId = "";
        
        this.axiosAuthed = axios.create({
            baseURL: "https://api.pluralkit.me/v1/"
        });
        
        this.axiosUnauthed = axios.create({
            baseURL: "https://api.pluralkit.me/v1/"
        });
    }

    /**
     * Checks to see whether or not the class instance has a valid auth token.
     */
    public hasAuthToken(): boolean {
        return this._authToken.length === 64 && this.sysId !== undefined
    }

    /**
     * Validates an authorization token and gets the system ID
     * @param token - The 64 character authorization token, as returned by `pk;token`
     * @returns Returns `true` if the auth token validates correctly, throws otherwise
     */
    public async setAuthToken(token: string): Promise<boolean> {
        // Auth tokens are 64 characters long
        if (token.length !== 64) 
            throw new Error("Invalid PK auth token");
        
        try {
            // Check to see if we can get a system ID
            const res = await this.axiosAuthed.get("s", {
                headers: {
                    Authorization: token
                }
            });

            this._authToken = token;
            this.sysId = res.data.id;

            this.axiosAuthed.defaults.headers.common["Authorization"] = token;
        } catch (err) {
            // If we keep any existing data, there's a possibility we might enter an unknown program state
            // Best clear it to be sure
            this._authToken = "";
            this.sysId = "";
            this.axiosAuthed.defaults.headers.common["Authorization"] = undefined;

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

        return true
    }

    /**
     * Makes an unauthorized GET request against the PluralKit API. 
     * @param endpoint - The endpoint to query, with a leading slash (`/`)
     * @returns Returns the API response data from Axios. Throws if something goes wrong.
     */
    private async makeUnauthedRequest(endpoint: string): Promise<any> {
        try {
            const res = await this.axiosUnauthed.get(endpoint);

            return res.data;
        } catch (err) {
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

    /**
     * Makes an authorized request against the PluralKit API. 
     * @param endpoint - The endpoint to query, with a leading slash (`/`)
     * @param method - The HTTP method to use for the response
     * @param params - Any parameters to use
     * @returns Returns the API response data from Axios. Throws if the authorization token is not set.
     */
    private async makeAuthedRequest(endpoint: string, method: "GET" | "POST" | "PATCH" | "DELETE", params?: any): Promise<any> {
        if (this._authToken === "")
            throw new Error("Auth token not set, cannot make authed request");

        try {
            const res = await this.axiosAuthed({
                method,
                url: endpoint,
                data: params
            });

            return res.data;
        } catch (err) {
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

    /**
     * Returns information about a system.
     * 
     * {@link https://pluralkit.me/api/#get-s `/s` - PK API docs}
     * {@link https://pluralkit.me/api/#get-s-id `/s/:id` - PK API docs}
     * @param {string} [id] - The system ID to search for. Searches for the authenticated user's own system if omitted.
     * @returns Returns the API response. Throws if an error occurs.
     */
    public async getSystemInfo(id?: string): Promise<any> {
        if (id && id !== this.sysId) {
            return await this.makeUnauthedRequest(`/s/${id}`);
        } else {
            return await this.makeAuthedRequest("/s", "GET");
        }
    }

    /**
     * Returns system members.
     * 
     * {@link https://pluralkit.me/api/#get-s-id-members `/s/:id/members` - PK API docs}
     * @param {string} [id] - The system ID to search for. Searches for the authenticated user's own system members if omitted.
     * @returns Returns the API response. Throws if an error occurs.
     */
    public async getMembers(id?: string): Promise<any> {
        if (id && id !== this.sysId) {
            return await this.makeUnauthedRequest(`/s/${id}/members`);
        } else {
            return await this.makeAuthedRequest(`/s${this.sysId}/members`, "GET");
        }
    }

    /**
     * Returns current fronters for the given system.
     * 
     * {@link https://pluralkit.me/api/#get-s-id-fronters `/s/:id/fronters` - PK API docs}
     * @param {string} [id] - The system ID to search for. Searches for the authenticated user's own system fronters if omitted.
     * @returns Returns the API response. Throws if an error occurs.
     */
    public async getFronters(id?: string): Promise<any> {
        if (id && id !== this.sysId) {
            return await this.makeUnauthedRequest(`/s/${id}/fronters`);
        } else {
            return await this.makeAuthedRequest(`/s${this.sysId}/fronters`, "GET");
        }
    }

    /**
     * Registers a new switch for the authorized user.
     * 
     * {@link https://pluralkit.me/api/#post-s-switches `/s/switches` - PK API docs}
     * @returns Returns the API response. Throws if an error occurs.
     */
    public async postSwitch(members: string[]): Promise<any> {
        return await this.makeAuthedRequest(`/s/members`, "POST", {members});
    }
}