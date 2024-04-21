/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
function addUniqueItem<T>(arr: T[], item: T) {
    arr.indexOf(item) === -1 && arr.push(item);
}
function removeItem<T>(arr: T[], item: T) {
    var index = arr.indexOf(item);
    index > -1 && arr.splice(index, 1);
}

export { addUniqueItem, removeItem };
