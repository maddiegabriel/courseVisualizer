import json
from search import search
import display_export as de


def start():
    """
        Start the application and loads json to be searched through.
        Parameters: none
        Returns: none
    """
    print("\n*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*")
    print("University of Guelph Course Finder")
    print("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*")

    # parser/out.json holds the results of the parsing of all courses
    courses = open('../parser.json')
    userInput(json.load(courses))


def userInput(coursesJson):
    """
        Gather user's action of choice from a simple command line menu. Call appropriate function to fulfill action.
        Parameters: none
        Returns: none
    """
    choice = ''
    while (choice != '3'):
        print("\nMAIN MENU")
        print("------------------------------------")
        print("Press 1 for help")
        print("Press 2 to search")
        print("Press 3 to exit")
        choice = input("Option: ")
        if (choice == '1'):
            helpMenu()
        elif (choice == '2'):
            searchSelected(coursesJson)
        elif (choice == '3'):
            print("\n*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*")
            print("Goodbye! Have a nice day!")
            print("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*")
            exit()
        else:
            print("Wrong input - please try again!")


def helpMenu():
    """
        Display the help menu to the user.
        Parameters: none
        Returns: none
    """
    print("\nABOUT")
    print("------------------------------------")
    print("This application allows University of Guelph students to easily ")
    print("search through all university course offerings for the current year.")
    print("\nInstructions:")
    print("After selecting option 2, you will be prompted to enter")
    print("certain information such as the course code or credit amount.")
    print("If you do not want to filter by one of the prompted fields")
    print("just press Enter to skip it. Once complete, all search results are displayed.")
    print("You can then select to make a new search query or save the results")
    print("to a file.\n")


def searchSelected(coursesJson):
    """
        Gather user's search fields, call function to perform search, call function to display results, and prompt user for next action.
        Parameters: none
        Returns: none
    """
    choice = ''
    print("\nSEARCH")
    print("------------------------------------")
    print("If you do not wish to fill a field, press Enter to skip it.")
    code = input("Enter course code: ")
    title = input("Enter course title: ")
    credit = input("Enter credit weight: ")
    semester = input("Enter semester (W, F, S): ")
    department = input("Enter department: ")

    # build an object using user input to send data to search function
    json_obj = {
        "code": code,
        "title": title,
        "credit": credit,
        "semester": semester,
        "departments": department,
    }

    # perform search and display search results
    print('\nSEARCH RESULTS')
    print("------------------------------------")
    results = search(json_obj, coursesJson)
    de.displayCourses(results)

    # display menu post search
    while (choice != '3'):
        print("\n------------------------------------")
        print("Press 1 to export results")
        print("Press 2 to perform another search")
        print("Press 3 to return to the main menu")
        choice = input("Option: ")
        if (choice == '1'):
            de.exportToJsonFile(results)
        elif (choice == '2'):
            searchSelected(coursesJson)
        elif (choice == '3'):
            userInput(coursesJson)
        else:
            print("Wrong input. Please try again")


# Start application by calling userInput()
start()

# To stop running of these functions whening UI class is imported
if __name__ == "__main__":
    start()
    userInput()
    searchSelected()
