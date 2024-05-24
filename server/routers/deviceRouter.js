const Router = require('express')
const router = new Router
const deviceController = require('../controllers/deviceController')
const checkRoleMiddleware = require('../middleware/checkRoleMidddleware')


router.post('/',/*checkRoleMiddleware('ADMIN'),*/deviceController.create)
router.get('/',deviceController.getAll)
router.get('/:id',deviceController.getOne)

router.delete('/:id', checkRoleMiddleware('ADMIN'),deviceController.delete)

router.post('/:id', deviceController.change)



module.exports= router