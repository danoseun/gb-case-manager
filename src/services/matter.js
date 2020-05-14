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