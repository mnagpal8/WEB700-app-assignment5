/*
********************************************************************************
*  WEB700 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Mukul Nagpal            Student ID: 147813232                Date: 28th May, 2024
*
*******************************************************************************
*/

const fs = require('fs');

class Data { // define a class named data
  constructor(students, courses) {//constructor function to initialize the class instance and initialized the students and courses properties with the provided data in the file
      this.students = students; // Assign the students parameter to the students property
      this.courses = courses;// Assign the courses parameter to the courses property
  }
}

let dataCollection = null; // initialize the dataCollection variable as null

exports.initialize = () => { // Define an arrow function named initialize and export it
  return new Promise((resolve, reject) => { // Return a new Promise
      const fs = require('fs'); // Importing  the built-in fs module for file operations

      fs.readFile('./data/students.json', 'utf8', (err, studentsData) => { // Reading the students.json file
        if (err) { // If there is an error reading the file then rejecting it
            
            reject("Unable to read students.json"); // Reject the Promise with an error message
            return; // Exit the function
        }

        fs.readFile('./data/courses.json', 'utf8', (err, coursesData) => { //Reading the courses.json file
            if (err) { // If there's an error reading the file then rejecting it
               
                reject("Unable to read courses.json"); //Rejecting the Promise with an error message
                return; //Exit the function
            }

            //Parse the JSON data from the files
            const students = JSON.parse(studentsData); //Parse the studentsData JSON string into a javaScript object
            const courses = JSON.parse(coursesData); //Parse the coursesData JSON string into a javaScript object

            dataCollection = new Data(students, courses); //Creating a new data instance with the parsed students and courses data
            resolve(); // Resolve the promise if both files are read successfully
        });
    });
});
};

exports.getAllStudents = () => { //defining an arrow function named getAllStudents and export it
return new Promise((resolve, reject) => { //return a new promise
    if (dataCollection.students.length === 0) { //If there are no students then rejecting it
        
        reject("No results returned"); //reject the promise with an error message
    } else {
        resolve(dataCollection.students); //Resolve the promise with the students data
    }
});
};

exports.getTAs = () => { //Define an arrow function named getTAs and export it
return new Promise((resolve, reject) => { //return a new promise
    const tas = dataCollection.students.filter(student => student.TA); //filter the students array to get only the students where TA is true
    if (tas.length === 0) { //If there are no TAs then rejecting it
        reject("No results returned"); //reject the romise with an error message
    } else {
        resolve(tas); //resolve the promise with the tas array
    }
});
};

exports.getCourses = () => { //Define an arrow function named getCourses and export it
return new Promise((resolve, reject) => { //return a new promise
    if (dataCollection.courses.length === 0) { //If there are no courses then rejecting it
        reject("No results returned"); //reject the promise with an error message
    } else {
        resolve(dataCollection.courses); // resolve the Promise with the courses data
    }
});
};

exports.getStudentsByCourse = (course) => {
    return new Promise((resolve, reject) => {
      const studentsByCourse = dataCollection.students.filter(student => student.course === course);
      if (studentsByCourse.length === 0) {
        reject("No results returned");
      } else {
        resolve(studentsByCourse);
      }
    });
  };
  
  exports.getStudentByNum = (num) => {
    return new Promise((resolve, reject) => {
      const student = dataCollection.students.find(student => student.studentNum === num);
      if (!student) {
        reject("No results returned");
      } else {
        resolve(student);
      }
    });
  };

  
  exports.addStudent = (studentData) => {
    return new Promise((resolve, reject) => {
        // Ensure TA property is set to false if undefined
        if (studentData.TA === undefined) {
            studentData.TA = false;
        } else {
            studentData.TA = true;
        }

        // Set studentNum property based on current array length + 1
        studentData.studentNum = dataCollection.students.length + 1;

        // Push new studentData to the students array
        dataCollection.students.push(studentData);

        fs.writeFile('./data/students.json', JSON.stringify(dataCollection.students, null, 2), (err) => {
          if (err) {
              reject("Error saving student data");
              return;
          }
          resolve(studentData);
      });

        // Resolve the promise to indicate success
        resolve(studentData); // Resolve with the added student data
    });
}