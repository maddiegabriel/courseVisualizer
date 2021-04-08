const fs = require('fs')
const { scrape } = require('./scrape');
(async () => {

    let scraperListFall = []
    let scraperListWinter = []
    let scraperJSON = {
        courses: []
    }
    let searchList = getSearches()
    let current_searches = []

    for (let i = 1; i <= searchList.length; i++) {
        console.log(i);
        current_searches = []
        while ((searchList[i - 1])) {
            console.log(i);
            current_searches.push(searchList[i - 1])

            if (i % 5 == 0) break;
            console.log("inc");
            i++;
        }
        console.log("Start scrapping");
        scraperListFall = await scrape({
            semester: "F20",
            search: current_searches
        })
        console.log("scrapping w commence");
        scraperListWinter = await scrape({
            semester: "W21",
            search: current_searches
        })
        console.log("done scraper");

        for (let i = 0; i < scraperListFall.length; i++) {
            scraperJSON.courses.push(scraperListFall[i]);
        }
        console.log("add to w list");
        for (let i = 0; i < scraperListWinter.length; i++) {
            scraperJSON.courses.push(scraperListWinter[i]);
        }
        console.log("end loop");
    }

    // Serializing JSON data in order to get rid of the form of one line of string
    let dataStr = JSON.stringify(scraperJSON, null, 2);
    fs.writeFileSync('../scraper.json', dataStr);

    // console.log(scraperListFall);
})();



function getType(course_code) {

    let pieces = course_code.split("*")
    let type = pieces[0]
    return {
        type: type,
    }
}

function getSearches() {

    const content = JSON.parse(fs.readFileSync("../parser.json"))
    let searches = []
    let len = content.courses.length
    // console.log("length of courses:" + len)
    for (let i = 0; i < len; i++) {

        let search = {}
        search = getType(content.courses[i].code)

        // Check if course type is already added to the array
        if (!searches.some(item => item.type === search.type)) {
            searches.push(search)
        }

    }
    console.log("length of searhes: " + searches.length) //83
    console.log(searches)

    return searches
}




