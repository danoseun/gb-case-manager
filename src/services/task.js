import model from '../database/models';

  /** get task by Id on 
   * the application
   */
  export const getTaskById = async (id) => {
    try {
        const Task = model.Task.findOne({ where: { id }  });
        return Task;
      } catch (error) {
        throw error;
      }
  }
