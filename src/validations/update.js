import Validator from 'validatorjs';
import sequelize from 'sequelize';
import model from '../database/models';


/**
 * Validates matter properties during creation
 */
export const updateValidator = {
   async addUpdateValidator(req, res, next){
    let { title } = req.body;

    const rules = {
        title: 'required'
    };

    const validation = new Validator(req.body, rules);

    if (validation.fails()){
        return res.status(400).json({
            status: 400,
            error: validation.errors.errors
        })
    }
    title = title.trim();

    try {
        const update  = await model.Update.findOne({ where: { title } });
       
        if(update === null || update === undefined){
            req.body.title = title;
            return next();
        } else {
            return res.status(400).json({
                status: 400,
                error: 'Seems like you have created an update with similar title before'
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


