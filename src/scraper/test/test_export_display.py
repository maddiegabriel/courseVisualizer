import sys
sys.path.append("../src/searcher")

import display_export as ui
import unittest

import json



class TestDisplayMethods(unittest.TestCase):

    def test_one_export_result(self):
        toExportJson = '{ "code":"CIS*4250", "title":"", "semester":"", "credit":"", "load":"", "description":"", "departments":"", "prerequisites":"", "restrictions":"" }'
        expected = json.loads(toExportJson)['code']
        resultsArray = []
        resultsArray.append(json.loads(toExportJson))

        ui.exportToJsonFile(resultsArray)

        with open("../out/courses_out.json") as json_file:
            json_data = json.load(json_file)
        actual = json_data[0]['code']

        self.assertEqual(expected, actual)

    def test_empty_export(self):
        toExportJson = '{}'
        result = json.loads(toExportJson)
        ui.exportToJsonFile(result)

        with open("../out/courses_out.json") as json_file:
            json_data = json.load(json_file)

        self.assertEqual(json_data, result)

    def test_multiple_export_result(self):
        toExportJson = '{ "code":"CIS*4250", "title":"", "semester":"", "credit":"", "load":"", "description":"", "departments":"", "prerequisites":"", "restrictions":"" }'
        toExportJson_2 = '{ "code":"CIS*3760", "title":"Software Engineering", "semester":"", "credit":"", "load":"", "description":"", "departments":"", "prerequisites":"", "restrictions":"" }'
        toExportJson_3 = '{ "code":"ACCT*1220", "title":"", "semester":"F,W", "credit":"", "load":"", "description":"", "departments":"", "prerequisites":"", "restrictions":"" }'
        resultsArray = []
        resultsArray.append(json.loads(toExportJson))
        resultsArray.append(json.loads(toExportJson_2))
        resultsArray.append(json.loads(toExportJson_3))
        ui.exportToJsonFile(resultsArray)

        with open("../out/courses_out.json") as json_file:
            json_data = json.load(json_file)

        self.assertEqual(json_data, resultsArray)


if __name__ == '__main__':
    unittest.main()
