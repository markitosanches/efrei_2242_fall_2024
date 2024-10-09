const db = require('../models')
const User = db.users
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const https = require('http')

exports.create = async (req, res) => {
    if (!req.body.fullname || !req.body.email || !req.body.password) {
        res.status(400).send({
            message: "User must have name, email and password"
        })
        return
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword  = await bcrypt.hash(req.body.password, salt)
    await User.create({
        fullname: req.body.fullname,
        email: req.body.email,
        password: hashPassword
    })
     .then(data => {
        res.send(data)
     })
     .catch(err => {
        res.status(500).send({
            message: "Could not insert the data"
        })
     })
}

exports.findOne = async (req, res) => {
    const user = await User.findOne({where: {email:req.body.email}})

    if(!user){
        return res.status(400).send({
            message: 'Username not found'
        })
    }

    if(!await bcrypt.compare(req.body.password, user.password)){
        return res.status(400).send({
            message: 'Incorrect password'
        }) 
    }

    //console.log(user)
    const token = jwt.sign({id: user.id}, 'secret')
    //console.log(token)
    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    })

    user.update({
        token: token
    })
    const {password, ...data} = await user.toJSON()
    res.send({
        token: token,
        user: data
    })
}

exports.auth = async (req, res) => {
    try{
        const cookie = req.cookies['jwt']
        const claims = jwt.verify(cookie, 'secret')

        if(!claims){
            return res.status(401).send({
                message: 'Unauthenticated'
            })
        }

        const user = await User.findOne({id: claims.id })
        const {password, ...data} = await user.toJSON()
        res.send(data)
    }
    catch (e) {
        return res.status(401).send({
            message: 'Unauthenticated'
        })
    }
}

exports.logout = async (req, res) => {
    res.cookie('jwt', '', {maxAge:0})
    res.send({
        message: 'success'
    })
}