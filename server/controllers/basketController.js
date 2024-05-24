const {BasketDevice, Basket, Device} = require('../models/models');

const ApiError = require("../error/ApiError");

class BasketController{
    async getAll(req,res,next){
        try {
            const products = await BasketDevice.findAll(
               {include:[{model:Device}]},
           );
           return res.json(products)
        } catch (e) {
            next(ApiError.badRequest({message:"Server  plural getting error"}))
        }
    }
    async getBasket(req,res,next){
        try {
            const { userId } = req.query;
           const basket = await Basket.findOne({where: {userId}});
           let products = await BasketDevice.findAll({where:{basketId:basket.id},include:[{model:Device}]});
           if(products.length > 0) {
               return res.json(products);
           } else {
               return res.json(basket.id);
           }

        } catch (e) {
            next(ApiError.badRequest({message:"Server single getting error"}))
        }
    }

    async buy(req,res,next){
        try{
            const {idList} = req.body;
            for(const id of idList){
                const basketDevice= await BasketDevice.findOne({where:{id}})
                basketDevice.isBought = true;
                await basketDevice.save();

            }
            return res.json({message:"Buy Successfully"})}
        catch(e){next(ApiError.badRequest(e.message))}

    }

    async orderConfirm(req,res,next){
        try {const {id}=req.body;
        const basketDevice = await BasketDevice.findOne({where:{id}})
        basketDevice.isDelivered= true;
        await basketDevice.save();
        return res.json({message:"Successfully Delivered"})}
        catch(e){next(ApiError.badRequest({message:"Server confirmation error"}))}


    }

    async orderState(req,res,next){
        try {const {id, state}=req.body;
        const basketDevice = await BasketDevice.findOne({where:{id}})
        basketDevice.state= state;
        await basketDevice.save();
        return res.json({message:"Delivery's state changed"})}
        catch(e){next(ApiError.badRequest(e.message))}


    }

    async remove(req,res, next){
        try {
            const {id}=req.params;
            const prod = await BasketDevice.findOne({where:{id}});
            if (!prod) {
                return res.status(404).json({ error: "Device is not found" });
            }
            await prod.destroy();
            return res.json({message:"Successfully"})}
        catch(e){  next(ApiError.badRequest(e.message))}


    }

    async add(req, res, next){
       try{
           const {basketId, deviceId}=req.body;

           if (!basketId || !deviceId) {
               return res.status(400).json({ error: "Data format error" });
           }

           const basketDevice = await BasketDevice.create({basketId, deviceId})
           return res.json(basketDevice)}
       catch (e) {
           next(ApiError.badRequest(e.message))
       }
    }






};

module.exports = new BasketController();

