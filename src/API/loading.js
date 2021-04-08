const fs = require('fs');

function load_courses_with_path(courses_path) {
    let courses_file_data = fs.readFileSync(courses_path);
    let courses_file_obj = JSON.parse(courses_file_data);
    let courses = courses_file_obj['courses'];
    return load_courses(courses);
}

function load_courses(courses) {
    let loaded = {};
    for (course of courses) {
        loaded[course['code']] = course;
    }
    return loaded;
}

function load_sections_with_path(sections_path) {
    let sections_file_data = fs.readFileSync(sections_path);
    let sections_file_obj = JSON.parse(sections_file_data);
    let sections = sections_file_obj['courses'];
    return load_sections(sections);
}

function load_sections(sections) {
    let loaded = {};
    for (section of sections) {
        let code = `${section['code']['type']}*${section['code']['number']}*${section['code']['section']}`;
        loaded[code] = section;
    }
    return loaded;
}

module.exports = {
    load_courses_with_path: load_courses_with_path,
    load_courses: load_courses,
    load_sections_with_path: load_sections_with_path,
    load_sections: load_sections
};