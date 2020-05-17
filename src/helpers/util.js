  /**
   * This function joins two arrays
   * and then filters out duplicates
   */
  export function mergeUnique(arr1, arr2){
        return arr1.concat(arr2.filter(function (item) {
            return arr1.indexOf(item) === -1;
        }));
    }

/**
 * This function converts string id params
 * to a number before use
 */
export const convertParamToNumber = id => Number(id);

export const log = (val) => console.log({val});