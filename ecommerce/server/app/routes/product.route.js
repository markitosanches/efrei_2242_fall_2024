module.exports = app => {
    const product = require('../controller/product.controller.js')
    const router = require('express').Router()
    router.get('/', product.findAll)
    app.use('/api/product', router)
}