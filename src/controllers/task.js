import model from '../database/models';
import { getMatter } from '../services/matter';
import { getUpdateById } from '../services/update';
import { convertParamToNumber } from '../helpers/util';
import { Op } from 'sequelize';



/**
 * Matter creation object
 */

 export const taskController = {
     /**
      * this functionality allows 
      * staff and admin create tasks
      */
     async addTask(req, res){
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

          
            const taskObj = {
                task_detail: req.body.detail,
                case: matter.title,
                due_date: req.body.date,
                due_time: req.body.duetime,
                assignees: req.body.assignees,
                status: req.body.status,
                userId: req.authData.payload.id,
                matterId: matter.id
            };

            let task = await model.Task.create(taskObj);
             return res.status(201).json({
                 status: 201,
                 task
             })
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

      if (req.authData.payload.id === update.userId){
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
  
  async deleteUpdate(req, res){
      let { updateId } = req.params;
      updateId = convertParamToNumber(updateId);

      const update = await getUpdateById(updateId);
      if(update){
          await update.destroy();
          return res.status(200).json({
              status: 200,
              message: 'Update successfully deleted'
          });
      } else {
          return res.status(404).json({
              status: 404,
              message: 'update not found'
          });
      }
  },

  async getUpdatePlusAssociatedComments(req, res){
    let { updateId } = req.params;
    updateId = convertParamToNumber(updateId);

    try{
        const Update = await model.Update.findOne({
            where: {
                id:updateId
              },
              include: [{
                model: model.Comment,
                as: 'comments'
              }]
        });
        if(Update){
            return res.status(200).json({
                status: 200,
                Update
            });
        } else {
            return res.status(404).json({
                status: 404,
                error: 'Update does not exist'
            });
        }
         
     } catch(err){
         return res.status(500).json({
             status: 500,
             error: err.message
         });
     }
  },
}





