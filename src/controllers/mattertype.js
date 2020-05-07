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
     }
 }