import model from '../database/models';

/** get client by Id on 
   * the application
*/
  export const getClientById = async (id) => {
    try {
        const Client = model.Client.findOne({ where: { id }  });
        return Client;
      } catch (error) {
        throw error;
      }
  }