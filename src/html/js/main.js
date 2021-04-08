//
// Function to collect search query from form when user clicks submit
// Arguments: none
// Returns: none
//
function collectSearchQuery () {
  document.querySelector('#submitButton').addEventListener('click', function () {
    const searchJSON = { search: { subject: '', code: '', title: '', semester: '', weight: '', department: '' } }

    searchJSON.search.subject = document.getElementById('subject').value
    searchJSON.search.code = document.getElementById('code').value
    searchJSON.search.title = document.getElementById('title').value
    searchJSON.search.semester = document.getElementById('semester').value
    searchJSON.search.weight = document.getElementById('weight').value
    searchJSON.search.department = document.getElementById('department').value

    console.log('Search request: ' + JSON.stringify(searchJSON))
    makeRequest(searchJSON)
  })
}

//
// Function to make POST request to API with search query
// Arguments:
//            data (search query JSON for body of POST request)
// Returns: none
//
function makeRequest (data) {
  // make POST request to /search endpoint
  fetch('http://cis4250-06.socs.uoguelph.ca:443/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      console.log('SUCCESS! Your results are: ', data)
      // add response to local storage for now
      localStorage.setItem('courses', JSON.stringify(data.courses))
	    localStorage.setItem('sections', JSON.stringify(data.sections))
      // load results page after successful request
      location.replace('results.html')
    })
    .catch((error) => {
      console.error('ERROR! Your error is: ', error)
    })
}

//
// Function to populate table on results page with course results
// Calls buildForceGraphJSON() to display graph
// Arguments:
//            results (response from API including courses to be displayed)
// Returns: none
//
function displayCourses () {
  // back button functionality
  document.querySelector('#backButton').addEventListener('click', function () {
    // clear local storage
    localStorage.setItem('courses', '[]')
    localStorage.setItem('sections', '[]')
    localStorage.setItem('node_positions', '{}')
    window.location.replace('index.team6.html')
  })

  // grab courses from localStorage
  const data = JSON.parse(window.localStorage.getItem('courses'))
  const sections = JSON.parse(window.localStorage.getItem('sections'))

  // grab table from results.html and clear it
  const t = document.getElementById('courseTable')
  const table = document.getElementById('courseTable').getElementsByTagName('tbody')[0]
  while (table.rows.length > 1) {
    table.deleteRow(1)
  }
  let profName;
  let i=0;

  // create one row per course in the search result
  for (let code of Object.keys(data)) {

    let course = data[code];
  
    // error check for null course
    if (course === null) continue

    let avail = 0; let capac = 0
    let currentCode = ''

    // Adds all availaibility & capacity info for each course using the
    // sections part of the json
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
    if(course['prerequisites'] != '') {
      row.insertCell(7).innerHTML = course['prerequisites'] + '<br><br><button type="button" class="treeButton" value="' + course.code + '">View Prerequisite Tree!</button><br><br>'
    } else {
      row.insertCell(7).innerHTML = "This course has no prerequisites!"
    }
    row.insertCell(8).innerHTML = avail + ' / ' + capac;
    i++;
  }

  // after populating table, generate d3 visualization underneath
  buildForceGraphJSON()
  const node_positions = JSON.parse(localStorage.getItem('node_positions'))
  $(document).ready(function () {
    // add table pagination/search
    const t = $('#courseTable').DataTable()

    // enable zooming on graph
    const svgElement = document.querySelector('.course_visualization')
    const zoomyzoom = svgPanZoom(svgElement, { minZoom: 0, maxZoom: 800, center: true })
    // zoom out if the graph is a big boi
    if (data.length > 200) {
      zoomyzoom.zoomAtPointBy(0.15, { x: node_positions['Search Results'].x - 2600, y: node_positions['Search Results'].y - 2600 })
    }

    // on click for each row
    $('#courseTable tbody').on('click', 'tr', function () {
      const data = t.row(this).data()
      const code = data[0]
      console.log('ROW CLICKED!!!! ' + code)

      // reset from previous zoom
      zoomyzoom.fit()
      zoomyzoom.center()

      // zoom in on node position
      document.querySelector('.course_visualization').querySelector('rect').setAttribute('width', 1200)
      zoomyzoom.updateBBox()
      zoomyzoom.zoomAtPointBy(2, { x: node_positions[code].x, y: node_positions[code].y })
    })

    // event listener for button in table
    $('#courseTable tbody').on('click', '.treeButton', function () {
      let code = $(this).attr("value");
      console.log('clicked tree button ' + code)

      // open modal with title
      $('#myModal').modal('show')
      $('#myModalTitle').html(code + ' Prerequisite Dependency Tree')

      // hit /tree endpoint to get d3 json for this course then build graph
      buildTreeDiagramJSON(code)           
    })

    // clear graph when modal closes
    $('.closeTree').on('click', function () {
      d3v4.selectAll("#tree_graph g").remove();
    })

    // download buttons
    const downloadSVG = document.querySelector('#downloadSVG');
    downloadSVG.addEventListener('click', downloadSVGAsText);
    const downloadPNG = document.querySelector('#downloadPNG');
    downloadPNG.addEventListener('click', downloadSVGAsPNG);
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

    let searchTerm = "dr " +  profName + " university of guelph" + department;
    let Url = 'https://api.bing.microsoft.com/v7.0/images/search' + '?q=' + encodeURIComponent(searchTerm);

    console.log('hitting ' + Url)
    // make GET request to /key endpoint
    $.ajax({
      url: 'http://cis4250-06.socs.uoguelph.ca:443/key',
      type:"GET",
      success: function(result){
        $.ajax({
          url: Url,
          type: 'GET',
          beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",result);
          },
          success: function(data){ 
            // let json = JSON.parse(data)
            if(data['value']) {
              console.log(`PROF IMAGE ${data['value'][0]['contentUrl']}`)
              let imageUrl = data['value'][0]['contentUrl'];
              $('#imageModalBody').html("<center><img src='" + imageUrl + "' width='600' style='border-radius:10px;'></center>")
              $('#imageModal').modal('show')
              $('#imageModalTitle').html('Dr. ' + profName + ' at the University of Guelph')    
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
          }
        })
      },
      error:function(error){
        console.log(`ERR ${JSON.stringify(error)}`)
      }
    })
  })
}

//
// Function to make GET request to /key API endpoint
// Arguments: none
// Returns: none
//
function getKey () {
  
}

//
// Function to make GET request to /tree API endpoint with course code
// Arguments:
//            code (string for course code)
// Returns: none
//
function buildTreeDiagramJSON (code) {
  // make GET request to /tree/code endpoint
  let Url = 'http://cis4250-06.socs.uoguelph.ca:443/tree/'+ code;
  console.log('hitting ' + Url)
  $.ajax({
    url: Url,
    type:"GET",
    success: function(result){
      console.log('graphing ' + result);
      // call function to build d3 tree diagram using JSON
      graphTreeDiagram(result);
    },
    error:function(error){
      console.log(`ERR ${JSON.stringify(error)}`)
    }
  })
}

//function to encode svg as 64bit string
//Arguments: none
//returns: none
function downloadSVGAsText() {
  const svg = document.querySelector('svg');
  const base64doc = btoa(unescape(encodeURIComponent(svg.outerHTML)));
  const a = document.createElement('a');
  const e = new MouseEvent('click');
  a.download = 'download.svg';
  a.href = 'data:image/svg+xml;base64,' + base64doc;
  a.dispatchEvent(e);
}

//function to download svg as png
//Arguments: e
//returns: none
function downloadSVGAsPNG(e){
  const canvas = document.createElement("canvas");
  const svg = document.querySelector('svg');
  const base64doc = btoa(unescape(encodeURIComponent(svg.outerHTML)));
  const w = parseInt(svg.getAttribute('width'));
  const h = parseInt(svg.getAttribute('height'));
  const img_to_download = document.createElement('img');
  img_to_download.src = 'data:image/svg+xml;base64,' + base64doc;
  console.log(w, h);

  img_to_download.onload = function () {    
    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);
    const context = canvas.getContext("2d");
    context.drawImage(img_to_download,0,0,w,h);
    const dataURL = canvas.toDataURL('image/png');
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(canvas.msToBlob(), "download.png");
      e.preventDefault();
    } else {
      const a = document.createElement('a');
      const my_evt = new MouseEvent('click');
      a.download = 'download.png';
      a.href = dataURL;
      a.dispatchEvent(my_evt);
    }
  }  
}