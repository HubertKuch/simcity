# Base URL
> http://< host >/api/v1
<hr>

## Endpoints for admins:
### [GET] Get all users: 
! Password was not selected <br>
! Endpoint for users with __'admin'__ role
> #### baseURL/users
Response: <br>
code - 200
<br> {
    "message": "success",
    "statusCode": 200,
    "status": "ok",
    "data": {
        {
            "level": 1,
            "_id": "61c17f4fb06d840ac6d77d36",
            "username": "example",
            "email": "test@mail.com",
            "passwordConfirm": "Testpass1234",
            "role": "admin",
            "isActivated": true,
            "isEmailActivated": true,
            "twoAuth": false,
            "__v": 0,
            "twoAuthLoginExpiresIn": "2021-12-23T07:12:38.770Z",
            "twoAuthLoginToken": 825341,
            "buildings": []
        },
    }
}

<hr>

## Endpoints for all users

### [POST] Login
> #### baseURL/login
### data: { email: 'email@email.com', password: 'password' }
#### ! If 2FA is turn on account to log in required is code from email
#### Response:
#### code - 200 if user was logged in
#### data: { "message": "success", "statusCode": 200, "status": "ok', "data": { "token": "abc-abc-abc" }"  }
#### code - 401 if user was not found, incorrect password or email


