# Turn the parser.json file into a CSV of edges,
# and the scraper.json file into a CSV of nodes.
# usage args: parser_json scraper_json
# Run to generate CSV's in /out: python generate_csv.py ../parser.json ../scraper.json
# Run doc test: python3 -m doctest -v generate_csv.py 

import json
import sys
import csv
import doctest


def generate_csv(selection, parser_json, scraper_json):
    # doctest.testmod(optionflags=doctest.SKIP, verbose=True)
    """
        Generate two csv files containing the course info & prereqs for given set of courses.
        Parameters:
            selection (list): list of course codes user wants (empty if all courses).
            parser_json (dict): a dict containing all courses from /parser.
            scraper_json (dict): a dict containing all sections from /scraper.
        Returns: none
    """
    # error checking for empty course lists
    if (parser_json == [] or scraper_json == []):
        return []

    # build an array of course nodes using the JSON from /scraper result
    nodes = filter_nodes(selection, scraper_json)
    # build an array of course prereq edges using the JSON from /parser result
    edges = filter_edges(selection, parser_json)

    # create a CSV file in /out for each of those arrays
    build_csvs(nodes, edges)


def filter_nodes(selection, scraper_json):
    """
        Build a list of nodes (one list per course).
        Parameters:
            selection (list): list of course codes user wants (empty if all courses).
            scraper_json (dict): a dict containing all sections from /scraper.
        Returns:
           nodes (list): a list of lists like this - [[code, label, fullness]]

        >>> filter_nodes(["CIS"], {'courses':[{'available':'5', 'capacity':'10', 'code':{'type': 'CIS', 'number':'4250'}}]})
        [['Id', 'Label', 'Fullness'], ['CIS*4250', 'CIS*4250 (5/10)', 3]]

        >>> filter_nodes(["ACCT"], {'courses':[{'available':'5', 'capacity':'10', 'code':{'type': 'CIS', 'number':'4250'}}]})
        [['Id', 'Label', 'Fullness']]

        >>> filter_nodes(["CIS"], {'courses':[{'available':'5', 'capacity':'10', 'code':{'type': 'CIS', 'number':'4250'}}, {'available':'25', 'capacity':'100', 'code':{'type': 'CIS', 'number':'2170'}}]})
        [['Id', 'Label', 'Fullness'], ['CIS*4250', 'CIS*4250 (5/10)', 3], ['CIS*2170', 'CIS*2170 (25/100)', 2]]

        >>> filter_nodes([], {'courses':[{'available':'5', 'capacity':'10', 'code':{'type': 'CIS', 'number':'4250'}}]})
        [['Id', 'Label', 'Fullness'], ['CIS*4250', 'CIS*4250 (5/10)', 3]]

        >>> filter_nodes(["CIS"], {'courses':[{'available':'5', 'capacity':'10', 'code':{'type': 'CIS', 'number':'4250'}}, {'available':'25', 'capacity':'100', 'code':{'type': 'CIS', 'number':'4250'}}]})
        [['Id', 'Label', 'Fullness'], ['CIS*4250', 'CIS*4250 (30/110)', 3]]
    """
    nodes_dict = {}
    # iterate scraper data
    for section in scraper_json['courses']:
        code = section['code']['type']
        # check if we want this course
        if(selection == [] or (code in selection)):
            id = code + "*" + section['code']['number']  # CIS*2250
            avail = get_avail(section)
            cap = get_cap(section)
            if id in nodes_dict:
                # if course is already in dict, update avail/cap
                nodes_dict[id]['avail'] += avail
                nodes_dict[id]['cap'] += cap
            else:
                # add a new course node to dict
                nodes_dict[id] = {'avail': avail, 'cap': cap}

    return dict_to_list(nodes_dict)


def filter_edges(selection, parser_json):
    """
        Build a list of edges (one list per prerequisite).
        Parameters:
            selection (list): list of course codes user wants (empty if all courses).
            parser_json (dict): a dict containing all courses from /parser.
        Returns:
           edge (list): a list of lists like this - [[course, prereq]]

        >>> filter_edges(["CIS"], {'courses':[{'code':'CIS*4250', 'prerequisites_mentions':['CIS*2750']}]})
        [['Source', 'Target', 'Type', 'Weight'], ['CIS*4250', 'CIS*2750', 'Directed', 1]]

        >>> filter_edges(["ACCT"], {'courses':[{'code':'CIS*4250', 'prerequisites_mentions':['CIS*2750']}]})
        [['Source', 'Target', 'Type', 'Weight']]

        >>> filter_edges(["CIS"], {'courses':[{'code':'CIS*4250', 'prerequisites_mentions':['CIS*2750', 'CIS*3260']}]})
        [['Source', 'Target', 'Type', 'Weight'], ['CIS*4250', 'CIS*2750', 'Directed', 1], ['CIS*4250', 'CIS*3260', 'Directed', 1]]

        >>> filter_edges([], {'courses':[{'code':'CIS*4250', 'prerequisites_mentions':['CIS*2750']}]})
        [['Source', 'Target', 'Type', 'Weight'], ['CIS*4250', 'CIS*2750', 'Directed', 1]]
    """
    edges = []
    # to start, append header for edges CSV
    edges.append(['Source', 'Target', 'Type', 'Weight'])

    for course in parser_json['courses']:
        # get the first part of the course code (i.e. 'CIS')
        code = course['code'].split("*")
        # append all prereqs if course exists in the selection dict, or
        if(selection == [] or code[0] in selection):
            for prereq in course['prerequisites_mentions']:
                edges.append([course['code'], prereq, 'Directed', 1])
    return edges


def get_avail(section):
    """
        Get availability number for this course section.
        Parameters:
            section (dict): the dict describing this course section.
        Returns:
            avail (int): the availability integer, or 0 if none.

        >>> get_avail({'available':2,'capacity':100})
        2

        >>> get_avail({'test':2,'test2':100})
        0

        >>> get_avail({'available':'','capacity':100})
        0
    """
    if not 'available' in section or section['available'] == '':
        return 0
    else:
        return int(section['available'])


def get_cap(section):
    """
        Get capacity number for this course section.
        Parameters:
            section (dict): the dict describing this course section.
        Returns:
            cap (int): the capacity integer, or 0 if none.

        >>> get_cap({'available':2,'capacity':100})
        100

        >>> get_cap({'test':2,'test2':100})
        0

        >>> get_cap({'available':2,'capacity':''})
        0
    """
    if not 'capacity' in section or section['capacity'] == '':
        return 0
    else:
        return int(section['capacity'])


def dict_to_list(nodes_dict):
    """
        Parameters:
            nodes_dict (dict): a dict containing course codes, numbers, avails and caps 
        Returns:
            nodes (list): a list of lists like this - [[id, label, fullness]]

        >>> dict_to_list({'CIS*4250': {'avail':5, 'cap':10}})
        [['Id', 'Label', 'Fullness'], ['CIS*4250', 'CIS*4250 (5/10)', 3]]

        >>> dict_to_list({})
        [['Id', 'Label', 'Fullness']]

        >>> dict_to_list({'CIS*4250': {'avail':5, 'cap':10}, 'CIS*2170':{'avail':0, 'cap':50}})
        [['Id', 'Label', 'Fullness'], ['CIS*4250', 'CIS*4250 (5/10)', 3], ['CIS*2170', 'CIS*2170 (0/50)', 0]]
    """
    nodes = []
    # to start, append header for nodes CSV
    nodes.append(['Id', 'Label', 'Fullness'])
    # iterate over dict and add one list element per course
    for key, value in nodes_dict.items():
        label = '%s (%d/%d)' % (key, value['avail'], value['cap'])
        fullness = calculate_fullness(value['avail'], value['cap'])
        nodes.append([key, label, fullness])
    return nodes


def calculate_fullness(avail, cap):
    """
        Calculates 'fullness' percentage of course and returns a number to represent it.
        Parameters:
            avail (int): number of spots left in this course.
            cap (int): total capacity of this course.
        Returns:
            fullness (int): integer representing a numeric category based on percentage 'fullness'

        >>> calculate_fullness(0,0)
        0

        >>> calculate_fullness(-1,-1)
        4

        >>> calculate_fullness(5,10)
        3

        >>> calculate_fullness(25,100)
        2

        >>> calculate_fullness(10,100)
        1
    """
    # if no capacity, course is full (avoid divide by 0)
    if cap == 0:
        return 0
    fullness = 100 - (avail / cap * 100)
    if fullness == 100:
        return 0
    elif fullness >= 90:
        return 1
    elif fullness >= 75:
        return 2
    elif fullness >= 50:
        return 3
    else:
        return 4


def build_csvs(nodes, edges):
    """
        Writes each given list to a csv file under /out.
        Parameters:
            nodes (list): list of unique course nodes.
            edges (list): list of course prerequisite edges.
        Returns: none
    """

    # export course nodes to csv file and print error/confirmation msg
    with open("../../out/course_nodes.csv", "w+") as nodes_csv:
        csvWriter = csv.writer(nodes_csv, delimiter=',')
        csvWriter.writerows(nodes)
    if len(nodes) == 1:
        print("\nSorry, no courses found for this selection. Please try again!")
    else:
        print("\nNodes exported to out/course_nodes.csv!")

    # export prereq edges to csv file and print error/confirmation msg
    with open("../../out/course_edges.csv", "w+") as edges_csv:
        csvWriter = csv.writer(edges_csv, delimiter=',')
        csvWriter.writerows(edges)
    if len(edges) > 1:
        print("Edges exported to out/course_edges.csv!")


def csv_menu():
    """
        Gather user's action of choice from a simple command line menu. Call appropriate function to fulfill action.
        Parameters: none
        Returns: none
    """
    choice = ''
    ceps_courses = ["CHEM", "CIS", "ENGG", "MATH", "STAT", "PHYS"]
    solal_courses = [
        "CLAS",
        "EURO",
        "FREN",
        "GERM",
        "GREK",
        "HUMN",
        "INDG",
        "ITAL",
        "LACS",
        "LAT",
        "LING",
        "SPAN"]

    print("\n*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*")
    print(" Welcome to our U of G Course CSV generator!")
    print("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*")
    while (choice != '5'):
        print("\nCSV MENU")
        print("------------------------------------")
        print("Press 1 to generate CSV for ALL courses")
        print("Press 2 to generate CSV for CEPS courses")
        print("Press 3 to generate CSV for SOLAL courses")
        print("Press 4 to generate CSV for a custom set of courses")
        print("Press 5 to exit")
        choice = input("Choice: ")
        if choice == '1':
            generate_csv([], parser_json, scraper_json)
        elif choice == '2':
            generate_csv(ceps_courses, parser_json, scraper_json)
        elif choice == '3':
            generate_csv(solal_courses, parser_json, scraper_json)
        elif choice == '4':
            custom_courses = input(
                "\nEnter course codes to include (comma separated): ")
            generate_csv(custom_courses.upper(), parser_json, scraper_json)
        elif choice == '5':
            print("\n*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*")
            print(r"Cheers! See you next sprint ¯\_(ツ)_/¯")
            print("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n")
            exit()
        else:
            print("Wrong input - please try again!")


if __name__ == '__main__':
    try:
        with open(sys.argv[1]) as f:
            t = f.read()
            parser_json = json.loads(t)
        with open(sys.argv[2]) as f:
            t = f.read()
            scraper_json = json.loads(t)
        csv_menu()
    except IndexError:
        import __main__
        print(f'usage: python3 {__main__.__file__} parser_json scraper_json')
