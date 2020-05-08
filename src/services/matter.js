import model from '../database/models';

/** get single matter on 
   * the application
   */
  export const getMatter = async (id) => {
    try {
        const Matter = model.Matter.findOne({ where: { id } });
        return Matter;
      } catch (error) {
        throw error;
      }
  }