module.exports = app => {
    const product = require('../controller/product.controller.js')
    const router = require('express').Router()
    router.get('/', product.findAll)
    router.post('/', product.create)
    app.use('/api/product', router)
}