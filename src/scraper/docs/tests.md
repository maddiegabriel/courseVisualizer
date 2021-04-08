# Tests

Here's some doucmentation for how to run the unit tests for this project.

### Run Search & Display & Parser & CSV Tests

We have created doc tests for all functionality.

To run our tests:

1. Clone repo

2. `cd src`

3. `./test`

  

### Run Export Tests

We have created unit tests for all the export functionality.

To run our tests:

1. Clone repo

2. `cd test`

3. `python3 -m unittest test_export_display.py`

  

### Run UI tests

We have created unit tests for the UI menu functionality.

To run our tests:

1. Clone repo

2. 'cd src/searcher'

3. Open the ui.py file and comment out the 'start()' and change the 'exit()' to 'break'

4. 'cd ../../test'

5. 'python3 -m unittest test_ui.py'

  

#### Example result

```

7 items passed all tests:

1 tests in course_parser.escape

5 tests in course_parser.is_course_code

4 tests in course_parser.is_course_starting_line

5 tests in course_parser.key_term_from_string

4 tests in course_parser.retrieve_course_codes

4 tests in course_parser.separate_words

4 tests in course_parser.starts_with_a_key_term

27 tests in 8 items.

27 passed and 0 failed.

Test passed.

```