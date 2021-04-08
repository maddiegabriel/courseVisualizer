#!/bin/bash

cd /home/sysadmin/w21cis4250team6/src/scraper/
node --unhandled-rejections=strict scrape_all_courses.js
cp scraper.json /home/sysadmin/w21cis4250team6/src/API/data/scraper.json


