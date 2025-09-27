let myArray = [1, 2, 3];
myArray[1] = 5; // Updates element at index 1 to 5
console.log(myArray);

let newArray = myArray.map((item, index) => (index === 1 ? 5 : item)); // Creates a new array with the updated element
console.log(newArray);