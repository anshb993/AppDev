let myArray = [1, 2, 3, 4];
myArray.pop(); // Removes the last element
myArray.shift(); // Removes the first element
myArray.splice(1, 1); // Removes 1 element starting from index 1
console.log(myArray); // Output: [3] (after all operations)

let newArray = myArray.filter(item => item !== 2); // Creates a new array excluding elements equal to 2
console.log(newArray); // Output: [1, 3, 4]