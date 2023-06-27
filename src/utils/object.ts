export const compareObjects = <T extends Object>(obj1: T, obj2: T): number => {
  let count = 0;
  for (let prop in obj1) {
    if (obj1.hasOwnProperty(prop)) {
      if (obj1[prop] !== obj2[prop]) {
        count++;
      }
    }
  }
  return count;
};
