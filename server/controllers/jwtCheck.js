const jwt = require("jsonwebtoken")

const jwtCheck = function (req, res, next) {
    if (!req.body.auth) {
        res.json({
            err: "No auth token provided",
            code: 5
        })
    } else {
        try {
            console.log(req.originalUrl);
            let decodedjwt = jwt.verify(req.body.auth, process.env.JWTPASS)
            req.body.decodedjwt = decodedjwt
            console.log(decodedjwt);
            next()
        } catch (error) {
            if (error.message == "invalid signature") {
                res.json({
                    err: error.message,
                    code: 6
                })
            } else if (error.message == 'jwt expired') {
                res.json({
                    err: error.message,
                    code: 7
                })
            } else {
                res.json({
                    err: error.message,
                    code: 567
                })
            }
        }
    }
}
module.exports = { jwtCheck }