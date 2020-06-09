import 'dotenv/config';
import sequelize from 'sequelize';
import model from '../database/models';
import { getMatter } from '../services/matter';
import { getUpdateById } from '../services/update';
import { getTaskById } from '../services/task';
import { convertParamToNumber } from '../helpers/util';
import { Op } from 'sequelize';
import { getUserById, getAllAdmins } from '../services/user';
import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


/**
 * Task creation object
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
            const url = `https://ghalibchambers/tasks/${task.id}`
            let admins = await getAllAdmins();

            let emails = admins.map(admin => admin.email);
        
            let assigned = await getUserById(task.assignee);
            
            emails.push(assigned.email);
            
            const msg = {
                to: emails,
                from: 'Ghalib Chambers Notifications <oluwaseun@asb.ng>',
                subject: '🍩 A new task has just been created. 🍩',
                html: `<p>Checkout this newly created task <a href=${url}>${url}</a> </p>`,
              };

              sgMail.sendMultiple(msg).then(() => {
                console.log('emails sent successfully!');
              }).catch(error => {
                console.log(error);
              });

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
        offset = offset ? Number(offset) : 0;
        limit = limit ? Number(limit) : 10;

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
                let userTasks = await model.Task.findAndCountAll({ 
                attributes: { exclude: ['assignee'] },
                order: [[sort || "updatedAt", order || "DESC"]],
                offset,
                limit
            })
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
               let userTasks = await model.Task.findAndCountAll({ 
                   attributes: { exclude: ['assignee'] },
                   where: { 
                       assignee:{
                           [Op.eq]: id
                   }
               },
               order: [[sort || "updatedAt", order || "DESC"]],
                offset,
                limit
           })
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
    },

    /**
     * This function hunts for tasks
     * that reminders need to be sent for
     */
    async taskReminder(){
        var now = new Date();
        now.setDate(now.getDate()+1);
        //console.log('D', now);
        const dueTasks = await model.Task.findAll({
            where: {
                [Op.and]: sequelize.where(sequelize.fn('date', sequelize.col('due_date')), '=', now),
                [Op.or]: [{status: 'to-do'}, {status: 'in-progress'}]
            }
        }).map(el => el.get({ raw: true }));
        //console.log('HERE', dueTasks);
        if(dueTasks.length > 0){
            let values = dueTasks.map(({task_detail, assignee}) => ({task_detail, assignee}));
            //console.log('values', values);
            let assignees = await Promise.all(values.map(value => getUserById(value.assignee)));
            //console.log('users', assignees);

            // filter out instances of null(null occurs when a user has been deleted from the db)
            let filteredAssignees = assignees.filter(function (el) {
                return el !== null;
              });
           // get a pure array of user objects
            filteredAssignees.map(el => el.get({ raw: true }));
            //console.log('filt', filteredAssignees);
            // return list of user emails
            let emails = filteredAssignees.map(user => user.email);
            console.log('emails', emails);

            const msg = {
                to: emails,
                from: 'Ghalib Chambers Notifications <oluwaseun@asb.ng>',
                subject: '🍩 Your task is due tomorrow. 🍩',
                html: `<p>Task is due tommorow</p>`,
              };

              sgMail.sendMultiple(msg).then(() => {
                console.log('emails sent successfully!');
              }).catch(error => {
                console.log(error);
              });
        }
    }
}




