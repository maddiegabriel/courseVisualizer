const playwright = require("playwright");
const fs = require("fs");
const { equal } = require("assert");
const { exit } = require("process");

Object.prototype.pretty = function () {
  return `${this.type}*${this.number}*${this.section}`;
};

const course_form = [
  {
    type: "#LIST_VAR1_1",
    number: "#LIST_VAR3_1",
    section: "#LIST_VAR4_1",
  },
  {
    type: "#LIST_VAR1_2",
    number: "#LIST_VAR3_2",
    section: "#LIST_VAR4_2",
  },
  {
    type: "#LIST_VAR1_3",
    number: "#LIST_VAR3_3",
    section: "#LIST_VAR4_3",
  },
  {
    type: "#LIST_VAR1_4",
    number: "#LIST_VAR3_4",
    section: "#LIST_VAR4_4",
  },
  {
    type: "#LIST_VAR1_5",
    number: "#LIST_VAR3_5",
    section: "#LIST_VAR4_5",
  },
];


function parseShortTitle(short_title) {
  let words = short_title.split(" ");
  let pieces = words[0].split("*");
  let type = pieces[0];
  let number = pieces[1];
  let section = pieces[2];
  return {
    type: type,
    number: number,
    section: section,
  };
}

function equalCourses(course1, course2) {
  return (
    course1.type === course2.type &&
    course1.number === course2.number &&
    course1.section === course2.section
  );
}

async function fillCourse(page, form_element, type, section) {
  await page.selectOption(form_element.type, type);
  // await page.fill(form_element.number, number);
  await page.fill(form_element.section, section);
}

async function scrape( page, config) {

  await page.goto("https://webadvisor.uoguelph.ca/");
  await page.waitForSelector("#sidebar > div > div.subnav > ul > li:nth-child(2) > a");
  (await page.$("#sidebar > div > div.subnav > ul > li:nth-child(2) > a")).click();
  await page.waitForSelector("#sidebar > div > ul:nth-child(2) > li > a");
  (await page.$("#sidebar > div > ul:nth-child(2) > li > a")).click();

  await page.selectOption("#VAR1", config.semester);

  for (var i = 0; i < config.search.length; i++) {
    await fillCourse(
      page,
      course_form[i],
      config.search[i].type,
      // config.search[i].number,
      ""
    );
  }

  await page.waitForSelector("#content > div.screen.WESTS12A > form > div > input");
  (await page.$("#content > div.screen.WESTS12A > form > div > input")).click();
  
  let rows = [];

  await page.waitForSelector("#GROUP_Grp_WSS_COURSE_SECTIONS > table > tbody > tr");
  while (rows.length == 0) {
    rows = await page.$$("#GROUP_Grp_WSS_COURSE_SECTIONS > table > tbody > tr");
  }

  let courses = [];

  for (var i = 2; i < rows.length; i++) {
    let course = {};

    course.status = await (await rows[i].$(".LIST_VAR1")).innerText();
    course.title = await (await rows[i].$(".SEC_SHORT_TITLE")).innerText();
    course.term = await (await rows[i].$(".WSS_COURSE_SECTIONS")).innerText();
    course.location = await (await rows[i].$(".SEC_LOCATION")).innerText();
    course.meeting_info = await (await rows[i].$(".SEC_MEETING_INFO")).innerText();
    course.faculty = await (await rows[i].$(".SEC_FACULTY_INFO")).innerText();
    course.credits = await (await rows[i].$(".SEC_MIN_CRED")).innerText();
    course.academic_level = await (await rows[i].$(".SEC_ACAD_LEVEL")).innerText();

    available_and_capacity = await (await rows[i].$(".LIST_VAR5")).innerText();
    let pieces = available_and_capacity.split(" / ");
    course.available = pieces[0];
    course.capacity = pieces[1];

    course.code = parseShortTitle(course.title);

    courses.push(course);
  }

  // console.log(courses);

 

  //fs.writeFileSync("./output.json", JSON.stringify(out_object, null, 4));

  return courses;
}

module.exports = {
  scrape: scrape
}