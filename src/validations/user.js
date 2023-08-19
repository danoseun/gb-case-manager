import Validator from 'validatorjs';
import { findUserByEmail } from '../services/user'
import { comparePassword, generatePassword } from '../helpers/password';

/**
 * Validates user properties during creation
 */
export const userValidator = {
   async addUserValidator(req, res, next){
    let { firstname, lastname, email, password, branch } = req.body;

    const rules = {
        firstname: 'required|min:2',
        lastname: 'required|min:2',
        email: 'required|email|min:2',
        branch: 'required'
    };

    const validation = new Validator(req.body, rules);

    if (validation.fails()){
        return res.status(400).json({
            status: 400,
            error: validation.errors.errors
        })
    }

    try {
        const result  = await findUserByEmail(email);
       
        if(result === null || result === undefined){
            
            password = generatePassword();

            firstname = firstname.trim();
            lastname = lastname.trim();
            req.body.firstname = firstname;
            req.body.lastname = lastname;
            req.body.fullname = `${firstname} ${lastname}`
            req.body.email = email.trim();
            req.body.password = password.trim();
            req.body.branch = branch.trim();
            return next();
        }
        
        if(result.dataValues.email === email){
            return res.status(409).json({
                status: 409,
                error: 'Email already exists'
            })
        } 
    } catch(error){
        return res.status(500).json({
            status: 500,
            error: error.message
        });
    }
},

async loginUserValidator(req, res, next){
    
    const { email, password } = req.body;
    const rules = {
        email: 'required|email|min:2',
        password: 'required'
    };
    const validation = new Validator(req.body, rules);
    if (validation.fails()){
        return res.status(400).json({
            status: 400,
            error: validation.errors.errors
        })
    }

    let data;
    try {
        const result  = await findUserByEmail(email);
        if(result === undefined || result === null){
            return res.status(404).json({
                status: 404,
                error: 'Unknown email, please check email and try again'
            })
        }
        const compare = comparePassword(password, result.dataValues.password);
        if(!compare){
            return res.status(401).json({
                status: 401,
                error: 'Authentication failed'
            });
        }
        
        data = result.dataValues;
    } catch(error){
        return res.status(500).json({
            status: 500,
            error: error.message
        });
    }
    req.body = data;
    return next();
  }
}