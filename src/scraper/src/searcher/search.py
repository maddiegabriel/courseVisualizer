import json


def search(toSearchJson, coursesJson):
    """
        Search the course data using a given search term from user input.
        Parameters:
            toSearchJson (dict): a dictionary describing the search specifications.
        Returns:
            resultsArray (array): an array of the matching course objects.

        One result
        >>> search(json.loads('{"code": "CIS*4250", "title": "", "credit": "", "semester": "", "departments": ""}'), json.load(open('parser.json')))
        [{'code': 'CIS*4250', 'title': 'Software Design V', 'semester': 'W', 'load': '0-6', 'credit': '0.50', 'description': 'This is a capstone course which applies the knowledge gained from the previous Software Design courses to a large team project. The course has an applied focus and will involve software design and development experiences in teams, a literacy component, and the use of software development tools.', 'departments': 'Department(s): School of Computer Science', 'restrictions': '', 'prerequisites': 'Prerequisite(s): CIS*2750, CIS*3260', 'locations': '', 'offerings': '', 'equates': '', 'corequisites': '', 'mentions': ['CIS*2750', 'CIS*3260'], 'prerequisites_mentions': ['CIS*2750', 'CIS*3260']}]

        Empty Search
        >>> search(json.loads('{}'), json.load(open('parser.json')))
        []

        Multiple results
        >>> search(json.loads('{"code": "", "title": "software", "credit": "0.5", "semester": "W", "departments": ""}'), json.load(open('parser.json')))
        [{'code': 'CIS*2250', 'title': 'Software Design II', 'semester': 'W', 'load': '3-2', 'credit': '0.50', 'description': 'This course focuses on the process of software design. Best practices for code development and review will be the examined. The software development process and tools to support this will be studied along with methods for project management. The course has an applied focus and will involve software design and development experiences in teams, a literacy component, and the use of software development tools.', 'departments': 'Department(s): School of Computer Science', 'restrictions': 'Restriction(s): Restricted to BCOMP:SENG majors.', 'prerequisites': 'Prerequisite(s): CIS*1250, CIS*1300', 'locations': '', 'offerings': '', 'equates': '', 'corequisites': '', 'mentions': ['CIS*1250', 'CIS*1300'], 'prerequisites_mentions': ['CIS*1250', 'CIS*1300']}, {'code': 'CIS*3190', 'title': 'Software for Legacy Systems', 'semester': 'W', 'load': '0-0', 'credit': '0.50', 'description': 'This course is an introduction to legacy software systems used in business, manufacturing, and engineering. Topics include COBOL programming, mainframe systems, and integration of legacy systems with contemporary computing systems.', 'departments': 'Department(s): School of Computer Science', 'restrictions': '', 'prerequisites': 'Prerequisite(s): CIS*2500 or work experience in a related field.', 'locations': '', 'offerings': 'Offering(s): Offered through Distance Education format only.', 'equates': '', 'corequisites': '', 'mentions': ['CIS*2500'], 'prerequisites_mentions': ['CIS*2500']}, {'code': 'CIS*4250', 'title': 'Software Design V', 'semester': 'W', 'load': '0-6', 'credit': '0.50', 'description': 'This is a capstone course which applies the knowledge gained from the previous Software Design courses to a large team project. The course has an applied focus and will involve software design and development experiences in teams, a literacy component, and the use of software development tools.', 'departments': 'Department(s): School of Computer Science', 'restrictions': '', 'prerequisites': 'Prerequisite(s): CIS*2750, CIS*3260', 'locations': '', 'offerings': '', 'equates': '', 'corequisites': '', 'mentions': ['CIS*2750', 'CIS*3260'], 'prerequisites_mentions': ['CIS*2750', 'CIS*3260']}]

        No results
        >>> search(json.loads('{"code": "CIS*0000", "title": "", "credit": "", "semester": "", "departments": ""}'), json.load(open('parser.json')))
        []

    """
    resultsArray = []
    if isEmpty(toSearchJson):
        return resultsArray

    # iterate all course objects
    for course in coursesJson['courses']:
        # if this course matches the provided search specs, add it to the
        # results
        if(checkMatch(toSearchJson, course)):
            resultsArray.append(course)

    return resultsArray


def checkMatch(toSearchJson, course):
    """
        Determine if the current course matches the search specs
        Parameters:
            toSearchJson (dict): a dictionary describing the search specifications.
            course (dict): the current course object.
        Returns:
            (bool): returns true if the course matches for all fields; returns false otherwise.

        Code matches
        >>> checkMatch(json.loads('{"code": "CIS*4250", "title": "", "credit": "", "semester": "", "departments": ""}'), {'code': 'CIS*4250', 'title': 'Software Design V', 'semester': 'W', 'load': '0-6', 'credit': '0.50', 'description': 'This is a capstone course which applies the knowledge gained from the previous Software Design courses to a large team project. The course has an applied focus and will involve software design and development experiences in teams, a literacy component, and the use of software development tools.', 'departments': 'Department(s): School of Computer Science', 'restrictions': '', 'prerequisites': 'Prerequisite(s): CIS*2750, CIS*3260', 'locations': '', 'offerings': '', 'equates': '', 'corequisites': '', 'mentions': ['CIS*2750', 'CIS*3260'], 'prerequisites_mentions': ['CIS*2750', 'CIS*3260']})
        True

        Code does not match
        >>> checkMatch(json.loads('{"code": "CIS*4250", "title": "", "credit": "", "semester": "", "departments": ""}'), {'code': 'CIS*2250', 'title': 'Software Design II', 'semester': 'W', 'load': '3-2', 'credit': '0.50', 'description': 'This course focuses on the process of software design. Best practices for code development and review will be the examined. The software development process and tools to support this will be studied along with methods for project management. The course has an applied focus and will involve software design and development experiences in teams, a literacy component, and the use of software development tools.', 'departments': 'Department(s): School of Computer Science', 'restrictions': 'Restriction(s): Restricted to BCOMP:SENG majors.', 'prerequisites': 'Prerequisite(s): CIS*1250, CIS*1300', 'locations': '', 'offerings': '', 'equates': '', 'corequisites': '', 'mentions': ['CIS*1250', 'CIS*1300'], 'prerequisites_mentions': ['CIS*1250', 'CIS*1300']})
        False
    """
    for key in toSearchJson:
        # return false as soon as course fails to match a search field
        if(toSearchJson[key] and toSearchJson[key].lower() not in course[key].lower()):
            return False
    # return true if course matched for all filled search fields
    return True


def isEmpty(toSearchJson):
    """
        Determine if every field in the provided search term object is empty.
        Parameters:
            toSearchJson (dict): a dictionary describing the search specifications.
        Returns:
            (bool): returns true if search is empty, false otherwise

        Search is empty
        >>> isEmpty(json.loads('{"code": "", "title": "", "credit": "", "semester": "", "departments": ""}'))
        True

        Search is not empty
        >>> isEmpty(json.loads('{"code": "CIS*4250", "title": "", "credit": "", "semester": "", "departments": ""}'))
        False
    """
    for key in toSearchJson:
        if(toSearchJson[key] != ''):
            return False
    return True
