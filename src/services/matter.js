import model from '../database/models';

/** get single matter on 
   * the application
   */
  export const getMatter = async (id) => {
    try {
        const Matter = model.Matter.findOne({ where: { id }, include: [{
        model: model.MatterResource,
        as: 'matterresources'
      }] });
        return Matter;
      } catch (error) {
        throw error;
      }
  }


  export const getAllMatterResources = async (matterId) => {
    try{
       const resources = await model.MatterResource.findAll({
           where: {
               matterId
             }
       }).map(el => el.get({ raw: true }));
        return resources
    } catch(err){
        throw err;
    }
}


export const getMatterUpdates = async (matterId) => {
  try{
     const updates = await model.Update.findAll({
         where: {
             matterId
           }
     }).map(el => el.get({ raw: true }));
      return updates
  } catch(err){
      throw err;
  }
}

export const createMatterResource = async (obj) => {
  try {
    return await model.MatterResource.create(obj);
  } catch(err) {
    throw err;
  }
}