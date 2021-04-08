const fs = require('fs');
const path = require('path');
const playwright = require("playwright");

const { scrape } = require('./scrape');

const semester_to_scrape = "W21";

(async () => {
    let result = {
        courses: []
    };
    let searchList = getSearches();

    let totalCourses = searchList.length;

    console.log(`Total searches: ${totalCourses}`);

    const browser = await playwright.chromium.launch({
        headless: true,
    });
    const page = await browser.newPage();

    for (let i = 0; i < searchList.length; i += 5) {
        console.log(`${i} / ${totalCourses}`);

        let current_searches = [];

        for (let j = i; j < searchList.length && j < i + 5; j++) {
            current_searches.push(searchList[j]);
        }

        let scraperResultCourses = await scrape(page,
            {
                semester: semester_to_scrape,
                search: current_searches
            }
        );

        result['courses'].push(...scraperResultCourses);
    }

    await browser.close();

    let outputPath = path.join(__dirname, 'scraper.json');
    console.log(`Writing ${outputPath}`);

    fs.writeFileSync('scraper.json', JSON.stringify(result, null, 2));
})();

function getType(course_code) {
    let pieces = course_code.split("*");
    let type = pieces[0];

    return {
        type: type,
    };
}

function getSearches() {
    let parserJsonPath = path.join(__dirname, "courses.json");
    const content = JSON.parse(fs.readFileSync(parserJsonPath));
    let searches = [];
    let len = content.courses.length;
    
    for (let i = 0; i < len; i++) {
        let search = {};
        search = getType(content.courses[i].code);

        // Check if course type is already added to the array
        if (!searches.some(item => item.type === search.type)) {
            searches.push(search);
        }
    }

    return searches;
}
