const { validateAndFormatSearch, courseTree, filterCourses } = require('./util');

test('courseTree returns correct tree (1)', () => {
    let courses = {
        "COURSEA": {
            "code": "COURSEA",
            "prerequisites_mentions": ["COURSEB", "COURSEC"]
        },
        "COURSEB": {
            "code": "COURSEB",
            "prerequisites_mentions": []
        },
        "COURSEC": {
            "code": "COURSEC",
            "prerequisites_mentions": ["COURSED"]
        },
        "COURSED": {
            "code": "COURSED",
            "prerequisites_mentions": []
        }
    };

    let tree = courseTree("COURSEA", courses);

    let expected = {
        "id": "COURSEA",
        "children": [
            {
                "id": "COURSEB"
            },
            {
                "id": "COURSEC",
                "children": [
                    {
                        "id": "COURSED"
                    }
                ]
            }
        ]
    };

    expect(tree).toEqual(expected);
});

test('courseTree returns correct tree (2)', () => {
    let courses = {
        "COURSEA": {
            "code": "COURSEA",
            "prerequisites_mentions": ["COURSEB", "COURSEC"]
        },
        "COURSEB": {
            "code": "COURSEB",
            "prerequisites_mentions": []
        },
        "COURSEC": {
            "code": "COURSEC",
            "prerequisites_mentions": ["COURSED"]
        },
        "COURSED": {
            "code": "COURSED",
            "prerequisites_mentions": []
        }
    };

    let tree = courseTree("COURSEC", courses);

    let expected = {
        "id": "COURSEC",
        "children": [
            {
                "id": "COURSED"
            }
        ]
    };

    expect(tree).toEqual(expected);
});

test('courseTree returns correct tree (2)', () => {
    let courses = {
        "COURSEA": {
            "code": "COURSEA",
            "prerequisites_mentions": ["COURSEB", "COURSEC"]
        },
        "COURSEB": {
            "code": "COURSEB",
            "prerequisites_mentions": []
        },
        "COURSEC": {
            "code": "COURSEC",
            "prerequisites_mentions": ["COURSED"]
        },
        "COURSED": {
            "code": "COURSED",
            "prerequisites_mentions": []
        }
    };

    let tree = courseTree("COURSED", courses);

    let expected = {
        "id": "COURSED"
    };

    expect(tree).toEqual(expected);
});

test('validateAndFormatSearch lowercase', () => {
    let search = {
        'subject': 'CIS*3090 Something Something About Gumputers',
        'code': 'CIS*3090'
    };

    validateAndFormatSearch(search);

    let expected = {
        'subject': 'cis*3090 something something about gumputers',
        'code': 'cis*3090'
    };

    expect(search).toEqual(expected);
});

test('validateAndFormatSearch weight', () => {
    let search = {
        'subject': 'CIS*3090 Something Something About Gumputers',
        'code': 'CIS*3090',
        'weight': '99'
    };

    validateAndFormatSearch(search);

    let expected = {
        'subject': 'cis*3090 something something about gumputers',
        'code': 'cis*3090',
        'weight': ''
    };

    expect(search).toEqual(expected);
});

test('validateAndFormatSearch weight', () => {
    let search = {
        'subject': 'CIS*3090 Something Something About Gumputers',
        'code': 'CIS*3090',
        'weight': '0.25'
    };

    validateAndFormatSearch(search);

    let expected = {
        'subject': 'cis*3090 something something about gumputers',
        'code': 'cis*3090',
        'weight': '0.25'
    };

    expect(search).toEqual(expected);
});

test('filterCourses', () => {
    let courses = {
        "ACCT*1220": {
            "code": "ACCT*1220",
            "title": "Introductory Financial Accounting",
            "semester": "F,W",
            "load": "3-0",
            "credit": "0.50",
            "description": "This introductory course is designed to develop a foundational understanding of current accounting principles and their implication for published financial reports of business enterprises. It builds the base of knowledge and understanding required to succeed in more advanced study of accounting. The course approaches the subject from the point of view of the user of accounting information rather than that of a person who supplies the information.",
            "departments": "Department(s): Department of Management",
            "restrictions": "Restriction(s): ACCT*2220 , This is a Priority Access Course. Enrolment may be restricted to particular programs or specializations. See department for more information.",
            "prerequisites": "",
            "locations": "",
            "offerings": "Offering(s): Also offered through Distance Education format.",
            "equates": "",
            "corequisites": "",
            "mentions": ["ACCT*2220"],
            "prerequisites_mentions": []
        },
        "ACCT*1240": {
            "code": "ACCT*1240",
            "title": "Applied Financial Accounting",
            "semester": "W",
            "load": "3-0",
            "credit": "0.50",
            "description": "This course requires students to apply the fundamental principles emanating from accounting’s conceptual framework and undertake the practice of financial accounting. Students will become adept at performing the functions related to each step in the accounting cycle, up to and including the preparation of the financial statements and client reports. Students will also develop the skills necessary for assessing an organization’s system of internal controls and financial conditions.",
            "departments": "Department(s): Department of Management",
            "restrictions": "Restriction(s): ACCT*2240 , This is a Priority Access Course. Enrolment may be restricted to particular programs or specializations. See department for more information.",
            "prerequisites": "Prerequisite(s): ACCT*1220 or ACCT*2220",
            "locations": "",
            "offerings": "",
            "equates": "",
            "corequisites": "",
            "mentions": ["ACCT*1220", "ACCT*2220", "ACCT*2240"],
            "prerequisites_mentions": ["ACCT*1220", "ACCT*2220"]
        }
    };

    let sections = {
        "ACCT*1220*0101": {
            "status": "Open",
            "title": "ACCT*1220*0101 (4675) Intro Financial Accounting",
            "term": "Winter 2021",
            "location": "Guelph",
            "meeting_info": "LEC Mon\n11:30AM - 01:20PM\nAD-S, Room Virtual\nSEM Tues\n08:30AM - 09:20AM\nAD-S, Room Virtual\nEXAM Fri\n08:30AM - 10:30AM (2021/04/23)\nRoom TBA",
            "faculty": "D. Senkl",
            "credits": "0.50",
            "academic_level": "Undergraduate",
            "available": "4",
            "capacity": "60",
            "code": {
                "type": "ACCT",
                "number": "1220",
                "section": "0101"
            }
        },
        "ACCT*1220*0102": {
            "status": "Open",
            "title": "ACCT*1220*0102 (4676) Intro Financial Accounting",
            "term": "Winter 2021",
            "location": "Guelph",
            "meeting_info": "LEC Mon\n11:30AM - 01:20PM\nAD-S, Room Virtual\nSEM Tues\n09:30AM - 10:20AM\nAD-S, Room Virtual\nEXAM Fri\n08:30AM - 10:30AM (2021/04/23)\nRoom TBA",
            "faculty": "D. Senkl",
            "credits": "0.50",
            "academic_level": "Undergraduate",
            "available": "3",
            "capacity": "60",
            "code": {
                "type": "ACCT",
                "number": "1220",
                "section": "0102"
            }
        },
        "ACCT*1240*01": {
            "status": "Open",
            "title": "ACCT*1240*01 (4692) Applied Financial Accounting",
            "term": "Winter 2021",
            "location": "Guelph",
            "meeting_info": "LEC Tues, Thur\n11:30AM - 12:50PM\nAD-S, Room Virtual\nEXAM Tues\n02:30PM - 04:30PM (2021/04/27)\nRoom TBA",
            "faculty": "C. Zavitz",
            "credits": "0.50",
            "academic_level": "Undergraduate",
            "available": "5",
            "capacity": "100",
            "code": {
                "type": "ACCT",
                "number": "1240",
                "section": "01"
            }
        },
        "ACCT*1240*02": {
            "status": "Open",
            "title": "ACCT*1240*02 (4693) Applied Financial Accounting",
            "term": "Winter 2021",
            "location": "Guelph",
            "meeting_info": "LEC Tues, Thur\n08:30AM - 09:50AM\nAD-S, Room Virtual\nEXAM Tues\n02:30PM - 04:30PM (2021/04/27)\nRoom TBA",
            "faculty": "C. Zavitz",
            "credits": "0.50",
            "academic_level": "Undergraduate",
            "available": "37",
            "capacity": "120",
            "code": {
                "type": "ACCT",
                "number": "1240",
                "section": "02"
            }
        }
    };

    let expected = {
        "sections_list": ["ACCT*1220*0101", "ACCT*1220*0102", "ACCT*1240*01", "ACCT*1240*02"],
        "courses_list": ["ACCT*1220", "ACCT*1240"],
        "sections": {
            "ACCT*1220*0101": {
                "status": "Open",
                "title": "ACCT*1220*0101 (4675) Intro Financial Accounting",
                "term": "Winter 2021",
                "location": "Guelph",
                "meeting_info": "LEC Mon\n11:30AM - 01:20PM\nAD-S, Room Virtual\nSEM Tues\n08:30AM - 09:20AM\nAD-S, Room Virtual\nEXAM Fri\n08:30AM - 10:30AM (2021/04/23)\nRoom TBA",
                "faculty": "D. Senkl",
                "credits": "0.50",
                "academic_level": "Undergraduate",
                "available": "4",
                "capacity": "60",
                "code": {
                    "type": "ACCT",
                    "number": "1220",
                    "section": "0101"
                }
            },
            "ACCT*1220*0102": {
                "status": "Open",
                "title": "ACCT*1220*0102 (4676) Intro Financial Accounting",
                "term": "Winter 2021",
                "location": "Guelph",
                "meeting_info": "LEC Mon\n11:30AM - 01:20PM\nAD-S, Room Virtual\nSEM Tues\n09:30AM - 10:20AM\nAD-S, Room Virtual\nEXAM Fri\n08:30AM - 10:30AM (2021/04/23)\nRoom TBA",
                "faculty": "D. Senkl",
                "credits": "0.50",
                "academic_level": "Undergraduate",
                "available": "3",
                "capacity": "60",
                "code": {
                    "type": "ACCT",
                    "number": "1220",
                    "section": "0102"
                }
            },
            "ACCT*1240*01": {
                "status": "Open",
                "title": "ACCT*1240*01 (4692) Applied Financial Accounting",
                "term": "Winter 2021",
                "location": "Guelph",
                "meeting_info": "LEC Tues, Thur\n11:30AM - 12:50PM\nAD-S, Room Virtual\nEXAM Tues\n02:30PM - 04:30PM (2021/04/27)\nRoom TBA",
                "faculty": "C. Zavitz",
                "credits": "0.50",
                "academic_level": "Undergraduate",
                "available": "5",
                "capacity": "100",
                "code": {
                    "type": "ACCT",
                    "number": "1240",
                    "section": "01"
                }
            },
            "ACCT*1240*02": {
                "status": "Open",
                "title": "ACCT*1240*02 (4693) Applied Financial Accounting",
                "term": "Winter 2021",
                "location": "Guelph",
                "meeting_info": "LEC Tues, Thur\n08:30AM - 09:50AM\nAD-S, Room Virtual\nEXAM Tues\n02:30PM - 04:30PM (2021/04/27)\nRoom TBA",
                "faculty": "C. Zavitz",
                "credits": "0.50",
                "academic_level": "Undergraduate",
                "available": "37",
                "capacity": "120",
                "code": {
                    "type": "ACCT",
                    "number": "1240",
                    "section": "02"
                }
            }
        },
        "courses": {
            "ACCT*1220": {
                "code": "ACCT*1220",
                "title": "Introductory Financial Accounting",
                "semester": "F,W",
                "load": "3-0",
                "credit": "0.50",
                "description": "This introductory course is designed to develop a foundational understanding of current accounting principles and their implication for published financial reports of business enterprises. It builds the base of knowledge and understanding required to succeed in more advanced study of accounting. The course approaches the subject from the point of view of the user of accounting information rather than that of a person who supplies the information.",
                "departments": "Department(s): Department of Management",
                "restrictions": "Restriction(s): ACCT*2220 , This is a Priority Access Course. Enrolment may be restricted to particular programs or specializations. See department for more information.",
                "prerequisites": "",
                "locations": "",
                "offerings": "Offering(s): Also offered through Distance Education format.",
                "equates": "",
                "corequisites": "",
                "mentions": ["ACCT*2220"],
                "prerequisites_mentions": []
            },
            "ACCT*1240": {
                "code": "ACCT*1240",
                "title": "Applied Financial Accounting",
                "semester": "W",
                "load": "3-0",
                "credit": "0.50",
                "description": "This course requires students to apply the fundamental principles emanating from accounting’s conceptual framework and undertake the practice of financial accounting. Students will become adept at performing the functions related to each step in the accounting cycle, up to and including the preparation of the financial statements and client reports. Students will also develop the skills necessary for assessing an organization’s system of internal controls and financial conditions.",
                "departments": "Department(s): Department of Management",
                "restrictions": "Restriction(s): ACCT*2240 , This is a Priority Access Course. Enrolment may be restricted to particular programs or specializations. See department for more information.",
                "prerequisites": "Prerequisite(s): ACCT*1220 or ACCT*2220",
                "locations": "",
                "offerings": "",
                "equates": "",
                "corequisites": "",
                "mentions": ["ACCT*1220", "ACCT*2220", "ACCT*2240"],
                "prerequisites_mentions": ["ACCT*1220", "ACCT*2220"]
            }
        }
    };

    let received = filterCourses(courses, sections, {});
    
    expect(received).toEqual(expected);
});