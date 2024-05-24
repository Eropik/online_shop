const Router = require('express')
const router = new Router
const basketController = require('../controllers/basketController')
const checkRoleMiddleware = require('../middleware/checkRoleMidddleware')


router.get('/all',/*checkRoleMiddleware('ADMIN'),*/basketController.getAll)

router.post('/',checkRoleMiddleware('USER'),basketController.add)

router.delete('/:id',/*checkRoleMiddleware('USER'),*/basketController.remove)
router.get('/',checkRoleMiddleware('USER'),basketController.getBasket)

router.post('/buy',/*checkRoleMiddleware('USER'),*/basketController.buy)
router.post('/confirm',/*checkRoleMiddleware('ADMIN'),*/basketController.orderConfirm)
router.post('/state',/*checkRoleMiddleware('ADMIN'),*/basketController.orderState)

module.exports= router