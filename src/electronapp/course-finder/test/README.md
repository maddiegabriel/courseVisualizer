Technologies used:
    Mocha
    Istanbul

How to install:
    npm install

How to run the tests:
    To run the tests there are two commands you can use in electronapp/course-finder:

    1) The general command that will only show if tests have passed or not
        "npm test"
    
    2) Command to use istanbul to display the coverage of each file
        "npm run coverage"

When creating tests in order for it to be included in the coverage you must 
require the file you are testing 
    ex:
        var CodeFlower = require('../js/CodeFlower.js');