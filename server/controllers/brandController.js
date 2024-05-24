const {Brand} = require('../models/models')
const ApiError = require('../error/ApiError')

class BrandController{
    async create(req,res){
        try{const{name}=req.body
        const brand = await Brand.create({name})
        return res.json(brand)}
        catch(e){
            ApiError.badRequest({message:"Server brand creation error", e})
        }
    }
    async getAll(req,res){
        try{
        const brands = await Brand.findAll()
        return res.json(brands)}
        catch(e){ApiError.badRequest({message:"Server brand plural getting error", e})
    }}
}

module.exports = new BrandController()