import model from '../database/models';
import { Op } from 'sequelize';
import { convertParamToNumber } from '../helpers/util';

   /** get mattertype by id on 
   *   the application
   */
  export const getMatterTypeById = async (id) => {
    try {
        const MatterType = model.MatterType.findOne({ where: { id }  });
        return MatterType;
      } catch (error) {
        throw error;
      }
  }

  /** get mattertype by name on 
   *  the application
   */
  export const getMatterTypeByName = async (name) => {
    try {
        const MatterType = model.MatterType.findOne({ 
        where: { 
            name: {
                [Op.iLike]: `%${name}%`
          }
        }  
    });
        return MatterType;
      } catch (error) {
        throw error;
      }
  }


/**
 * MatterType controller object
 */

 export const matterTypeController = {
     /**
      * this functionality allows admin to create matter type
      */
     async addMatterType(req, res){
         const matterTypeObj = {
             name: req.body.name,
             userId: req.authData.payload.id
         };
         try {
             let mattertype = await model.MatterType.create(matterTypeObj);
             return res.status(201).json({
                 status: 201,
                 mattertype
             });
         }catch(error){
             return res.status(500).json({
                 status: 500,
                 error: error.message
             });
         }
     },

     /**
      * functionality allows admins to get all matter types
      */
     async getAllMatterTypes(req, res){
        const mattertypes = await model.MatterType.findAll({}).map(el => el.get({ raw: true }));
        try {
            return res.status(200).json({
                status: 200,
                mattertypes
            });
        } catch(error){
            return res.status(500).json({
                status: 500,
                err: error.message
            });
        }
    },

    /**
     * functionality to allow
     * admin edit mattertype
     */
    async editMatterType(req, res){
        let { id } = req.params;
        id = convertParamToNumber(id);

        try {
            const mattertype =  await getMatterTypeById(id);
            if(!mattertype){
                return res.status(404).json({
                    status: 404,
                    error: 'matter type not found'
                });
            }

            else {
                const ifExists = await getMatterTypeByName(req.body.name.trim());
                console.log('if', ifExists);
                if(ifExists === null || ifExists === undefined) {
                    mattertype.name = req.body.name || mattertype.name;
                    await mattertype.save();
                    return res.status(200).json({
                         status: 200,
                         mattertype
                  }); 
                }
                return res.status(409).json({
                    status: 409,
                    error: 'A matter type with this name already exists'
                })
                 
            }
           
        } catch(error){
            return res.status(500).json({
                status: 500,
                error: error.message
            })
        }
    },

    /**
     * functionality allows 
     * admin delete mattertype
     */
    async deleteMatterType(req, res){
        let { id } = req.params;
        id = convertParamToNumber(id);
        const mattertype = await getMatterTypeById(id);

        if(!mattertype) {
            return res.status(404).json({
                status: 404,
                error: 'matter type not found'
            })
        }
        await mattertype.destroy();
        return res.status(200).json({
            status: 200,
            message: 'matter type successfully deleted'
        })
    }
 }



 