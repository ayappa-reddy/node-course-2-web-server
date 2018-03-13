const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
let app = express();

// Node uses a wrapper function to wrap the whole module code.
// __dirname is a parameter in the wrapper function.
// middleware (instead of using app.get())
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');// this line automatically finds the views folder

// app.use() registers a middleware.
app.use((req, res, next) => {
    let now = new Date().toString();
    let log = `${now}: ${req.method} ${req.url}`;
    console.log(log);

    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });
    // next() moves to the next middleware(ap.use() if any or to the other code below).
    // omitting next() will run nothing after it.
    next();
});

// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
//     // next() is omitted, so only maintenance.hbs is displayed
//     // and all other template handlers defined below are never executed.
// });

app.use(express.static(__dirname + '/public'));


hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {
    // res.send('<h1>Hello Express!</h1>');
    // res.send({
    //     name: 'Andrew',
    //     likes: [
    //         'Tennis',
    //         'Music'
    //     ]
    // });
    // finds home.hbs in the views folder with app.set();
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: "Welcome to my website"
    });
});

app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'Projects page'
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to handle request'
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});