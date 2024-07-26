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

class Data { 
  constructor(students, courses) {
      this.students = students;
      this.courses = courses;
  }
}

let dataCollection = null; 

exports.initialize = () => {
  return new Promise((resolve, reject) => {
      fs.readFile('./data/students.json', 'utf8', (err, studentsData) => {
        if (err) {
            reject("Unable to read students.json");
            return;
        }

        fs.readFile('./data/courses.json', 'utf8', (err, coursesData) => {
            if (err) {
                reject("Unable to read courses.json");
                return;
            }

            const students = JSON.parse(studentsData);
            const courses = JSON.parse(coursesData);

            dataCollection = new Data(students, courses);
            resolve();
        });
    });
});
};

exports.getAllStudents = () => {
    return new Promise((resolve, reject) => {
        if (dataCollection.students.length === 0) {
            reject("No results returned");
        } else {
            resolve(dataCollection.students);
        }
    });
};

exports.getTAs = () => {
    return new Promise((resolve, reject) => {
        const tas = dataCollection.students.filter(student => student.TA);
        if (tas.length === 0) {
            reject("No results returned");
        } else {
            resolve(tas);
        }
    });
};

exports.getCourses = () => {
    return new Promise((resolve, reject) => {
        if (dataCollection.courses.length === 0) {
            reject("No results returned");
        } else {
            resolve(dataCollection.courses);
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

exports.getCourseById = (id) => {
    return new Promise((resolve, reject) => {
      const course = dataCollection.courses.find(course => course.courseId === parseInt(id));
      if (!course) {
        reject("query returned 0 results");
      } else {
        resolve(course);
      }
    });
};

// Add student
exports.addStudent = (studentData) => {
    return new Promise((resolve, reject) => {
        if (studentData.TA === undefined) {
            studentData.TA = false;
        } else {
            studentData.TA = true;
        }

        studentData.studentNum = dataCollection.students.length + 1;

        dataCollection.students.push(studentData);

        fs.writeFile('./data/students.json', JSON.stringify(dataCollection.students, null, 2), (err) => {
          if (err) {
              reject("Error saving student data");
              return;
          }
          resolve(studentData);
      });
    });
};

// Update student
exports.updateStudent = (studentData) => {
    return new Promise((resolve, reject) => {
        // Find the index of the student to update
        const index = dataCollection.students.findIndex(student => student.studentNum === parseInt(studentData.studentNum));
        
        if (index === -1) {
            reject("Student not found");
            return;
        }

        // Update student details
        dataCollection.students[index] = {
            ...dataCollection.students[index], 
            ...studentData,
            TA: studentData.TA === 'on' ? true : false // Convert checkbox value
        };
        resolve();
        // Save updated student data
        fs.writeFile('./data/students.json', JSON.stringify(dataCollection.students, null, 2), (err) => {
            if (err) {
                reject("Error updating student data");
                return;
            }
            resolve(); // Resolve without data
        });
    });
};

