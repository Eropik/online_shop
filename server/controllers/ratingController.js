const {Device, Rating} = require("../models/models");

const ApiError = require("../error/ApiError");

class ratingController {

    async ratingDevice  (req, res,next){
     try{
        const {deviceId, rate, userId}=req.body;
     let device = await Device.findOne({where:{id:deviceId}});
     let rating = await Rating.findOne({where:{userId,deviceId}});
     if(rating){
         return res.status(400).json({error:"Rating has already been added"})
     }
     else{
         const rating = await Rating.create({deviceId, rate, userId});
         let rateSum = 0;
         const ratings = await Rating.findAll({where:{deviceId}});
         ratings.forEach(rating => {rateSum+=rating.rate;});
         device.rating=rateSum/ratings.length;
         await device.save();
         return res.json(device)               
     }} catch (e) {
        next(ApiError.badRequest(e.message));
    }
    }
}

module.exports = new ratingController();