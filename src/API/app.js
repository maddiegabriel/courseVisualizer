const express = require('express');
const app = express();

require('dotenv').config();

const path = require('path');
const loading = require('./loading');
const {courseTree, filterCourses} = require('./util');

const port = 443;

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


app.post('/search', (req, res) => {
    let courses_path = path.join(__dirname, '/data/courses.json');
    let sections_path = path.join(__dirname, '/data/scraper.json');
    let courses = loading.load_courses_with_path(courses_path);
    let sections = loading.load_sections_with_path(sections_path);

    let search = req.body['search'];

    console.log(`search: ${JSON.stringify(search)}`);

    if (typeof search === "string" || search instanceof String) {
        search = JSON.parse(search);
    }
    let result = filterCourses(courses, sections, search);
    res.send(JSON.stringify(result));
})


app.get('/tree/:coursecode', (req, res) => {
    let courses_path = path.join(__dirname, '/data/courses.json');
    let courses = loading.load_courses_with_path(courses_path);

    let root_code = req.params.coursecode;

    console.log(`tree: ${root_code}`);

    if (!courses[root_code]) {
        console.log(`Received illegal course code to /tree (${root_code})`)
        res.send('{}');
        return;
    }

    let tree = courseTree(root_code, courses);
    //console.log(tree);
    res.send(JSON.stringify(tree));
});

app.get('/key', (req, res) => {
    res.send(process.env.COGNITIVE_SERVICE_KEY);
});

app.listen(port, () => {
    console.log(`Listening on localhost at port ${port}`);
})

