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

/**
 * Function takes in two arrays
 * and returns the asymmetric difference between them
 * Assymetric in the sense that it compares the arrays
 * and returns element(s) in arr1 not present arr2.
 * order of arrays is important
 * [1,2,3], [1,2]
 * https://i.stack.imgur.com/mEtro.png
 */
export const arrayDifference = (arr1, arr2) => {
    let difference = arr1.filter(x => !arr2.includes(x));
    return difference;
}

/**
 * removes integer from array
 */
export const removeIntegerFromArray = (arr, num) => {
    const result = arr.filter(val => val !== num)
    return result;
}

export const log = (val) => console.log({val});