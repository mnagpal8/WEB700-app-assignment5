/*
********************************************************************************
*  WEB700 – Assignment 4
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Mukul Nagpal            Student ID: 147813232                Date: 6th July, 2024
*
* Online Vercel (Link): https://web-700-app-assignment4.vercel.app/
*
*******************************************************************************
*/
const express = require('express');
const collegeData = require('./modules/collegeData');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Configure express-handlebars with custom helpers
const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        navLink: function(url, options) {
            return '<li' + 
                ((url === app.locals.activeRoute) ? ' class="nav-item active"' : ' class="nav-item"') + 
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function(lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            return (lvalue !== rvalue) ? options.inverse(this) : options.fn(this);
        }
    }
});

// Set up Handlebars as the view engine
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to set the active route for navigation
app.use((req, res, next) => {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.)/, "") : route.replace(/\/(.)/, ""));
    next();
});

// Define routes
app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

app.get('/htmlDemo', (req, res) => {
    res.render('htmlDemo', { title: 'HTML Demo' });
});

app.get('/student/:num', (req, res) => {
    const studentNum = parseInt(req.params.num);
    console.log("Fetching student with studentNum:", studentNum);

    Promise.all([collegeData.getStudentByNum(studentNum), collegeData.getCourses()])
        .then(([student, courses]) => {
            console.log("Student data and courses fetched successfully");
            res.render('student', { student: student, courses: courses });
        })
        .catch(err => {
            console.error("Error fetching student or courses:", err);
            res.status(404).json({ message: "no results" });
        });
});

app.post('/student/update', (req, res) => {
    const studentData = req.body;
    collegeData.updateStudent(studentData)
        .then(() => res.redirect('/students'))
        .catch(err => {
            console.error('Error updating student:', err);
            res.status(500).send('Error updating student');
        });
});

app.get('/students', (req, res) => {
    const course = req.query.course;
    if (course) {
        collegeData.getStudentsByCourse(parseInt(course))
            .then(students => {
                res.render('students', { students: students });
            })
            .catch(err => {
                res.render('students', { message: "no results" });
            });
    } else {
        collegeData.getAllStudents()
            .then(students => {
                res.render('students', { students: students });
            })
            .catch(err => {
                res.render('students', { message: "no results" });
            });
    }
});

app.get('/courses', (req, res) => {
    collegeData.getCourses()
        .then(courses => {
            res.render('courses', { courses: courses });
        })
        .catch(err => {
            res.render('courses', { message: "no results" });
        });
});

app.get('/students/add', (req, res) => {
    res.render('addStudent', { title: 'Add Student' });
});

app.post('/students/add', (req, res) => {

    collegeData.addStudent(studentData)
        .then(() => {
            res.redirect('/students');
        })
        .catch(err => {
            console.error('Error adding student:', err);
            res.status(500).send('Error adding student');
        });
});

// 404 route
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// Initialize data and start server
collegeData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server listening on port: ${HTTP_PORT}`);
        });
    })
    .catch(err => {
        console.log(`Failed to initialize data: ${err}`);
    });