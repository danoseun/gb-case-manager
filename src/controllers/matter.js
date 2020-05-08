import model from '../database/models';
import { getMatter } from '../services/matter';

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
     },

     async getMatter(req, res){
        let { id } = req.params;
        id = Number(id);

        try {
            const matter = await getMatter(id);

            if(matter){
                return res.status(200).json({
                    status: 200,
                    matter
                })
            } else {
                return res.status(404).json({
                    status: 404,
                    message: 'Matter not found'
                });
            }
        } catch(error){
            return res.status(500).json({
                status: 500,
                err: error.message
            })
        }
    },

    async getMatters(req, res){
    let { offset, limit, order, sort, ...rest } = req.query;
    offset = offset ? parseInt(offset) : 0;
    limit = limit ? parseInt(limit) : 10;
    let options = {};

    if (Object.keys(rest).length) {
        for (const key in rest) {
          if (rest.hasOwnProperty(key)) {
            const value =
              key === "q" ? { [Op.like]: `%${rest[key]}%` } : rest[key];
            const field = key === "q" ? ("title" || "code") : key;
            options[field] = value;
          }
        }
      }

    try {
        const data = await model.Matter.findAndCountAll({
            where: options,
            order: [[sort || "updatedAt", order || "DESC"]],
            offset,
            limit
          });
            if(data.rows.length > 0){
            return res
            .status(200)
            .json({ data: data.rows, offset, limit, total: data.count });
         }
           else {
              return res.status(404).json({
                  status: 404,
                  message: 'What you are searching for is unavailable at this time'
              })
          }
          
    } catch (error) {
      return res.status(500).json({
          status: 500,
          err: error.message
      });
    }
  },

  async updateMatter(req, res){
      let { id } = req.params;
      id = Number(id);

      try {
      const matter = await getMatter(id);
      matter.title = req.body.title || matter.title;
      matter.code = req.body.code || matter.code;
      matter.client = req.body.client.split(',') || matter.client;
      matter.start_date = req.body.start_date || matter.start_date;
      matter.end_date = req.body.end_date || matter.end_date;
      matter.description = req.body.description || matter.description;
      matter.matter_type = req.body.mattertype || matter.matter_type;
      matter.assignees = req.body.assignees.split(',') || matter.assignees;
      matter.parties = req.body.party || matter.parties;
      
      const newmatter = await matter.save()
      return res.status(200).json({
          status: 200,
          newmatter
      });
      } catch(error){
          return res.status(500).json({
              status: 500,
              error: error.message
          });
      }
  }
 }