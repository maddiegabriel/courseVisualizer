import re
from collections import defaultdict
import os.path
from os import path
import sys
import __main__


def list_of_strings_as_json_string(_list, joiner=', '):
    '''
    Returns a json formatted array of strings given a list of strings.

    >>> list_of_strings_as_json_string(["A", "B", "C"])
    '["A", "B", "C"]'
    >>> list_of_strings_as_json_string([])
    '[]'
    >>> list_of_strings_as_json_string(["EXAMPLE", "TEXT"])
    '["EXAMPLE", "TEXT"]'
    '''

    return '[' + joiner.join(map(lambda s: f'"{s}"', _list)) + ']'


def is_course_starting_line(line):
    '''
    Returns whether the line appears to be the first line of a course.
    This is checked by whether or not it starts with a course code and
    ends with a square bracket.

    >>> is_course_starting_line('GEOG*1000 Interesting Facts About Rocks F,W (3-0) [0.50]')
    True
    >>> is_course_starting_line('HK*1000 Truthful Teachings')
    False
    >>> is_course_starting_line('HK*1000')
    False
    >>> is_course_starting_line('GEOG*1000Interesting Facts About Rocks F,W (3-0) [0.50]')
    True
    '''
    return re.match(r'^[A-Z]{2,4}\*[0-9]{4}.*\[[0-9.]+\]$', line) is not None


def is_course_code(line):
    '''
    Returns whether line is a valid course code.
    This is defined as two to four capital letters followed by an
    asterisk and exactly four digits.

    >>> is_course_code('ABCD*0000')
    True
    >>> is_course_code('CIS*4250')
    True
    >>> is_course_code('HK*1000')
    True
    >>> is_course_code('A*1000')
    False
    >>> is_course_code('ABCD*123')
    False
    '''
    return re.search(r'[A-Z]{2,4}\*[0-9]{4}', line) is not None


def separate_words(line):
    '''
    Returns the words in a sentence as a list.

    >>> separate_words('This sentence has five words.')
    ['This', 'sentence', 'has', 'five', 'words.']
    >>> separate_words('')
    []
    >>> separate_words(' ')
    []
    >>> separate_words('Science')
    ['Science']
    '''
    return line.split()


def retrieve_course_codes(line):
    '''
    Finds all occurances of course codes in the given text.

    >>> retrieve_course_codes('Prerequisite(s): 15.00 credits including ZOO*2090')
    ['ZOO*2090']
    >>> retrieve_course_codes('Prerequisite(s): 15.00 credits including (STAT*2040 or STAT*2230), ZOO*2090')
    ['STAT*2040', 'STAT*2230', 'ZOO*2090']
    >>> retrieve_course_codes('Prerequisite(s): 15.00 credits')
    []
    >>> retrieve_course_codes('Prerequisite(s): 15.00 credits including (STAT*2040 or STAT*2230), ZOO*2090 and STAT*2040')
    ['STAT*2040', 'STAT*2230', 'ZOO*2090']
    '''
    found_course_codes = re.findall(r'[A-Z]{2,4}\*[0-9]{4}', line)
    # Remove duplicates from the list
    return list(dict.fromkeys(found_course_codes))


def starts_with_a_key_term(line):
    '''
    Returns whether the given string starts with one of the strings in `key_terms`.

    >>> starts_with_a_key_term('Prerequisite(s): 15.00 credits including (STAT*2040 or STAT*2230), ZOO*2090')
    True
    >>> starts_with_a_key_term('Department(s): Math I think.')
    True
    >>> starts_with_a_key_term('15.00 credits including (STAT*2040 or STAT*2230), ZOO*2090')
    False
    >>> starts_with_a_key_term('')
    False
    '''

    key_terms = [
        'Department(s):',
        'Restriction(s):',
        'Prerequisite(s):',
        'Location(s):',
        'Offering(s):',
        'Equate(s):',
        'Co-requisite(s):'
    ]

    for bablingo in key_terms:
        if line[:len(bablingo)] == bablingo:
            return True
    return False


def key_term_from_string(string):
    '''
    Returns what key was on the line given, or None.
    >>> key_term_from_string('Department(s): This is a very department department. Very VERY departmenty.')
    'departments'
    >>> key_term_from_string('Restriction(s): This is a very restricted course. Very VERY restricted.')
    'restrictions'
    >>> key_term_from_string('Prerequisite(s): There are so many prerequisites we cant even count them. Lets begin:')
    'prerequisites'
    >>> key_term_from_string('Co-requisite(s): Youre gonna have to take fifteen courses this semester. Sorry. It is what it is.')
    'corequisites'
    >>> key_term_from_string('Time and space are fake')
    '''

    split = string.strip().split()

    if len(split) == 0:
        return None

    first = split[0]

    if first == 'Department(s):':
        return 'departments'
    elif first == 'Restriction(s):':
        return 'restrictions'
    elif first == 'Prerequisite(s):':
        return 'prerequisites'
    elif first == 'Location(s):':
        return 'locations'
    elif first == 'Offering(s):':
        return 'offerings'
    elif first == 'Equate(s):':
        return 'equates'
    elif first == 'Co-requisite(s):':
        return 'corequisites'


def escape(string):
    '''
    >>> escape('This "string" will be escaped')
    'This \\\\"string\\\\" will be escaped'
    '''

    return string.replace('"', '\\"')


if __name__ == '__main__':

    lines = []
    if len(sys.argv) == 2:
        input_file_name = sys.argv[1]
        # Check that file exists
        try:
            # open up the pdftotext pdf file
            with open(input_file_name) as f:
                lines = f.readlines()
        except Exception as e:
            print(f'error: {e}')
            exit()
    else:
        # No file given for input
        print(f"usage: python3 {__main__.__file__} INPUT_FILE")
        exit()

    lines = list(map(lambda x: x.strip(), lines))

    # list of all the courses (each being a list of lines of text)
    courses = []
    # list of the current course being parsed
    course = []

    for l in lines:
        # starting line looks like XYZW*000...
        if is_course_starting_line(l):
            courses.append(course)
            course = []
        course.append(l)
        # When on the last line of the list, add the current course
        if l == lines[-1]:
            courses.append(course)

    # now we have all courses split up and parsed
    # next step is to crop out everything after Revision: lines
    # this is known as the Jacob Palmer Method
    # see: https://en.wikipedia.org/wiki/Jacob_Palmer_Method

    for courses_i, c in enumerate(courses):
        for course_line_i, line in enumerate(c):
            if line == "Revision: 2020-2021 Undergraduate Calendar" or line == "2020-2021 Undergraduate Calendar Revision:":
                # del just slaps out the line without making a new list like
                # ranging would do
                del c[course_line_i:]

    # the stdout will be a json file, so starting er off here
    print('''{
    "courses": [''')

    for course_index, c in enumerate(courses[1:]):
        # this epic regex is scientifically designed to break apart all
        # the pieces the first line of each course contains
        m = re.search(
            r'^([A-Z]{2,4}\*[0-9]{4})(.*)\s([^\s]+)\s([^\s]+)\s([^s]+)', c[0])

        # this shouldn't be entered, but if it is it means the regex
        # above is broken
        if m is None:
            print("goofball")
            print(c)
            exit()

        code, title, semester, load, credit = m.groups()

        # Find where the description ends
        end_desc = 0
        for i, line in enumerate(c):
            if starts_with_a_key_term(line):
                end_desc = i
                break

        # Concatenate the description
        description = ' '.join(c[1:end_desc])

        # remaining contains all the lines after the description ends
        remaining = c[end_desc:]

        # Now we'll get all the different texts that follow stuff like
        # Prerequisite(s): and Co-requisite(s): and put them in a dict
        # with keys like prerequisites and corequisites.

        # The first step is to organize them
        organized = []
        cur = ''
        for line in remaining:
            if starts_with_a_key_term(line):
                organized.append(cur.strip())
                cur = ''
            cur += line
            cur += ' '

            # When on the last line of remaining, add the last key term
            if line == remaining[-1]:
                organized.append(cur.strip())

        # The second step is to dictionaryify them
        organized_dictionary = defaultdict(lambda: '')
        for line in organized[1:]:
            # if there is a course with multiple Restriction(s): then both
            # will be available
            if organized_dictionary[key_term_from_string(line)] == '':
                organized_dictionary[key_term_from_string(line)] = line
            else:
                organized_dictionary[key_term_from_string(line)] += ' ' + line

        code = code.strip()
        title = escape(title).strip()
        semester = semester.strip()
        load = load[1:-1].strip()
        credit = credit[1:-1].strip()
        description = escape(description).strip()
        departments = escape(organized_dictionary['departments']).strip()
        restrictions = escape(organized_dictionary['restrictions']).strip()
        prerequisites = escape(organized_dictionary['prerequisites']).strip()
        locations = escape(organized_dictionary['locations']).strip()
        offerings = escape(organized_dictionary['offerings']).strip()
        equates = escape(organized_dictionary['equates']).strip()
        corequisites = escape(organized_dictionary['corequisites']).strip()

        # mentions is a list of courses that apper in the entire course
        # text
        mentions = retrieve_course_codes(description + ' '.join(remaining))
        mentions = list_of_strings_as_json_string(mentions)
        # prereq_mentions is a list of courses that appear in the
        # prerequisites text
        prerequisites_mentions = retrieve_course_codes(prerequisites)

        # remove courses from their own prerequisites (currently applies
        # to only MCS*2600)
        if code in prerequisites_mentions:
            prerequisites_mentions.remove(code)

        prerequisites_mentions = list_of_strings_as_json_string(
            prerequisites_mentions)

        print(f'''        {{
            "code": "{code}",
            "title": "{title}",
            "semester": "{semester}",
            "load": "{load}",
            "credit": "{credit}",
            "description": "{description}",
            "departments": "{departments}",
            "restrictions": "{restrictions}",
            "prerequisites": "{prerequisites}",
            "locations": "{locations}",
            "offerings": "{offerings}",
            "equates": "{equates}",
            "corequisites": "{corequisites}",
            "mentions": {mentions},
            "prerequisites_mentions": {prerequisites_mentions}
        }}''', end='')

        if course_index != len(courses) - 2:
            print(',')

    print('\n    ]\n}')
