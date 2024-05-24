const {Type} = require('../models/models')
const ApiError = require('../error/ApiError')

class TypeController{
    async create(req,res){
        try{const{name}=req.body
        const type = await Type.create({name})
        return res.json(type)}
        catch(e){
            ApiError.badRequest({ meessage:"Server creation type error", e })
        }
    }
    async getAll(req,res){
        try{const types = await Type.findAll()
        return res.json(types)}
        catch(e){ApiError.badRequest({mmessage:"Server type plural getting error",e})}
    }
}

module.exports = new TypeController()



