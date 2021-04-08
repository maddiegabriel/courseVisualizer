let { load_courses_with_path,
    load_courses,
    load_sections_with_path,
    load_sections } = require('./loading');

test('load_courses_with_path', () => {
    let courses = load_courses_with_path('./test_data/courses.json');
    expect(courses).toEqual({
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

    });
});

test('load_sections_with_path', () => {
    let sections = load_sections_with_path('./test_data/scraper.json');
    expect(sections).toEqual({
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
        }
    });
});

test('load_courses', () => {
    let received = load_courses([
        {
            "code": "A"
        },
        {
            "code": "B"
        },
        {
            "code": "C"
        }
    ]);
    let expected = {
        "A": {
            "code": "A"
        },
        "B": {
            "code": "B"
        },
        "C": {
            "code": "C"
        }
    }
    expect(received).toEqual(expected);
});

test('load_sections', () => {
    let received = load_sections([
        {
            "code": {
                "type": "A",
                "number": "B",
                "section": "C"
            }
        },
        {
            "code": {
                "type": "D",
                "number": "E",
                "section": "F"
            }
        },
        {
            "code": {
                "type": "G",
                "number": "H",
                "section": "I"
            }
        }
    ]);
    let expected = {
        "A*B*C": {
            "code": {
                "type": "A",
                "number": "B",
                "section": "C"
            }
        },
        "D*E*F": {
            "code": {
                "type": "D",
                "number": "E",
                "section": "F"
            }
        },
        "G*H*I": {
            "code": {
                "type": "G",
                "number": "H",
                "section": "I"
            }
        }
    }
    expect(received).toEqual(expected);
});