const jwt = require("jsonwebtoken");

const jwtCheck = function (socket , next) {
    let gError = new Error()
    if (!socket.request.headers.authorization) {
        gError.message = "No auth token provided"
        gError.data= {
            err: "No auth token provided",
            code: 5
        }
        next(gError)
    } else {
        try {
            let decodedjwt = jwt.verify(socket.request.headers.authorization, process.env.JWTPASS)
            socket.request.decodedjwt = decodedjwt
            console.log(decodedjwt);
            next()
        } catch (error) {
            if (error.message == "invalid signature") {
                gError.message = error.message
                gError.data = {
                    err: error.message,
                    code: 6
                }
                next(gError)
            } else if (error.message == 'jwt expired') {
                gError.message = error.message 
                gError.data = {
                    err: error.message,
                    code: 7
                }
                next(gError)
            } else {
                gError.message = error.message 
                gError.data = {
                    err: error.message,
                    code: 567
                }
                next(gError)
            }
        }
    }
}
module.exports = { jwtCheck }