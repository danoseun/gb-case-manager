import model from '../database/models';
import { Op } from 'sequelize';
import { convertParamToNumber } from '../helpers/util';

   /** get updatetype by id on 
   *   the application
   */
  export const getUpdateTypeById = async (id) => {
    try {
        const UpdateType = model.UpdateType.findOne({ where: { id }  });
        return UpdateType;
      } catch (error) {
        throw error;
      }
  }

   /** get updatetype by name on 
   *   the application
   */
  export const getUpdateTypeByName = async (name) => {
    try {
        const UpdateType = model.UpdateType.findOne({ 
            where: { 
                name: {
                    [Op.iLike]: `%${name}%`
              } 
            }  
        });
        return UpdateType;
      } catch (error) {
        throw error;
      }
  }

/**
 * UpdateType controller object
 */

 export const updateTypeController = {
     /**
      * this functionality allows admin to create update type
      */
     async addUpdateType(req, res){
         const updateTypeObj = {
             name: req.body.name,
             userId: req.authData.payload.id
         };

         
         try {
             let updatetype = await model.UpdateType.create(updateTypeObj);
             return res.status(201).json({
                 status: 201,
                 updatetype
             });
         } catch(error){
             return res.status(500).json({
                 status: 500,
                 error: error.message
             });
         }
     },

     /**
      * functionality allows admins to get all update types
      */
     async getAllUpdateTypes(req, res){
        const updatetypes = await model.UpdateType.findAll({}).map(el => el.get({ raw: true }));
        try {
            return res.status(200).json({
                status: 200,
                updatetypes
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
     * admin edit updatetype
     */
    async editUpdateType(req, res){
        let { id } = req.params;
        id = convertParamToNumber(id);

        try {
            const updatetype =  await getUpdateTypeById(id);
            if(!updatetype){
                return res.status(404).json({
                    status: 404,
                    error: 'matter type not found'
                });
            }
            else {
                const ifExists = await getUpdateTypeByName(req.body.name);
                if(ifExists === null || ifExists === undefined) {
                    updatetype.name = req.body.name || updatetype.name;
                    await updatetype.save();
                    return res.status(200).json({
                          status: 200,
                          updatetype
                   }); 
                }
                return res.status(409).json({
                    status: 409,
                    error: 'An update type with this name exists already'
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
     * admin delete updatetype by id
     */
    async deleteUpdateType(req, res){
        let { id } = req.params;
        id = convertParamToNumber(id);
        const updatetype = await getUpdateTypeById(id);

        if(!updatetype) {
            return res.status(404).json({
                status: 404,
                error: 'update type not found'
            })
        }
        await updatetype.destroy();
        return res.status(200).json({
            status: 200,
            message: 'update type successfully deleted'
        })
    }
 }