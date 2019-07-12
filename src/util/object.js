import { compareElements } from './array.js';

// loop through new array of objects. for each object, find object in old
// array that matches all compare keys, and transfer specified keys from
// old object to new
export function transferObjectProps(
  oldArray,
  newArray,
  compareKeys,
  transferKeys
) {
  for (const newElement of newArray) {
    for (const oldElement of oldArray) {
      let matches = true;
      for (const compareKey of compareKeys) {
        if (oldElement[compareKey] !== newElement[compareKey]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        for (const transferKey of transferKeys)
          newElement[transferKey] = oldElement[transferKey];
      }
    }
  }

  return newArray;
}

// same as transferObjectProps, except arrays are now assumed to contain
// objects with subKey that contains another array that contains the objects
// to be transferred
export function transferQueryProps(
  oldQueries,
  newQueries,
  subKey,
  compareKeys,
  transferKeys
) {
  for (const newQuery of newQueries) {
    for (const newElement of newQuery[subKey]) {
      for (const oldQuery of oldQueries) {
        for (const oldElement of oldQuery[subKey]) {
          let matches = true;
          for (const compareKey of compareKeys) {
            if (
              !compareElements(oldElement[compareKey], newElement[compareKey])
            ) {
              matches = false;
              break;
            }
          }
          if (matches) {
            for (const transferKey of transferKeys)
              newElement[transferKey] = oldElement[transferKey];
          }
        }
      }
    }
  }

  return newQueries;
}

// make deep copy of object. ensures everything is clone/copy, not reference.
// works for everything except circular refs, functions, and js Dates
export function copyObject(object) {
  if (typeof object === 'object')
    return JSON.parse(JSON.stringify(object));
  else
    return object;
}

// compare objects with stringify
// works for everything except circular refs, functions, and js Dates
export function compareObjects(object1, object2) {
  return JSON.stringify(object1) === JSON.stringify(object2);
}
