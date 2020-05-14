// import {
//     config,
//     uploader
//   } from 'cloudinary';
//   import dotenv from 'dotenv';
  
//   dotenv.config();
  
//   const cloudinaryConfig = (req, res, next) => {
//     config({
//         cloud_name: process.env.CLOUD_NAME,
//         api_key: process.env.API_KEY,
//         api_secret: process.env.API_SECRET
//     });
//     next();
//   };
//   export {
//     cloudinaryConfig,
//     uploader
//   };
import dotenv from 'dotenv';
let cloudinary = require('cloudinary').v2;
dotenv.config();

export default cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

 







