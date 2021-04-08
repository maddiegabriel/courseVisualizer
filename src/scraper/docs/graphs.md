# Generate CSV's & Build Gephi Graph

  

Here's some doucmentation for how to generate CSV's for Gephi, import those CSV's, and build graphs in Gephi.

  

### Generate CSV's of course prerequisites for Gephi

  

1. Clone repo

  

2. `cd src/csv`

  

3. `python generate_csv.py ../parser.json ../scraper.json`

- `parser.json` is the file created from running the parser ([instructions](./parser.md)).
- `scraper.json` is the file created from running the scraper ([instructions](./scraper.md)).

4. A menu will appear as follows. Enter your choice.
```
CSV MENU
------------------------------------
Press 1 to generate CSV for ALL courses
Press 2 to generate CSV for CEPS courses
Press 3 to generate CSV for SOLAL courses
Press 4 to generate CSV for a custom set of courses
Press 5 to exit
Choice:
```
5. If you chose option 4 to generate CSV's for a custom set of courses, fill in your desired course codes like so and press enter. If you enter nothing, the CSV will be created for all courses,.
```
Enter course codes to include (comma separated): CIS, STAT, MATH
```
6. At this point, your two CSV's have been created. The menu loops, if you would like to generate different CSV's (please note that this will overwrite your current results).
```
Nodes exported to out/course_nodes.csv!
Edges exported to out/course_edges.csv!
```
- `/out/course_nodes.csv` contains all unique course nodes for your selection.
- `/out/course_edges.csv` contains all prerequisite edges between courses.


### CSV Formats

#### **course_nodes.csv**

This CSV contains all unique course nodes for your selection. Each line of the CSV represents one course.

The fields are:
- `Id` = the unique course code (e.g. "CIS*4250")
- `Label` = the label which will show in the node on the Gephi graph. For this sprint, that is "CODE (AVAIL/CAPACITY)" (e.g. "CIS*4250 (180/1390)")
- `Fullness` = the current 'fullness' level of the course. This integer from 0-4 represents a category based on the percentage which the course is full of students:
	- 0 means 100% full
	- 1 means >= 90% full
	- 2 means >= 75% full
	- 3 means >= 50% full
	- 4 means < 50% full

```
Id, Label, Fullness
ACCT*1220, ACCT*1220 (180/1390), 2
ACCT*2230, ACCT*2230 (324/1240), 3
ACCT*3280, ACCT*3280 (43/160), 3
ACCT*3330, ACCT*3330 (102/360), 3
```

#### **course_edges.csv**
This CSV contains all unique course nodes for your selection. Each line of the CSV represents one course.

The fields are:
- `Source` = the current course code (e.g. "CIS*4250")
- `Target` = the code of a course which is a prerequisite of Source
- `Type` = the type of relationship (always "Directed" here)
- `Weight` = the weight of the edge (always "1" here)
```
Source, Target, Type, Weight
ACCT*1240, ACCT*1220, Directed, 1
ACCT*1240, ACCT*2220, Directed, 1
ACCT*2230, ACCT*1220, Directed, 1
ACCT*2230, ACCT*2220, Directed, 1
```

  

### Generate Gephi Course Graphs

If you follow these instructions, you will end up with a Gephi graph visualizing the prerequisite dependencies between a group of U of G courses.

 1. Follow above steps to generate a CSV of courses

 2. Install Gephi from https://gephi.org/

 3. Open Gephi and click File > Import Spreadsheet. Choose your CSV file from Step 1.

 4. Fill these settings, then click 'next':

 - Separator: Comma

- Import as: Adjacency List

- Charset: UTF-8

 5. Fill these settings then click 'finish':

- Time Representation: Intervals

 6. Fill these settings then click 'ok':

 - Graph Type: Directed

- New Workspace

 7. At this point, if your CSV is valid, the Graph window should be showing a dense cluster of black nodes. Click Windows > Graph if you don't see this.

 8. To make your graph legible:
	 8.1. Under "Layout" on the left, select a graph layout (we like Force Atlas or Fruchterman Reingold, but feel free to experiment)

	8.2. Adjust options as you wish, then hit "Run".

	8.3. Once the graph stabilizes, click "Stop". It could take up to 8 minutes for the CSV of all courses.

	8.4. If nodes are overlapping, apply the "Noverlap" layout on top to fix.

 9. To style your graph:

 - **Colour**: In the bottom left of the "Graph" window, click the lightbulb to adjust the background colour. You can also adjust node and edge colours under the "Appearance" window in the top left. Click "Apply" to apply your changes to the graph.

 - **Text**: On the bottom bar, click the black "T" icon to show course code labels on nodes. Click the "Av" icon > "Node Size" to scale labels proportionally to node size. Use the slider to adjust text size, and the icons beside it to change to colour and font.

 - **Sizing**: It's helpful to size your nodes proportionally to the number of prerequisites the course has. In the top left, under "Appearance", click "Nodes" then the icon with 3 overlapping circles. Click "Ranking" > "In Degree". Set the min size to 10 and the max size to 95, then click "Apply". You can also use the leftmost slider to adjust the weight of the edges.
 
### Example Graph Result
Here is an example of a course prerequisite dependency graph we created for all the CEPS courses at Guelph. We used our script to generate a CSV of edges, which we imported into Gephi to build a graph.

<img src="https://git.socs.uoguelph.ca/acarscad/course-calendar/-/raw/master/graphs/ceps_courses_fruchterman.PNG" width="600" />

### Generate Gephi Course Graphs with Node and Edge Files

If you follow these instructions, you will end up with a Gephi graph visualizing the prerequisite dependencies between a group of U of G courses.

1. Follow above steps to generate a CSV of courses

2. Install Gephi from https://gephi.org/

3. Open Gephi and click File > Import Spreadsheet. Choose your CSV node file.

4. Fill these settings, then click 'next':

 - Separator: Comma

- Import as: Nodes Table

- Charset: UTF-8

5. Fill these settings then click 'finish':

- Time Representation: Intervals

6. Fill these settings then click 'ok':

 - Graph Type: Directed

 - Append to existing workspace

7. Open Gephi and click File > Import Spreadsheet. Choose your CSV edge file.

8. Fill these settings, then click 'next':

 - Separator: Comma

 - Import as: Edges Table

 - Charset: UTF-8

9. Fill these settings then click 'finish':

 - Time Representation: Intervals

10. Fill these settings then click 'ok':

 - Graph Type: Directed

 - Append to existing workspace
