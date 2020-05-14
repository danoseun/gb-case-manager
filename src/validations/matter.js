import Validator from 'validatorjs';
import sequelize from 'sequelize';
import model from '../database/models';


/**
 * Validates matter properties during creation
 */
export const matterValidator = {
   async addMatterValidator(req, res, next){
    let { title, code } = req.body;

    const rules = {
        title: 'required',
        code: 'required'
    };

    const validation = new Validator(req.body, rules);

    if (validation.fails()){
        return res.status(400).json({
            status: 400,
            error: validation.errors.errors
        })
    }
    title = title.trim();
    code = code.trim();

    try {
        const matter  = await model.Matter.findOne({ where: {
            [sequelize.Op.or]: [
              { title },
              { code }
            ]
          }});
       
        if(matter === null || matter === undefined){
            req.body.title = title;
            req.body.code = code;
            return next();
        } else {
            return res.status(400).json({
                status: 400,
                error: 'Seems like you have created a matter with same title or code before'
            });
        }
        
    } catch(error){
        return res.status(500).json({
            status: 500,
            error: error.message
        });
    }
 }
}


