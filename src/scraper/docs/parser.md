# Parser

Here's some doucmentation for how to set up and run the parser in `src/parser`.

### Convert PDF to Text File

Ensure that you have the c12.pdf in the parser directory and apt get

1. Clone repo

2. Get the pdf2txt dependencies with `sudo apt-get update && sudo apt-get install -y xpdf`

3. `cd src/parser`

4. `./pdf2txt` to create `c12.txt` which contains the text from the pdf.

> `Syntax Warning: Failed parsing hints table object` is an expected warning

4. After running this, you need to make a 1 line manual fix to the text file. Go to the following class in the file generated:  

```
BIOL*3680Wildlife Rehabilitation: Caring for Sick, Injured, and OrphanedWildlife

F (0-0) [0.50]
```

and remove the newline to create:

```
BIOL*3680Wildlife Rehabilitation: Caring for Sick, Injured, and OrphanedWildlife F (0-0) [0.50]
```


### Run Parser

1. Clone repo

2. `cd src/parser`

3. `python3 course_parser.py <input_file_name.txt>` which prints the results to stdout.

or

3. `python3 course_parser.py <input_file_name.txt> > ../parser.json` to write results to a file named parser.json under /src.

## Parser Results
The parser creates a new JSON file of course objects whose format is like this::
```
{
    "courses": [
        {
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
        },
        {
            "code": "ACCT*2230",
            "title": "Management Accounting",
            "semester": "F,W",
            "load": "3-0",
            "credit": "0.50",
            "description": "This course emphasizes the use of accounting information to facilitate effective management decisions. Topics include cost determination, cost control and analysis, budgeting, profit-volume analysis and capital investment analysis.",
            "departments": "Department(s): Department of Management",
            "restrictions": "Restriction(s): This is a Priority Access Course. Enrolment may be restricted to particular programs or specializations. See department for more information.",
            "prerequisites": "Prerequisite(s): ACCT*1220 or ACCT*2220",
            "locations": "",
            "offerings": "",
            "equates": "Equate(s): AGEC*2230 , BUS*2230",
            "corequisites": "",
            "mentions": ["ACCT*1220", "ACCT*2220", "AGEC*2230", "BUS*2230"],
            "prerequisites_mentions": ["ACCT*1220", "ACCT*2220"]
        }
    ]
}

```