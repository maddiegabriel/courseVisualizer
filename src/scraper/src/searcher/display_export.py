import json
from colorama import init, Fore


def displayCourses(results):
    """
        After a search is complete, display the results to the user in coloured text.
        Parameters:
            results (array): an array containing all the search results, where each element is one course object.
        Returns: none

    Display results
    >>> displayCourses([{'code': 'CIS*4250', 'title': 'Software Design V', 'semester': 'W', 'load': '0-6', 'credit': '0.50', 'description': 'This is a capstone course which applies the knowledge gained from the previous Software Design courses to a large team project. The course has an applied focus and will involve software design and development experiences in teams, a literacy component, and the use of software development tools.', 'departments': 'Department(s): School of Computer Science', 'restrictions': '', 'prerequisites': 'Prerequisite(s): CIS*2750, CIS*3260', 'locations': '', 'offerings': '', 'equates': '', 'corequisites': '', 'mentions': ['CIS*2750', 'CIS*3260'], 'prerequisites_mentions': ['CIS*2750', 'CIS*3260']}])
    code: CIS*4250
    title: Software Design V
    semester: W
    credit: 0.50
    load: 0-6
    description: This is a capstone course which applies the knowledge gained from the previous Software Design courses to a large team project. The course has an applied focus and will involve software design and development experiences in teams, a literacy component, and the use of software development tools.
    departments: Department(s): School of Computer Science
    prerequisites: Prerequisite(s): CIS*2750, CIS*3260
    restrictions: 
    <BLANKLINE>
    <BLANKLINE>

    Display no results
    >>> displayCourses([])
    No results for your search! Please try again.
    <BLANKLINE>
    """
    init(autoreset=True)
    if len(results) == 0:
        print(Fore.GREEN + 'No results for your search! Please try again.\n')
    for course in results:
        print(Fore.BLUE + 'code: ' + Fore.GREEN + course['code'])
        print(Fore.BLUE + 'title: ' + Fore.GREEN + course['title'])
        # can only concatenate str (not "float") to str
        print(Fore.BLUE + 'semester: ' + Fore.GREEN + str(course['semester']))
        print(Fore.BLUE + 'credit: ' + Fore.GREEN + str(course['credit']))
        print(Fore.BLUE + 'load: ' + Fore.GREEN + str(course['load']))
        print(Fore.BLUE + 'description: ' + Fore.GREEN + course['description'])
        print(Fore.BLUE + 'departments: ' +
              Fore.GREEN + str(course['departments']))
        print(Fore.BLUE + 'prerequisites: ' +
              Fore.GREEN + str(course['prerequisites']))
        print(Fore.BLUE + 'restrictions: ' +
              Fore.GREEN + str(course['restrictions']))
        print(Fore.RESET + "\n")


def exportToJsonFile(results):
    """
        Export the user's search results to a file called courses_out.json.
        Parameters:
            results (array): an array containing all the search results, where each element is one course object.
        Returns: none

    """
    with open('../out/courses_out.json', 'w') as outfile:
        json.dump(results, outfile, indent=4)
    print("\nResults exported to out/courses_out.json!")
