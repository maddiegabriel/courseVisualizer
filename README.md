# CIS*4250 Team 6 Sprint 9
Welcome to our work for Sprint 9... THE FINAL SPRINT! :O
Built for CIS*4250 (Software Design V with Dr. Klotz) by Team 6.

## Sprint 9 Overview
Our main goals for this sprint were to:
- Use the Bing Image Search API to get photos of each professor
- Add faculty column to the results table with a button to view those photos
- Fix some bugs in our API's /tree endpoint
- Continue improving our testing and add better test coverage across the project
- Improve the CI/CD pipelines we added last sprint and run our tests automatically on push
- Complete and improve the "download graph as" button
- On node click, add modal popup with prerequisite tree diagrams (not just through the button in the table)
- Fix graph zooming bugs from last Sprint

## To replicate our demo:
1. Visit [http://cis4250-06.socs.uoguelph.ca/](http://cis4250-06.socs.uoguelph.ca/) to see our new photo feature, improved download button and graph/tree bug fixes.
2. [Start our Electron app](./src/course-finder/README.md) to see the same stuff
3. [Check out our CI/CD pipelines in action](https://git.socs.uoguelph.ca/cis-4250-team-6/w21cis4250team6/-/pipelines)
4. [Run our tests](./src/electronapp/course-finder/test/README.md)

## Coming soon...
Summer!

## Repo Structure
Here's where you can find all our stuff. Each directory has a README with specific instructions. 
```
├── src
│ ├── API # api stuff
│ ├── electronapp
│ │ ├── course-finder # electron app
│ ├── html # web app
│ ├── server
│ │ ├── vm_etc_nginx # server stuff
│ ├── scraper # webadvisor scraper
└── README.md
```

<img src="/src/html/deep_fried.jpg">

