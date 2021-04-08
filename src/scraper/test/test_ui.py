import sys
sys.path.append("../src/searcher")
from io import StringIO
import ui as app
import json
import unittest
import unittest.mock


class TestUIMethods(unittest.TestCase):

    @unittest.mock.patch('builtins.input', side_effect=["1", "3"])                                                                                                                          
    def test_choice_one(self, mock): 
        courses = '{ "code":"", "title":"", "semester":"", "credit":"", "load":"", "description":"", "departments":"", "prerequisites":"", "restrictions":"" }'
        capturedOutput = StringIO()
        sys.stdout = capturedOutput  
        output = app.userInput(courses)
        sys.stdout = sys.__stdout__
        self.maxDiff = None
        expectedOutput = "\nMAIN MENU\n------------------------------------\nPress 1 for help\nPress 2 to search\nPress 3 to exit\n\nABOUT\n------------------------------------\nThis application allows University of Guelph students to easily \nsearch through all university course offerings for the current year.\n\nInstructions:\nAfter selecting option 2, you will be prompted to enter\ncertain information such as the course code or credit amount.\nIf you do not want to filter by one of the prompted fields\njust press Enter to skip it. Once complete, all search results are displayed.\nYou can then select to make a new search query or save the results\nto a file.\n\n\nMAIN MENU\n------------------------------------\nPress 1 for help\nPress 2 to search\nPress 3 to exit\n\n*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\nGoodbye! Have a nice day!\n*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n"
        self.assertEqual(capturedOutput.getvalue(),expectedOutput)                                                                                                                                              
    
    @unittest.mock.patch('builtins.input', side_effect=["2","","","","","","3","3","3"])                                                                                                                          
    def test_choice_two(self, mock): 
        courses = '{ "code":"", "title":"", "semester":"", "credit":"", "load":"", "description":"", "departments":"", "prerequisites":"", "restrictions":"" }'
        capturedOutput = StringIO()
        sys.stdout = capturedOutput   
        output = app.userInput(courses)
        sys.stdout = sys.__stdout__
        self.maxDiff = None
        expectedOutput = "\nMAIN MENU\n------------------------------------\nPress 1 for help\nPress 2 to search\nPress 3 to exit\n\nSEARCH\n------------------------------------\nIf you do not wish to fill a field, press Enter to skip it.\n\nSEARCH RESULTS\n------------------------------------\nNo results for your search! Please try again.\n\n\n------------------------------------\nPress 1 to export results\nPress 2 to perform another search\nPress 3 to return to the main menu\n\nMAIN MENU\n------------------------------------\nPress 1 for help\nPress 2 to search\nPress 3 to exit\n\n*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\nGoodbye! Have a nice day!\n*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nMAIN MENU\n------------------------------------\nPress 1 for help\nPress 2 to search\nPress 3 to exit\n\n*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\nGoodbye! Have a nice day!\n*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n"
        self.assertEqual(capturedOutput.getvalue(),expectedOutput)

    @unittest.mock.patch('builtins.input', side_effect=["3"])                                                                                                                          
    def test_choice_three(self, mock): 
        courses = '{ "code":"", "title":"", "semester":"", "credit":"", "load":"", "description":"", "departments":"", "prerequisites":"", "restrictions":"" }'
        capturedOutput = StringIO()
        sys.stdout = capturedOutput   
        output = app.userInput(courses)
        sys.stdout = sys.__stdout__
        self.maxDiff = None
        expectedOutput = "\nMAIN MENU\n------------------------------------\nPress 1 for help\nPress 2 to search\nPress 3 to exit\n\n*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\nGoodbye! Have a nice day!\n*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n"
        self.assertEqual(capturedOutput.getvalue(),expectedOutput)

if __name__ == '__main__':
    unittest.main()
