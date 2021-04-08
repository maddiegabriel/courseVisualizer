function validateAndFormatSearch(search) {
    if ('subject' in search) {
        search['subject'] = search['subject'].toLowerCase();
    }

    if ('code' in search) {
        search['code'] = search['code'].toLowerCase();
    }

    if ('title' in search) {
        search['title'] = search['title'].toLowerCase();
    }

    if ('semester' in search) {
        search['semester'] = search['semester'].toLowerCase();
    }

    if ('weight' in search) {
        if (!/^\d[.]\d\d$/.test(search['weight'])) {
            console.log(`Bad search['weight'] (${search['weight']})`);
            search['weight'] = '';
        }
    }

    if ('department' in search) {
        search['department'] = search['department'].toLowerCase();
    }
}

function filterCourses(courses, sections, search) {
    validateAndFormatSearch(search);

    // the function will start with this array and iteratively reduce it until it contains
    // only the matching courses. the `result` array is an array that takes the form
    // [
    //    [ 'ACCT*1220', 'ACCT*1220*0101' ],
    //    [ 'ACCT*1220', 'ACCT*1220*0102' ],
    //    ...
    // ]
    // each element `E` in `result` contains a key for `courses` as `E[0]` and a key for
    // `sections` as `E[1]`
    let result = Object.values(sections).map(s => {
        return [
            `${s['code']['type']}*${s['code']['number']}`,
            `${s['code']['type']}*${s['code']['number']}*${s['code']['section']}`
        ]
    });

    // filter out non-exact-matching subjects (the 'ACCT' part of ACCT*1220*001)
    if ('subject' in search && search['subject'] !== '') {
        result = result.filter(r => r[0].split('*')[0].toLowerCase() === search['subject']);
    }

    // filter out non-exact-matching codes (the '1220' part of ACCT*1220*001)
    if ('code' in search && search['code'] !== '') {
        result = result.filter(r => r[0].split('*')[1].toLowerCase() === search['code']);
    }

    // filter out course titles that do not include all the title search keywords
    if ('title' in search && search['title'] !== '') {
        let titleSearchTokens = search['title'].split(/\s/);
        for (let searchToken of titleSearchTokens) {
            result = result.filter(r => {
                // some course codes that exist in scraper.json may not exist in courses.json
                // and for this reason may be undefined when we look them up here
                let course = courses[r[0]];
                if (course) {
                    return course['title'].toLowerCase().split(/\s/).includes(searchToken);
                } else {
                    return false;
                }
            });
        }
    }

    // filter out course semester that do not include all the semester search keywords
    if ('semester' in search && search['semester'] !== '') {
        let semesterSearchTokens = search['semester'].split(/\s/);
        for (let searchToken of semesterSearchTokens) {
            result = result.filter(r => {
                let section = sections[r[1]];
                return section['term'].toLowerCase().split(/\s/).includes(searchToken);
            });
        }
    }

    // filter out non-exact-matching weight ('0.75' or '0.50' etc.)
    if ('weight' in search && search['weight'] !== '') {
        result = result.filter(r => {
            let course = courses[r[0]];
            if (course) {
                return course['credit'] === search['weight'];
            } else {
                return false;
            }
        });
    }

    // filter out course department that do not include all the department search keywords
    if ('department' in search && search['department'] !== '') {
        let departmentSearchTokens = search['department'].split(/\s/);
        for (let searchToken of departmentSearchTokens) {
            result = result.filter(r => {
                let course = courses[r[0]];
                if (course) {
                    return course['departments'].toLowerCase().split(/\s/).includes(searchToken);
                } else {
                    return false;
                }
            });
        }
    }

    // all the sections from the result
    let sections_result = result.map(r => r[1]);
    // all the *unique* courses from the result (list -> set -> list)
    let courses_result = [...new Set(result.map(r => r[0]))];

    let sections_data_result_array = sections_result.map(s => { return {"k": s, "v": sections[s]}});
    let courses_data_result_array = courses_result.map(s =>{ return {"k": s, "v": courses[s]}});

    let sections_data_result = {};
    let courses_data_result = {};
    for (let i of sections_data_result_array) {
        if (i.v) {
            sections_data_result[i.k] = i.v;
        }
    }
    for (let i of courses_data_result_array) {
        if (i.v) {
            courses_data_result[i.k] = i.v;
        }
    }

    return {
        "sections_list": sections_result,
        "courses_list": courses_result,
        "sections": sections_data_result,
        "courses": courses_data_result
    };
}

function courseTree(code, courses) {
    let course = courses[code];

    if (!course || !course["prerequisites_mentions"] || course["prerequisites_mentions"].length == 0) {
        return {
            "id": code
        };
    }

    return {
        "id": code,
        "children": courses[code]["prerequisites_mentions"].map(c => {
            return courseTree(c, courses);
        })
    };
}

module.exports = {
    courseTree: courseTree,
    filterCourses: filterCourses,
    validateAndFormatSearch: validateAndFormatSearch
}