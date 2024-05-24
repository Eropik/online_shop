const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, Basket, Device} = require('../models/models');
const {validationResult } = require('express-validator');

const generateJwt = (id, email, role)=>{
    return  jwt.sign({id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'})

}

class UserController{
    async registration(req,res,next){
        try{

            const {email, password, role, rePassword} = req.body;
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message:"Registration error", errors})

            }

            if(password!==rePassword){
                return next(ApiError.badRequest('Passwords dont match'))
            }

            if(!email || !password){
                return next(ApiError.badRequest('Email or password is undefined'))
            }
            const candidate = await User.findOne({where: {email}})
            if(candidate){
                return next(ApiError.badRequest('Email is already in use'))
            }

            const hashPassword = await bcrypt.hash(password, 5)

            const user = await User.create({email, role, password: hashPassword})
            const basket = await Basket.create({userId: user.id})

            const token = generateJwt(user.id,user.email,user.role);

            return res.json({token})
        }
        catch(e){next(ApiError.badRequest(e.message));
        }

    }

    async login(req,res, next){
        try{
            const {email, password} = req.body
            if(!email || !password){return next(ApiError.badRequest('Email or password is undefined'))
            }
            const user = await User.findOne({where:{email}})

            if(!user){
                return next(ApiError.badRequest('Login is undefined'))
            }
            let comparePassword = await bcrypt.compareSync(password, user.password)
            if(!comparePassword){
                return next(ApiError.badRequest('Wrong password'))
            }
            const token = generateJwt(user.id,user.email,user.role);
            return res.json({token})
        }
        catch(e){next(ApiError.badRequest(e.message));
        }
    }

    async check(req,res,next){
        const token = generateJwt(req.user.id, req.user.email, req.user.role);

        return res.json({token})
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const user = await User.findOne({ where: {id} });

            if (!User) {
                return res.status(404).json({ message: 'Device is not found' });
            }
            else if(user.role === 'ADMIN'){return res.status(401).json({ message: 'Admin cannot be deleted' })}

            await user.destroy();
            return res.status(200).json({ message: 'Successfully deleted' });
        } catch (error) {
            next(ApiError.badRequest({ message: 'Server error' }));
        }
    }

    async getUsers(req,res){
        try{
            let page,limit = req.query;
            page = page|| 1
            limit = limit || 10
            let offset = page * limit - limit

            const users = await User.findAndCountAll({limit, offset})
            res.json(users)
        }
        catch(e){ApiError.badRequest(e.message)}



    }
}

module.exports = new UserController()