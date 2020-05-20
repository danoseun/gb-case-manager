import dotenv from 'dotenv';
//import fs from 'fs';
import model from '../database/models';
import { getMatter, getAllMatterResources, getMatterUpdates } from '../services/matter';
import { getUpdateById } from '../services/update';
import { convertParamToNumber } from '../helpers/util';
import { Op } from 'sequelize';



/**
 * Matter creation object
 */

 export const updateController = {
     /**
      * this functionality allows 
      * assignees/collaborators to 
      * log update on a case
      */
     async addUpdate(req, res){
         let { matterId } = req.params;
         matterId = convertParamToNumber(matterId);
         try {
          const matter = await getMatter(matterId);

          if(!matter){
              return res.status(404).json({
                  status:404,
                  error: 'This matter does not exist'
              });
          }

          if((matter.assignees).includes(req.authData.payload.id)){
            const updateObj = {
                title: req.body.title,
                description: req.body.description,
                updatetype: req.body.updatetype,
                case: matter.title,
                new_court_date: req.body.new_court_date,
                staff_name: req.authData.payload.fullname,
                userId: req.authData.payload.id,
                matterId: matter.id
            };

            let update = await model.Update.create(updateObj);
             return res.status(201).json({
                 status: 201,
                 update
             });
          } else {
              return res.status(403).json({
                  status: 403,
                  error: 'You cannot post an update on a case you are not assigned to'
              })
          }
         } catch(error){
             return res.status(500).json({
                 status: 500,
                 error: error.message
             });
         }
     },

     async getMatterUpdates(req, res){
        let { matterId } = req.params;
        matterId = convertParamToNumber(matterId);

        try {
            const matter = await getMatter(matterId);
            if(matter){
                matterId = matter.id;
                let [attached_resources] = await getAllMatterResources(matterId);
                let updates = await getMatterUpdates(matterId);
                //console.log('updates', updates);
                return res.status(200).json({
                    status: 200,
                    updates,
                    attached_resources 
                })
            } else {
                return res.status(404).json({
                    status: 404,
                    error: 'Matter'
                })
            }
        } catch(error){
            return res.status(500).json({
                status: 500,
                err: error.message
            })
        }
    },

    async addCommentToUpdate(req, res){

        try{
            let { updateId } = req.params;
            updateId = convertParamToNumber(updateId);
            let update = await getUpdateById(updateId);
            if(update === null || update === undefined){
            return res.status(404).json({
                status: 404,
                error: 'You can not post a comment for a non existent update'
            })
        }
        const commentObj = {
            content: req.body.content,
            userId: req.authData.payload.id,
            updateId: update.id
        }

        let comment = await model.Comment.create(commentObj);
        return res.status(201).json({
            status: 201,
            comment
        });
        } catch(error){
            return res.status(500).json({
                status: 500,
                error: error.message
            });
        }
    },

    
  async editUpdate(req, res){
      let { updateId } = req.params;

      updateId = convertParamToNumber(updateId);
      
      try {
      const update = await getUpdateById(updateId); 

      if(req.authData.payload.id === update.userId){
        update.title = req.body.title || update.title;
        update.description = req.body.description || update.description;
        update.updatetype = req.body.updatetype || update.updatetype
        update.new_court_date = req.body.new_court_date || update.new_court_date;
        
        const newUpdate = await update.save()

        return res.status(200).json({
            status: 200,
            newUpdate
          });
      } else {
          return res.status(403).json({
              status: 403,
              error: 'You can not edit an update you did not author'
          });
      }
      
      
      } catch(error){
          return res.status(500).json({
              status: 500,
              error: error.message
          });
      }
  },


  async getCommentUpdates(req, res){},

  async deleteMatter(req, res){
      let { id } = req.params;
      id = convertParamToNumber(id);

      const matter = await getMatter(id);
      if(matter){
          await matter.destroy();
          return res.status(200).json({
              status: 200,
              message: 'Matter successfully deleted'
          });
      } else {
          return res.status(404).json({
              status: 404,
              message: 'matter not found'
          });
      }
  }
}





