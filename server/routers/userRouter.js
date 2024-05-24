


const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require("../middleware/checkRoleMidddleware");
const {check} = require("express-validator");

router.post('/registration',[
    check('email','Username is undefined').isEmail(),
    check('password','Password is incorrect(>8 and <20)').isLength({min:8,max:20}),]
    , userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware,userController.check)
router.delete('/:id',checkRole('ADMIN'),userController.delete)
router.get(checkRole('ADMIN'),userController.getUsers)

module.exports = router