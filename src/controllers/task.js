import sequelize from 'sequelize';
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
                assignee: req.body.assignee,
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

     /**
      * View all tasks
      */
     async getAllTasks(req, res){
        let { id, role } = req.authData.payload;
        let { offset, limit, order, sort, today, status, sevendays, casename } = req.query;

        try {
            if(role === 'admin') {

                 if(today){
                    //  console.log('t', today);
                    //  let todayDate = JSON.stringify(new Date()).split('T')[0];
                    //  console.log(todayDate);
                    //  todayDate = todayDate.replace('"', '');
                    //  console.log('2', todayDate);
                    const data = await model.Task.findAndCountAll({
                    attributes: { exclude: ['assignee'] },
                    where: sequelize.where(sequelize.fn('date', sequelize.col('due_date')), '=', today), 
                    order: [[sort || "updatedAt", order || "DESC"]],
                    offset,
                    limit
                  });
                  return res.status(200).json({ data: data.rows, offset, limit, total: data.count });
               }

               if(status){
                const data = await model.Task.findAndCountAll({
                attributes: { exclude: ['assignee'] },
                where: { 
                    status:{
                        [Op.eq]: `${status}`
                }
             }, 
                order: [[sort || "updatedAt", order || "DESC"]],
                offset,
                limit
              });
              return res.status(200).json({ data: data.rows, offset, limit, total: data.count });
           }
            
           
               if(sevendays){
                 // my implementation  
                // let days = new Date();
                // days.setDate(days.getDate() + 7);
                // days = JSON.stringify(days).split('T')[0];
                // days = days.replace('"', '');
                let days = new Date(sevendays);
                days.setDate(days.getDate() + 7); //add number of days
                let newDate = days.toISOString().substr(0,10);
                console.log('HERE', newDate);
                const data = await model.Task.findAndCountAll({
                    attributes: { exclude: ['assignee'] },
                    where: sequelize.where(sequelize.fn('date', sequelize.col('due_date')), '=', newDate),
                    order: [[sort || "updatedAt", order || "DESC"]],
                    offset,
                    limit
                  });
                  return res.status(200).json({ data: data.rows, offset, limit, total: data.count });
            }

              if(casename){
                const data = await model.Task.findAndCountAll({
                    attributes: { exclude: ['assignee'] },
                    where: { 
                        case:{
                            [Op.iLike]: `%${casename}%`
                    }
                }, 
                    order: [[sort || "updatedAt", order || "DESC"]],
                    offset,
                    limit
                  });
                  return res.status(200).json({ data: data.rows, offset, limit, total: data.count });
             }

             else {
                let userTasks = await model.Task.findAll({ 
                attributes: { exclude: ['assignee'] }
            }).map(el => el.get({ raw: true }));
                if(userTasks){
                    return res.status(200).json({
                        status: 200,
                        userTasks
                    })
                } else {
                    return res.status(404).json({
                        status: 404,
                        error: 'No tasks available'
                    })
                 }
               }
             }
             
             // users other than admin
             else {
                if(today){
                    const data = await model.Task.findAndCountAll({
                    attributes: { exclude: ['assignee'] },
                    where: {
                        [Op.and]: sequelize.where(sequelize.fn('date', sequelize.col('due_date')), '=', today), 
                        assignee: {[Op.eq]: id}
                     }, 
                    order: [[sort || "updatedAt", order || "DESC"]],
                    offset,
                    limit
                  });
                  return res.status(200).json({ data: data.rows, offset, limit, total: data.count });
               }

               if(status){
                const data = await model.Task.findAndCountAll({
                attributes: { exclude: ['assignee'] },
                where: { 
                    [Op.and]:[{
                    status:{
                        [Op.eq]: `${status}`
                }
              },{
                    assignee:{
                        [Op.eq]: id
                }
               }]
             }, 
                order: [[sort || "updatedAt", order || "DESC"]],
                offset,
                limit
              });
              return res.status(200).json({ data: data.rows, offset, limit, total: data.count });
           }

               
           
             if(sevendays){
                 let days = new Date(sevendays);
                 //add 7 days to the entered date
                 days.setDate(days.getDate() + 7); 
                 let newDate = days.toISOString().substr(0,10);
                 console.log('HERE', newDate);
                 const data = await model.Task.findAndCountAll({
                 attributes: { exclude: ['assignee'] },
                 where: {
                    [Op.and]: sequelize.where(sequelize.fn('date', sequelize.col('due_date')), '=', newDate), 
                    assignee: {[Op.eq]: id}
                 }, 
                 order: [[sort || "updatedAt", order || "DESC"]],
                 offset,
                 limit
              });
              return res.status(200).json({ data: data.rows, offset, limit, total: data.count });
           }

            if(casename){
              const data = await model.Task.findAndCountAll({
                attributes: { exclude: ['assignee'] },
                where: {
                    [Op.and]:[{ 
                    case:{
                        [Op.iLike]: `%${casename}%`
                }
            },{
                    assignee:{
                        [Op.eq]: id
                }
            }]
            }, 
                order: [[sort || "updatedAt", order || "DESC"]],
                offset,
                limit
              });
              return res.status(200).json({ data: data.rows, offset, limit, total: data.count });
         }

          else {
               let userTasks = await model.Task.findAll({ 
                   attributes: { exclude: ['assignee'] },
                   where: { 
                       assignee:{
                           [Op.eq]: id
                   }
               }
           }).map(el => el.get({ raw: true }));
               if(userTasks){
                   return res.status(200).json({
                       status: 200,
                       userTasks
                   })
               } else {
                   return res.status(404).json({
                       status: 404,
                       error: 'You have no tasks yet'
                   })
                }
              }
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



exports.findAll = (req, res) => {
    const title = req.query.title;
    const description = req.query.description;
    Tutorial.findAll({
            where: {
                [Op.or]: [{
                        title: {
                            [Op.like]: `%${title}%`
                        }
                    },
                    {
                        description: {
                            [Op.like]: `%${description}%`
                        }
                    }
                ]
            }
        })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            });
        });

};
