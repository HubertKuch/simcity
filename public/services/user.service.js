'use strict';

class UserService extends ApiService {
    constructor(URL) {
        super(URL);
        this.URL = URL;
        return this;
    }

    async login (email, password, errField) {
        try {
            // validation
            if (!email || !password || password.length < 8 || email.length < 8) {
                throw new Error('Please provide correct email and password');
            }

            // send req
            const res = await axios.post(`${this.URL}/users/login`, { email, password });
            console.log(res);
            
        } catch (e) {
            const errContainer = document.querySelector(errField);

            if (e.message.indexOf('401') !== -1) {
                errContainer.textContent = `Incorrect email or password.`;
                return;
            }

            errContainer.textContent = `${e.message}`
        }
    }
}
