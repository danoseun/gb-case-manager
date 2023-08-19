import 'dotenv/config';
import model from '../database/models';
import { getMatter, getAllMatterResources, getMatterUpdates } from '../services/matter';
import { getUpdateById } from '../services/update';
import { getUserById, getAllAdmins } from '../services/user';
import { mergeUnique, convertParamToNumber } from '../helpers/util';
import { Op } from 'sequelize';
import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY);



/**
 * Matter creation object
 */

 export const updateController = {
     /**
      * this functionality allows 
      * assignees/collaborators to 
      * log update(s) on a case
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
            const url = `https://ghalibchambers/updates/${update.id}`

            let admins = await getAllAdmins();

            // fetch only emails of the admin
            let adminEmails = admins.map(admin => admin.email);

            //convert IDs to number if they are not numbers
            let newArr = matter.assignees.map(id => Number(id));
            
            //get the details of each assignee
            let newAssignees;
            newAssignees = await Promise.all(newArr.map(id => getUserById(id)));

            // filter out instances of null(null occurs when a user has been deleted from the db)
            let filteredAssignees = newAssignees.filter(function (el) {
                return el !== null;
              });
              
            // get a pure array of user objects  
            filteredAssignees.map(el => el.get({ raw: true }));
            
            // get emails of assignees
            let assigneeEmails = filteredAssignees.map(assignee => assignee.email);
            const emails = mergeUnique(adminEmails, assigneeEmails);
            
            const msg = {
                to: emails,
                from: 'Ghalib Chambers Notifications <engineering@asb.ng>',
                subject: '🍩 A new update has just been logged on a matter. 🍩',
                html: `<p>Click the link to view this newly created update <a href=${url}>${url}</a> </p>`,
              };

              sgMail.sendMultiple(msg).then(() => {
                console.log('emails sent successfully!');
              }).catch(error => {
                console.log(error);
              });

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
        
        try {
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
              include: [
                  {
                    model: model.Comment,
                    as: 'comments'
                  },
                  {
                    model: model.User,
                    as: 'author'
                  }
            ]
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

  /**
   * fetch all updates user has logged
   * frontend will display this on the homepage of 
   * each logged in user
   */
  async getUserUpdates(req, res) {
    let { offset, limit, order, sort } = req.query;
    offset = offset ? Number(offset) : 0;
    limit = limit ? Number(limit) : 10;

    try {
        const data = await model.Update.findAndCountAll({
            where: {
                userId: req.authData.payload.id
              },
              order: [[sort || "updatedAt", order || "DESC"]],
              offset,
              limit
        });
        return res.status(200).json({
            data: data.rows.length > 0 ? data.rows : 'You have no updates at the moment', 
            offset, 
            limit, 
            total: data.count
        })
    } catch(error) {
        return res.status(500).json({
            status: 500,
            error: error.message
        });
    }
  }
}





