# Search Functionality

Below is some doucmentation for the search functionality in `src/searcher/search.py`.

## Performing a Search
To perform a search, pass in a JSON object with the search terms:
```
toSearchJson = {
        "code" : "code",
        "title" : "title",
        "credit" : "credit",
        "semester" : "semester",
        "departments" : "department",
    }
```

If any term is not required, simply leave it blank like this:
```
toSearchJson = {
        "code" : "CIS",
        "title" : "interface",
        "credit" : "",
        "semester" : "F",
        "departments" : "",
    }
```

So, you would call the search function like this:
```
results = search(toSearchJson)
```

## Search Results
The search function will return an array of course objects which looks like this:
```
[
    {
            "code": "CIS*2170",
            "title": "User Interface Design",
            "semester": "W",
            "load": "3-2",
            "credit": "0.75",
            "description": "This course is a practical introduction to the area of user interface construction. Topics include user interface components and their application, best practices for user interface design, approaches to prototyping, and techniques for assessing interface suitability.",
            "departments": "",
            "restrictions": "",
            "prerequisites": "Prerequisite(s): 1 of CIS*1200, CIS*1300, CIS*1500",
            "locations": "",
            "offerings": "",
            "equates": "",
            "corequisites": "",
            "mentions": "['CIS*1200', 'CIS*1300', 'CIS*1500']",
            "prerequisites_mentions": ['CIS*1200', 'CIS*1300', 'CIS*1500']
        },
        {
            "code": "CIS*2250",
            "title": "Software Design II",
            "semester": "W",
            "load": "3-2",
            "credit": "0.50",
            "description": "This course focuses on the process of software design. Best practices for code development and review will be the examined. The software development process and tools to support this will be studied along with methods for project management. The course has an applied focus and will involve software design and development experiences in teams, a literacy component, and the use of software development tools.",
            "departments": "",
            "restrictions": "Restriction(s): Restricted to BCOMP:SENG majors.",
            "prerequisites": "Prerequisite(s): CIS*1250, CIS*1300",
            "locations": "",
            "offerings": "",
            "equates": "",
            "corequisites": "",
            "mentions": "['CIS*1250', 'CIS*1300']",
            "prerequisites_mentions": ['CIS*1250', 'CIS*1300']
        }
]
```