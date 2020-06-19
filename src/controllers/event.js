import model from '../database/models';
import { convertParamToNumber } from '../helpers/util';



  /** get event by id on 
   *  the application
   */
  export const getEventById = async (id) => {
    try {
        const Event = model.Event.findOne({ where: { id }  });
        return Event;
      } catch (error) {
        throw error;
      }
  }

/**
 * event object creation
 */

 export const eventController = {
     /**
      * functionality allows admins 
      * create events
      */
     async addEvent(req, res){
         const eventObj = {
             name: req.body.name,
             venue: req.body.venue,
             date: req.body.date,
             employee_assigned: req.body.assignee,
             userId: req.authData.payload.id
        }

        try {
            let createdEvent = await model.Event.create(eventObj);
            return res.status(201).json({
                status: 201,
                createdEvent
            });
        } catch(error){
            return res.status(500).json({
                status: 500,
                error: error.message
            })
        } 
     },

     /**
      * assign staff to event
      */
     async updateEvent(req,res) {
         let { id } = req.params;
         id = convertParamToNumber(id);
         try {
            let event = await getEventById(id);
            if(event === null || event === undefined) {
                return res.status(404).json({
                    status: 404,
                    error: 'Event not found'
                });
            }

            event.name = req.body.name || event.name;
            event.employee_assigned = req.body.assignee || event.employee_assigned;
            return res.status(200).json({
                status: 200,
                event
            });
         }catch(error){
             return res.status(500).json({
                 status: 500,
                 error: error.message
             });
         }
     },

     /**
      * view all events
      */
     async viewAllEvents(req, res){
        let { offset, limit, order, sort } = req.query;

        offset = offset ? Number(offset) : 0;
        limit = limit ? Number(limit) : 10;

        try {
            const data = await model.Event.findAndCountAll({
                order: [[sort || "updatedAt", order || "DESC"]],
                offset,
                limit
             })
             if(data.length === 0) {
                 return res.status(200).json({
                     status: 200,
                     message: 'No events available'
                 })
             }
             return res.status(200).json({ data: data.rows, offset, limit, total: data.count });
        } catch(error){
            return res.status(500).json({
                status: 500,
                error: error.message
            });
        }  
     }
 }
