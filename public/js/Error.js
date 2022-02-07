class Error{
    constructor(msg) {
        this.msg = msg;
        this.name = "ERROR";
        this.stack = "";
    }
}

class ValidationError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "VALIDATION_ERROR";
    }
}

class TokenError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "TOKEN_ERROR"
    }
}

class APIError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "API_ERROR";
    }
}

class SocketError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "SOCKET_ERROR";
    }
}
