
const Router = require('express')
const checkRoleMiddleware = require('../middleware/checkRoleMidddleware')
const ratingController = require('../controllers/ratingController')
const router = new Router()

router.post('/', checkRoleMiddleware('USER'),ratingController.ratingDevice)
module.exports = router
