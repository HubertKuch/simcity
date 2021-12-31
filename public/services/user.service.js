'use strict';
class UserService extends ApiService {
    constructor(URL) {
        super(URL);
        this.URL = URL;
        return this;
    }

    async login (email, password, errMessage) {
        // validation
        if (!email || !password || password.length < 8 || email.length < 8) {
            console.log(errMessage);
            return;
        }

        // send req
        const res = await axios.post(`${this.URL}/users/login`, { email, password });
        console.log(res);
    }
}
