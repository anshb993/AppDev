let arr = ["cats", "dogs", "birds", "elephants"];
// Create
arr.push("ansh");
arr.unshift("jojo"); //adds jojo at beginning
arr.splice(2, 0, 5); //inserts 5 at index 2
console.log(arr);

//or create a another array with the added element
let array = [1,4,5,9,2];
let newarray = array.concat([77]);
console.log(newarray);

