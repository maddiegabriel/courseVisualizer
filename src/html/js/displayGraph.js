//
// Function to build and display a d3.js force graph using CodeFlower
// Builds graoh from the JSON given
// Arguments: none
// Returns: none
//
function graphForceTree (d3JSON) {
  let currentCodeFlower
  const createCodeFlower = function (d3JSON) {
    // remove previous flower to save memory
    if (currentCodeFlower) currentCodeFlower.cleanup()

    // set size of box around graph
    let w = 1350; let h = 1350

    // increase SVG size if the graph is a big boi
    if (Object.keys(d3JSON.children).length > 200) {
      w = 6000
      h = 6000
    }

    // create a new CodeFlower from the given json
    currentCodeFlower = new CodeFlower('#visualization', w, h).update(d3JSON)
  }

  // build new d3.js graph using codeflower
  createCodeFlower(d3JSON)
}

//
// Function to build a JSON in the proper format for d3.js force-directed tree graph
// Passes JSON to graphForceTree to build visualiztion
// Arguments: none
// Returns:
//            d3JSON (JSON of courses to be graphed)
//
function buildForceGraphJSON () {
  // grab courses from localStorage
  const data = JSON.parse(window.localStorage.getItem('courses'))
  const sections = JSON.parse(window.localStorage.getItem('sections'))

  // build json for d3.js force directed tree aph
  // root node is always central 'Search Results'
  const d3JSON = {
    name: 'Search Results',
    parent: true,
    size: data.length,
    children: addChildren(data, sections)
  }

  // console.log(d3JSON)
  graphForceTree(d3JSON)
}
 
//
// Function to return array of children (prerequisites) for a course
// Arguments:
//            results (JSON of all course results to be graphed)
// Returns:
//            children (array of child objects for final JSON)
//
function addChildren (results, sections) {
  const children = []
  for (let code of Object.keys(results)) {
    // error check for null course
    if (results[code] === null) continue

    let avail = 0; let capac = 0
    let currentCode = ''

    // Adds all availability & capacity info for each course using the sections part of the json
    for (let sectionCode of Object.keys(sections)) {
      let section = sections[sectionCode];
      currentCode = section['code']['type'] + '*' + section['code']['number']
      if (currentCode == code) {
        if (parseInt(section['available']) != null && parseInt(section['capacity'])) {
          avail += parseInt(section['available'])
          capac += parseInt(section['capacity'])
        }
      }
    }

    let prereqs = results[code]['prerequisites_mentions'];
  
    // build a new object for each course with at least a 'name' attribute
    const child = {
      name: code,
      parent: true,
      avail: avail,
      capac: capac,
      size: prereqs.length
    }

    // only add a 'children' attribute if course has prereqs
    if (prereqs.length) {
      child.children = []
      // append a new grandchild object for each prerequisite
      for (const prereq of prereqs) {
        const grandchild = {
          name: prereq,
          parent: false,
          avail: avail,
          capac: capac,
          size: 0
        }
        child.children.push(grandchild)
      }
      // append child to object being returned
      children.push(child)
    }
  }
  return children
}

// 
// Function to build a d3.js tree diagram using the given data
// Arguments:
//            data (the JSON data to use for the tree diagram)
// Returns: none
//
function graphTreeDiagram(data) {
    data = JSON.parse(data);
    let color = d3v4.scaleOrdinal(d3v4.schemeCategory20);
  
    // set the dimensions/margins of the diagram
    let margin = {top: 20, right: 90, bottom: 30, left: 90},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
  
    // sizes & appends a 'group' element to the SVG
    let svg = d3v4.select("#tree_graph");
    svg = svg
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    let i = 0, duration = 750, root;
  
    // Declares a tree layout
    let treemap = d3v4.tree().size([height, width]);
  
    // Assigns parent, children, and depth
    root = d3v4.hierarchy(data, function(d) { return d.children; });
    root.x0 = height / 2;
    root.y0 = 0;
  
    // Collapse up to the second level by default
    root.children.forEach(collapse);
  
    // pass root node to tree builder
    build_tree(root);
  
    // Collapse given node + all its children
    function collapse(d) {
        if(d.children) {
            d._children = d.children
            d._children.forEach(collapse)
            d.children = null
        }
    }
  
    // Returns a curved path from parent to child
    function diagonal(s, d) {
        return `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                ${(s.y + d.y) / 2} ${d.x},
                ${d.y} ${d.x}`
    }
  
    // Toggle children on click
    function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        build_tree(d);
    }
  
    function build_tree(source) {
  
        // Assigns the x/y position for the nodes
        let data = treemap(root);
  
        // Compute the new tree layout
        let nodes = data.descendants(),
            links = data.descendants().slice(1);
        nodes.forEach(function(d){ d.y = d.depth * 180});
  
        // UPDATE NODES
        let node = svg.selectAll('g.node')
            .data(nodes, function(d) {return d.id || (d.id = ++i); });
  
        // Enter any new nodes at the parent's previous position
        let nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr("transform", function(d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on('click', click);
  
        // Add circle for each node
        nodeEnter.append('circle')
            .attr('class', 'node')
            .attr('r', 40)
            .style("fill", function(d) { return d._children ? "#389aa5" : "#3879ab" ; })
  
        // Add label for each nodes
        nodeEnter.append('text')
            .attr("text-anchor", "middle")
            .text(function(d) { return d.data.id; });
  
        let nodeUpdate = nodeEnter.merge(node);
  
        // Update node position
        nodeUpdate.transition()
            .duration(duration)
            .attr("transform", function(d) { 
                return "translate(" + d.y + "," + d.x + ")";
            });
  
        // Update node style
        nodeUpdate.select('circle.node')
            .attr('r', 40)
            .style("fill", function(d) {
                return d._children ? "#389aa5" : "#3879ab";
            })
            .attr('cursor', 'pointer');
  
        // Remove any exiting nodes, reduce their size + remove label
        let nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();
        nodeExit.select('circle')
            .attr('r', 1e-6);
        nodeExit.select('text')
            .style('fill-opacity', 1e-6);
  
        // UPDATE LINKS
        let link = svg.selectAll('path.link')
            .data(links, function(d) { return d.id; });
  
        // Enter any new links at the parent's previous position
        let linkEnter = link.enter().insert('path', "g")
            .attr("class", "link")
            .attr('d', function(d){
                let o = {x: source.x0, y: source.y0}
                return diagonal(o, o)
            });
        let linkUpdate = linkEnter.merge(link);
  
        // Transition back to the parent element position
        linkUpdate.transition()
            .duration(duration)
            .attr('d', function(d){ return diagonal(d, d.parent) });
  
        // Remove any exiting links
        let linkExit = link.exit().transition()
            .duration(duration)
            .attr('d', function(d) {
                let o = {x: source.x, y: source.y}
                return diagonal(o, o)
            })
            .remove();
  
        // Store the old positions for transition
        nodes.forEach(function(d){
            d.x0 = d.x;
            d.y0 = d.y;
        });
  
    }
  }
  