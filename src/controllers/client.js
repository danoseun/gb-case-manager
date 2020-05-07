import model from '../database/models';

/**
 * Matter creation object
 */

 export const clientController = {
     /**
      * this functionality allows admin to create client
      */
     async addClient(req, res){
         const clientObj = {
             name: req.body.name,
             phone: req.body.phone,
             email: req.body.email,
             userId: req.authData.payload.id
         };
         try {
             let client = await model.Client.create(clientObj);
             return res.status(201).json({
                 status: 201,
                 client
             });
         }catch(error){
             return res.status(500).json({
                 status: 500,
                 error: error.message
             });
         }
     }
 }