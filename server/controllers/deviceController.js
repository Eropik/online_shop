
const {Device, DeviceInfo} = require('../models/models')
const ApiError = require('../error/ApiError')


const uuid = require('uuid')
const path = require('path')

class DeviceController{

    async create(req,res, next){
        try{
            let { name, price, brandId, typeId, info} = req.body
            const {img} = req.files
            let fileName = uuid.v4()+".jpg"
            await img.mv(path.resolve(__dirname,'..','static', fileName))
            const device = await Device.create({name, price, brandId,typeId,img: fileName})

            if(info){
                info = JSON.parse(info)
                info. forEach(i=>
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId : device.id

                    })
                )
            }

            return res.json(device)
        }
        catch(e)
        {next(ApiError.badRequest({message:"Server creation error"}))}
    }

    async getAll(req,res){
       try{ let { brandId, typeId, limit, page } = req.query
        page = page || 1
        limit = limit || 3
        let offset = page * limit - limit
        let devices;
        if(!brandId && !typeId){
            devices= await Device.findAndCountAll({limit, offset})
        }
        if(!brandId && typeId){
            devices= await Device.findAndCountAll({where:{typeId}, limit, offset})
        }
        if(brandId && !typeId){
            devices= await Device.findAndCountAll({where:{brandId}, limit, offset})
        }
        if(brandId && typeId){
            devices= await Device.findAndCountAll({where:{typeId,brandId}, limit, offset})


        }
        return res.json(devices)}
        catch(e){ApiError.badRequest({ message: 'Server gatting device error' })}
    }

    async getOne(req,res){
        try{const {id}=req.params

        const device = await Device.findOne(
            {
                where:{id},
                include : [{model : DeviceInfo, as : 'info'}]
            },
        )
        return res.json(device)}
        catch(e){next(ApiError.badRequest({ message: 'Server gatting device error' }))}
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const device = await Device.findOne({ where: {id} });

            if (!device) {
                return res.status(404).json({ message: 'Device is not found' });
            }

            await device.destroy();
            return res.status(200).json({ message: 'Successfully deleted' });
        } catch (error) {
            next(ApiError.badRequest({ message: 'Server error' }));
        }
    }

    async change(req, res, next) {
        try {
            const { id } = req.params;
            const { name, price, typeId, brandId, info} = req.body;
            const device = await Device.findOne({where: {id}});
            if (!device) {
                return next(ApiError.badRequest({ message: 'Device is undefined' }));
            }
            try{
                const {img} = req.files;
                if(img) {
                    let fileName = uuid.v4() + ".jpg"
                    await img.mv(path.resolve(__dirname, '..', 'static', fileName))
                    device.img = fileName;
                }
            }
            catch (e) {
                ApiError.badRequest(e.message)
            }

            if (name) device.name = name;
            if (price) device.price = price;
            if (typeId) device.typeId = typeId;
            if (brandId) device.brandId = brandId;

            await book.save();

            
            if (info) {
                const infoData = JSON.parse(info);

              
                await DeviceInfo.destroy({ where: { devcieId: id } });

                
                for (const i of infoData) {
                    await DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: id
                    });
                }
            }

            return res.status(200).json({ message: 'Succesfuly changed' });
        } catch (error) {
            
            next(ApiError.badRequest({ message: 'Server error' }));
        }
    }

}

module.exports = new DeviceController()