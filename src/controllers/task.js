import sequelize from 'sequelize';
import model from '../database/models';
import { getMatter } from '../services/matter';
import { getUpdateById } from '../services/update';
import { getTaskById } from '../services/task';
import { convertParamToNumber } from '../helpers/util';
import { Op } from 'sequelize';
import { getUserById } from '../services/user';


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
      * and also search based
      * on certain keywords
      */
     async getAllTasks(req, res){
        let { id, role } = req.authData.payload;
        let { offset, limit, order, sort, today, status, sevendays, casename } = req.query;

        try {
            if(role === 'admin') {

                 if(today){
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
                let days = new Date(sevendays);
                //add number of days
                days.setDate(days.getDate() + 7);
                let newDate = days.toISOString().substr(0,10);
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

    /**
     * toggle task status
     */
    async changeTaskStatus(req, res){
        let { id } = req.params;
        id = convertParamToNumber(id);
        try {
            let task = await getTaskById(id);
            if(req.authData.payload.id === task.assignee){
                task.status = req.body.status || task.status;
                await task.save();
                return res.status(200).json({
                status: 200,
                task
            })
          } 
          return res.status(403).json({
              status: 403,
              error: 'You can not change the status of a task you were not assigned to'
          });   
        } catch(err) {
            return res.status(500).json({
                status: 500,
                error: error.message
            })
        }
    },

    /**
     * get single task
     */
    async getTask(req, res) {
        let { id } = req.params;
        id = convertParamToNumber(id);
        try {
            let task = await getTaskById(id);
            if(!task){
                return res.status(404).json({
                    status: 404,
                    error: 'Task not found'
                });
            }

            let assignee = await getUserById(task.assignee);
            task.assignee = assignee;
            return res.status(200).json({
                status: 200,
                task
            });
        } catch(error){
            return res.status(500).json({
                status: 500,
                error: error.message
            });
        }
    }
}




