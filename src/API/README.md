# API README

## Set up
In order to set up the API on the linux VM, in the directory with files
1. Clone this repo && `cd src/api`
2. Make sure Node.js is installed
3. Run `yarn`
4. Run `node app.js`

## /tree endpoint
This endpoint is used to GET a JSON of all course prerequisites to be used by d3.js to build a tree diagram

### usage
You can test it out with `cURL -X GET localhost:443/tree/CODE`.
Where CODE is the code of the root node course (i.e. CIS*4250)
The resulting JSON will be displayed in the terminal.

### response JSON
```
{ 
      "id": "CIS*3110",
      "children": [
        { 
          "id": "CIS*2030",
          "children": [
            { "id": "CIS*1910" },
            {
              "id": "CIS*2500",
              "children": [
                { "id": "CIS*1300" }
              ]
            }
          ]    
        },
        {
          "id": "CIS*2520",
          "children": [
            {
              "id": "CIS*2500",
              "children": [
                { "id": "CIS*1300" }
              ]
            },
            {"id": "CIS*1910"}
          ]    
        }
      ]
    }
}
```

## /search endpoint
This endpoint is used to POST a search of all currently offered U of G courses, filtered by different characteristics.

### usage
You can test the post request with `cURL -X POST -d "search={\"subject\":\"cis\"}" localhost:443/search`.
The resulting JSON will be displayed in the terminal.

### search query JSON
The following JSON representing the user's search query is built by the front end. It's used to filter all the courses scraped from Webadvisor (found in `scraper.json`). Each field of the query is optional.
```
{
    "subject": "CIS",
    "code": "4250",
    "title": "Software Design 5",
    "semester": "W",
    "weight": "0.5",
    "department": "School of Computer Science"
}
```

### search response JSON
All sections & courses matching the search query are returned in JSON that looks like this:
```
{
 "sections_list": [
        "CIS*1250*0101",
        "CIS*1250*0102",
        // ...
    ],
    "courses_list": [
        "CIS*1250",
        "CIS*2750",
        // ...
    ],
    "sections": [
        {
            "status": "Open",
            "title": "CIS*1250*0101 (0928) Software Design I",
            "term": "Fall 2020",
            "location": "Guelph",
            "meeting_info": ...,
            "faculty": "L. Antonie",
            "credits": "0.50",
            "academic_level": "Undergraduate",
            "available": "12",
            "capacity": "29",
            "code": {
                "type": "CIS",
                "number": "1250",
                "section": "0101"
            }
        },
        // .............................
    ],
    "courses": [
        {
            "code": "CIS*1250",
            "title": "Software Design I",
            "semester": "F",
            "load": "3-2",
            "credit": "0.50",
            "description": ...,
            "departments": "Department(s): School of Computer Science",
            "restrictions": "Restriction(s): Restricted to students in BCOMP:SENG and BCOMP:SENG:C",
            "prerequisites": "",
            "locations": "",
            "offerings": "",
            "equates": "",
            "corequisites": "",
            "mentions": [],
            "prerequisites_mentions": []
        },
        // .............................
    ]
}
```
