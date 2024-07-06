/*
********************************************************************************
*  WEB700 – Assignment 4
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Mukul Nagpal            Student ID: 147813232                Date: 6th July, 2024
*
*******************************************************************************
*/

const express = require('express');
const collegeData = require('./modules/collegeData');
const path = require('path');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const bodyParser = require('body-parser');
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

// Route for the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// Route for the about page
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// Route for the htmlDemo page
app.get('/htmlDemo', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'htmlDemo.html'));
});

// Route for fetching a student by their student number
app.get('/student/:num', (req, res) => {
    const studentNum = parseInt(req.params.num);
    collegeData.getStudentByNum(studentNum)
        .then(student => {
            res.json(student);
        })
        .catch(err => {
            res.status(404).json({ message: "no results" });
        });
});

// Route for fetching all students, with an optional course query parameter
app.get('/students', (req, res) => {
    const course = req.query.course;
    if (course) {
        collegeData.getStudentsByCourse(parseInt(course))
            .then(students => {
                res.json(students);
            })
            .catch(err => {
                res.status(404).json({ message: "no results" });
            });
    } else {
        collegeData.getAllStudents()
            .then(students => {
                res.json(students);
            })
            .catch(err => {
                res.status(404).json({ message: "no results" });
            });
    }
});

// Route for fetching all TAs
app.get('/tas', (req, res) => {
    collegeData.getTAs()
        .then(tas => {
            res.json(tas);
        })
        .catch(err => {
            res.status(404).json({ message: "no results" });
        });
});

// Route for fetching all courses
app.get('/courses', (req, res) => {
    collegeData.getCourses()
        .then(courses => {
            res.json(courses);
        })
        .catch(err => {
            res.status(404).json({ message: "no results" });
        });
});

app.get("/students/add", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "addStudent.html"));
});
app.post('/students/add', (req, res) => {
    collegeData.addStudent(req.body)
        .then(() => {
            res.redirect('/students'); // Redirect to the students page after adding student
        })
        .catch(err => {
            console.error('Error adding student:', err);
            // Handle error appropriately, e.g., render an error page or redirect to an error route
            res.status(500).send('Error adding student');
        });
});

// Custom 404 page for unmatched routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// Start the server only if data initialization is successful
collegeData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server listening on port ${HTTP_PORT}`);
        });
    })
    .catch(err => {
        console.error(`Failed to initialize data: ${err}`);
    });
