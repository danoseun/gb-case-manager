import Validator from 'validatorjs';
import model from '../database/models';
import { Op } from 'sequelize';


/**
 * Validates mattertype property during creation
 */
export const matterTypeValidator = {
   async addMatterTypeValidator(req, res, next){
    let { name } = req.body;

    const rules = {
        name: 'required'
    };

    const validation = new Validator(req.body, rules);

    if (validation.fails()){
        return res.status(400).json({
            status: 400,
            error: validation.errors.errors
        })
    }
    name = name.trim();

    try {
        const mattertype  = await model.MatterType.findOne({ 
            where: { 
                name: {
                      [Op.iLike]: `%${name}%`
              } 
         } 
    });
       
        if(mattertype === null || mattertype === undefined){
            req.body.name = name;
            return next();
        } else {
            return res.status(409).json({
                status: 409,
                error: 'Seems like you have created an matter type with similar name before'
            });
        }
        
    } catch(error){
        return res.status(500).json({
            status: 500,
            error: error.message
        });
    }
 },
}


