import dotenv from 'dotenv';
//import fs from 'fs';
import model from '../database/models';
import sequelize from 'sequelize';
import { getMatter } from '../services/matter';
import { getUserById } from '../services/user';
import { mergeUnique, convertParamToNumber } from '../helpers/util';
//import cloudinary from '../helpers/cloudinary';
//import { dataUri } from '../helpers/multer';
let cloudinary = require('cloudinary').v2;
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

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
             client: req.body.client,
             start_date: req.body.start_date,
             end_date: req.body.end_date,
             description: req.body.description,
             matter_type: req.body.mattertype,
             assignees: req.body.assignees,
             location: req.body.location,
             branch: req.authData.payload.branch,
             status: req.body.status,
             parties: req.body.party,
             userId: req.authData.payload.id,
             created_by: req.authData.payload.fullname
         };
         try {
             let matter = await model.Matter.create(matterObj);
             return res.status(201).json({
                 status: 201,
                 matter
             });
         } catch(error){
             return res.status(500).json({
                 status: 500,
                 error: error.message
             });
         }
     },

     async getMatter(req, res){
        let { id } = req.params;
        id = convertParamToNumber(id);

        try {
            const matter = await getMatter(id);
            let newArr = matter.assignees.map(id => Number(id));
            let newAssignees;
            newAssignees = await Promise.all(newArr.map(id => getUserById(id)));
            newAssignees.map(el => el.get({ raw: true }));
            matter.assignees = newAssignees;

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
                //fs.rmdirSync('./tmp', { recursive: true });
            } catch(err){
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
    
    async getMatterResources(req,res){
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
        let public_id = req.params.public_id;
        console.log(typeof public_id);
        try {
            const resource = await model.MatterResource.destroy({
             //attributes: ['attached_resources'],
             where: {
                matterId,
                attached_resources:{
                    [sequelize.Op.contains]: [ { "public_id" : public_id } ]
            }
        }
              })
              console.log('RESOURCE', resource);
              return res.status(204).json({
                  status: 204,
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


