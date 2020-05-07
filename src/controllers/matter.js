import model from '../database/models';

/**
 * Matter creation object
 */

 export const matterController = {
     /**
      * this functionality allows admin to create matter
      */
     async addMatter(req, res){
         const matterObj = {
             title: req.body.title,
             code: req.body.code,
             client: req.body.client.split(','),
             start_date: req.body.start_date,
             end_date: req.body.end_date,
             description: req.body.description,
             matter_type: req.body.mattertype,
             assignees: req.body.assignees.split(','),
             parties: req.body.party,
             userId: req.authData.payload.id,
             created_by: req.body.adminfullname
         };
         try {
             let matter = await model.Matter.create(matterObj);
             return res.status(201).json({
                 status: 201,
                 matter
             });
         }catch(error){
             return res.status(500).json({
                 status: 500,
                 error: error.message
             });
         }
     }
 }