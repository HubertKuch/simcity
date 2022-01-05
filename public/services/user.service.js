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
            await axios.post(`${this.URL}/users/login`, { email, password });
            window.location.replace('/')
        } catch (e) {
            const errContainer = document.querySelector(errField);

            if (e.message.indexOf('401') !== -1) {
                errContainer.textContent = `Incorrect email or password.`;
                return;
            }

            errContainer.textContent = `${e.message}`
        }
    }

    async logout () {
        try {
            await axios.get(`${this.URL}/users/logout`);
        } catch (e) {
            console.log(e);
        }
    }

    async nextRound () {
        try {
            let cookies = document.cookie.split(' ');
            let token = '';

            cookies.forEach(cookie => {
                if(cookie.includes('token')) {

                    token = cookie
                }
            })

            token = token.replace(';', '');
            token = token.substring(6)

            const res = await axios({ 
                method: 'PATCH', 
                url: `${this.URL}/users/nextRound`, 
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    async cityInfo () {
        try {
            const res = await axios.get(`localhost:3000`);
            console.log(res);  
        } catch (error) {
            console.log(error);
        } 
    }
}
