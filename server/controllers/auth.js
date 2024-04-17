const pool = require('../models/pg').pool
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const env = process.env

const createJWT = (body) => {
    let jwToken = {
        fullname: body.fullname,
        email: body.email,
        usertype: body.usertype
    }
    return jwt.sign(jwToken, env.JWTPASS, { expiresIn: 60 * 60 })
}

const login = function (req, res) {
    const checkBody = (body) => {
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!body.password) {
            let err = new Error("One or more empty fields")
            err.code = 1
            res.status(400)
            return new Promise((resolve, reject) => {
                reject(err)
            })
        } else if (!emailRegex.test(body.email)) {
            let err = new Error("Invalid email")
            err.code = 2
            res.status(400)
            return new Promise((resolve, reject) => {
                reject(err)
            })
        }
        return new Promise((resolve, reject) => {
            resolve(body)
        })
    }
    const getCredentialsFromDB = (body)=>{
        let sqlText = 'SELECT * FROM users WHERE email=$1'
        let email = body.email
        return pool.query(sqlText,[email])
    }
    const checkPassword = (queryResult)=>{
        if (queryResult.rowCount<1) {
            return new Promise((rs,rj)=>{
                res.status(404)
                const err = new Error("No such user")
                err.code = 3
                rj(err)
            })
        }
        let user = queryResult.rows[0]
        if (bcrypt.compareSync(req.body.password,user.password)) {
            return new Promise((resolve, _reject) => {
                resolve()
            })
        }else{
            return new Promise((_resolve, reject) => {
                res.status(401)
                const err = new Error("Wrong email or password")
                err.code = 4
                reject(err)
            })
        }
    }
    const makeJWTAndSendResp = ()=>{
        console.log("[INFO] : [controllers.auth.login.makeJWTAndSendResp] Successfully logged in ");

        let jwToken = createJWT(req.body)

        res.json({
            status : "Ok",
            jwt : jwToken
        })
    }
    const OnError = (err) => {
        console.log(err.stack);
        res.json({
            err: err.message,
            code: err.code
        })
    }
    checkBody(req.body)
    .then(getCredentialsFromDB)
    .then(checkPassword)
    .then(makeJWTAndSendResp)
    .catch(OnError)
}
const register = function (req, res) {
    const checkBody = (body) => {
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!body.fullname || !body.password || !body.usertype) {
            let err = new Error("One or more empty fields")
            err.code = 1
            res.status(400)
            return new Promise((resolve, reject) => {
                reject(err)
            })
        } else if (!emailRegex.test(body.email)) {
            let err = new Error("Invalid email")
            err.code = 2
            res.status(400)
            return new Promise((resolve, reject) => {
                reject(err)
            })
        }
        return new Promise((resolve, reject) => {
            resolve(body)
        })
    }

    const pushToDb = (body) => {
        const hash = bcrypt.hashSync(body.password,10) 
        const parameters = [body.fullname, body.email, hash, body.usertype]
        const sqlText = 'INSERT INTO users(fullname,email,password,usertype) VALUES ($1,$2,$3,$4)'
        return pool.query(sqlText, parameters)
    }
    
    const getAnswer = (dbAnswer)=>{
        return new Promise((rsv,rjt)=>{
            rsv({body:req.body,dbAnswer})
        })
    }

    const makeJWT = (answer) => {
        let jwtString = createJWT(answer.body)
        answer.jwt = jwtString
        return answer
    }

    const sendAndLogResult = (answer) => {
        const affRows = answer.dbAnswer.rowCount
        console.log("[INFO] : [controllers.auth.register.sendAndLogResult] Affected Rows :" + affRows);
        res.json({
            affected_rows: affRows,
            jwt: answer.jwt
        })
    }

    const OnError = (err) => {
        console.log(err.stack);
        res.json({
            err: err.message,
            code: err.code
        })
    }

    checkBody(req.body)
        .then(pushToDb)
        .then(getAnswer)
        .then(makeJWT)
        .then(sendAndLogResult)
        .catch(OnError)
}

module.exports = { login, register }