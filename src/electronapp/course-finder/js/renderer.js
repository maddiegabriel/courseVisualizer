// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

function collectSearchQuery() {
  document.querySelector('#submitButton').addEventListener('click', function () {
    const searchJSON = { search: { subject: '', code: '', title: '', semester: '', weight: '', department: '' } }

    searchJSON.search.subject = document.getElementById('subject').value
    searchJSON.search.code = document.getElementById('code').value
    searchJSON.search.title = document.getElementById('title').value
    searchJSON.search.semester = document.getElementById('semester').value
    searchJSON.search.weight = document.getElementById('weight').value
    searchJSON.search.department = document.getElementById('department').value

    console.log('Search request: ' + JSON.stringify(searchJSON))

    window.api.send('toMain', searchJSON)

    window.api.receive('fromMain', (data) => {
      console.log(`Received ${data} from main process`)
    })

    window.location.replace('results.html')
  })
}

function displayCourses() {
  // back button
  document.querySelector('#backButton').addEventListener('click', function () {
    window.location.replace('index.html')
  })

  const table = document.getElementById('courseTable').getElementsByTagName('tbody')[0]

  window.api.send('toMainResults', 'requestResults')

  window.api.receive('fromMain', (json) => {
    newJson = JSON.parse(json)
    data = newJson.courses
    sections = newJson.sections

    let profName;
    let i=0;

    // clear table each search
    while (table.rows.length > 0) {
      table.deleteRow(0)
    }

    // create one row per course in the search result
    for (let code of Object.keys(data)) {
      let course = data[code];

      // skip if null course
      if (course === null) continue

      let avail = 0; let capac = 0
      let currentCode = ''

      // Adds all availaibility & capacity info for each course using the sections part of the json
      for (let sectionCode of Object.keys(sections)) {
        let section = sections[sectionCode];
        currentCode = section['code']['type'] + '*' + section['code']['number']
        if (currentCode == code) {
          profName = section['faculty']
          if (parseInt(section['available']) != null && parseInt(section['capacity'])) {
            avail += parseInt(section['available'])
            capac += parseInt(section['capacity'])
          }
        }
      }

      // grab table from results.html and insert a new row
      const len = table.rows.length
      const row = table.insertRow(len)
      row.setAttribute('course', course['code'])

      // populate each column of this row with correct data
      row.insertCell(0).innerHTML = course['code']
      row.insertCell(1).innerHTML = course['title']
      row.insertCell(2).innerHTML = course['semester']
      row.insertCell(3).innerHTML = course['credit']
      row.insertCell(4).innerHTML = course['description']
      row.insertCell(5).innerHTML = profName;
      if(!profName.includes('TBA')) {
        table.rows[i].cells.item(5).innerHTML += '<br><br><button type="button" class="profButton" value="' + profName + "#" + course['departments']+ '">View Photo!</button><br><br></br>';
      }
      row.insertCell(6).innerHTML = course['departments']
      if (course['prerequisites'] != '') {
        row.insertCell(7).innerHTML = course['prerequisites'] + '<br><br><button type="button" class="treeButton" value="' + course.code + '">View Prerequisite Tree!</button><br><br>'
      } else {
        row.insertCell(7).innerHTML = "This course has no prerequisites!"
      }
      row.insertCell(8).innerHTML = avail + ' / ' + capac
      i++;
    }

    // once table populated, build graph!
    buildForceGraphJSON(newJson)

    $(document).ready(function () {
      // add table pagination/search
      const t = $('#courseTable').DataTable()

       // enable zooming on graph
    const svgElement = document.querySelector('.course_visualization')
    const zoomyzoom = svgPanZoom(svgElement, { minZoom: 0, maxZoom: 800, center: true })


    })

  })

  // event listener for button in table
  $('#courseTable tbody').on('click', '.treeButton', function () {
    let code = $(this).attr("value");
    // Set default
    let d3JSON = { "id": "CIS*4650", "children": [{ "id": "CIS*2030", "children": [{ "id": "CIS*1910" }, { "id": "CIS*2500", "children": [{ "id": "CIS*1300" }] }] }, { "id": "CIS*3110", "children": [{ "id": "CIS*2030", "children": [{ "id": "CIS*1910" }, { "id": "CIS*2500", "children": [{ "id": "CIS*1300" }] }] }, { "id": "CIS*2520", "children": [{ "id": "CIS*2500", "children": [{ "id": "CIS*1300" }] }, { "id": "CIS*1910" }] }] }, { "id": "CIS*3150", "children": [{ "id": "CIS*3490", "children": [{ "id": "CIS*1910" }, { "id": "CIS*2520", "children": [{ "id": "CIS*2500", "children": [{ "id": "CIS*1300" }] }, { "id": "CIS*1910" }] }] }, { "id": "CIS*2750", "children": [{ "id": "CIS*2430", "children": [{ "id": "CIS*2500", "children": [{ "id": "CIS*1300" }] }] }, { "id": "CIS*2520", "children": [{ "id": "CIS*2500", "children": [{ "id": "CIS*1300" }] }, { "id": "CIS*1910" }] }] }] }] };
    console.log('clicked tree button ' + code)

    // open modal with title
    $('#myModal').modal('show')
    $('#myModalTitle').html(code + ' Prerequisite Dependency Tree')

    window.api.send('toResults', code)

    window.api.receive('fromResults', (data) => {
      console.log(`Received ${data} from results process`)
      graphTreeDiagram(JSON.parse(data));
    })
    
  })

  // clear graph when modal closes
  $('.closeTree').on('click', function () {
    d3v4.selectAll("#tree_graph g").remove();
  })

  // event listener for button in table
  $('#courseTable tbody').on('click', '.profButton', function () {
    let values = $(this).attr("value").split("#");
    let profName = values[0];
    let dept = values[1].split(":");
    department = dept[1];

    let tb = $('#courseTable').DataTable();

    // Set default
    console.log('clicked prof button ' + values)

    let searchTerm = "dr " +  profName + " university of guelph " + department;
    window.api.send('toImage', searchTerm)      
  
    window.api.receive('fromImage', (data) => {
      let response = JSON.parse(data)
      if(response['value']) {
        console.log(`PROF IMAGE ${response['value'][0]['contentUrl']}`)
        let url = response['value'][0]['contentUrl'];
        // open modal with title
        $('#imageModalBody').html("<center><img src='" + url + "' width='600' style='border-radius:10px;'></center>")
        $('#imageModal').modal('show')
        $('#imageModalTitle').html('Dr. ' + profName + ' at the University of Guelph')
      }
    })
    
  })
  
}
