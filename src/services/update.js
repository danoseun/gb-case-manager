import model from '../database/models';

/** get update by Id on 
   * the application
   */
  export const getUpdateById = async (id) => {
    try {
        const Update = model.Update.findOne({ where: { id }  });
        return Update;
      } catch (error) {
        throw error;
      }
  }
