module.exports = app => {
    const user = require('../controller/user.controller.js')
    const router = require('express').Router()
    router.post('/', user.create)
    router.post('/login', user.findOne)
    app.use('/api/user', router)
}