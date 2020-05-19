import dotenv from 'dotenv';
//import fs from 'fs';
import model from '../database/models';
import { getMatter, getAllMatterResources, getMatterUpdates } from '../services/matter';
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
         console.log(req.authData.payload);
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
                //console.log('here', result);
                // if(result.length < 0){
                //     return res.status(404).json({
                //         status: 404,
                //         message: 'No resource has been uploaded for this file'
                //     });
                // }
                //const resources = result[0].attached_resources;
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

    async getMatters(req, res){
    let { offset, limit, order, sort, ...rest } = req.query;
    offset = offset ? parseInt(offset) : 0;
    limit = limit ? parseInt(limit) : 10;
    let options = {};

    if (Object.keys(rest).length) {
        for (const key in rest) {
          if (rest.hasOwnProperty(key)) {
            const value =    
              key === "q" ? { [Op.iLike]: `%${rest[key]}%` } : rest[key];
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
      id = convertParamToNumber(id);
      
      try {
      const matter = await getMatter(id);
      
      matter.title = req.body.title || matter.title;
      matter.code = req.body.code || matter.code;
      matter.client = req.body.client ? mergeUnique(matter.client, req.body.client) : matter.client;
      matter.start_date = req.body.start_date || matter.start_date;
      matter.end_date = req.body.end_date || matter.end_date;
      matter.description = req.body.description || matter.description;
      matter.matter_type = req.body.mattertype || matter.matter_type;
      matter.assignees = req.body.assignees ? mergeUnique(matter.assignees, req.body.assignees) : matter.assignees; 
      matter.location = req.body.location || matter.location;
      matter.status = req.body.status || matter.status;
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
  },

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
  },

  async uploadMatterResources(req, res){
      //console.log('REQ', req.authData.payload)
      
    try {
        let id = convertParamToNumber(req.params.id);
        const matter = await getMatter(id);
        if(!matter){
            return res.status(404).json({
                status: 404,
                error: 'Matter you want to upload resource for is not available'
            });
        }
        if(!req.files){
            return res.status(400).json({
                status: 400,
                error: 'No files attached'
            })
        }
        const files = req.files.image;
        let uploads = files.map(file => new Promise((resolve, reject) => {
          cloudinary.uploader.upload(file.tempFilePath, { resource_type: "auto"}, (err, result) =>{
              if(err) reject(err);
              else resolve(result);
           })
        })
      )
        let result = []
      
            try {
                result = await Promise.all(uploads)
                // result.forEach(function (item) {
                //     console.log('res', result);
                //     let x = Number(item.public_id);
                //     console.log('type', typeof x)
                //     return x;
                // });
                //fs.rmdirSync('./tmp', { recursive: true });
            } catch(err){
                console.log('err', err);
            return res.status(400).json({
                status: 400,
                error: err.message
            });
        }
        
        const resourceObj = {
            userId:req.authData.payload.id,
            matterId:matter.id,
            attached_resources:result
        }
        const newMatterResource = await model.MatterResource.create(resourceObj)
        return res.status(201).json({
            status: 201,
            newMatterResource
        });
    } catch(err){
          return res.status(500).json({
              status: 500,
              err: err.message
          })
      }
    },
    
    async getMatterResources(req,res) {
        let matterId = convertParamToNumber(req.params.id);
        try{
            const result = await model.MatterResource.findAll({
                where: {
                    matterId
                  }
            }).map(el => el.get({ raw: true }));
            if(!result) {
                return res.status(404).json({
                    status: 404,
                    message: 'No resources have been created for this matter'
                });
            }
            else {
                return res.status(200).json({
                    status: 200,
                    result
                })
            }
        } catch(error){
            return res.status(500).json({
                err: error.message
            })
        }
    },


    async deleteMatterResource(req, res){
        let matterId = convertParamToNumber(req.params.id);
        let uploadId = convertParamToNumber(req.params.upload_id);
        let public_id = req.params.public_id;
        console.log(typeof public_id, public_id);
        try {
            const resource = await model.MatterResource.destroy({
             //attributes: ['attached_resources'],
             where: {
                matterId,
                //id:uploadId,
                attached_resources:{
                    //[Op.col]: 'attached_resources.public_id'
                    [Op.eq]: public_id
            }
        }
              })
              console.log('RESOURCE', resource);
              return res.status(200).json({
                  status: 200,
                  resource,
                  message: 'Resource deleted'
              });

        } catch(error){
            return res.status(500).json({
                err: error.message
            })
    }
  }
}





