import model from '../database/models';

/**
 * Matter creation object
 */

 export const matterTypeController = {
     /**
      * this functionality allows admin to create matter type
      */
     async addMatterType(req, res){
         const matterTypeObj = {
             name: req.body.name,
             userId: req.authData.payload.id
         };
         try {
             let mattertype = await model.MatterType.create(matterTypeObj);
             return res.status(201).json({
                 status: 201,
                 mattertype
             });
         }catch(error){
             return res.status(500).json({
                 status: 500,
                 error: error.message
             });
         }
     },

     async getAllMatterTypes(req, res){
        const mattertypes = await model.MatterType.findAll({}).map(el => el.get({ raw: true }));
        try {
            return res.status(200).json({
                status: 200,
                mattertypes
            });
        } catch(error){
            return res.status(500).json({
                status: 500,
                err: error.message
            });
        }
    }
 }