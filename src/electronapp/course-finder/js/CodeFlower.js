const CodeFlower = function (selector, w, h) {
  this.w = w
  this.h = h

  d3.select(selector).selectAll('svg').remove()

  this.svg = d3.select(selector).append('svg:svg')
    .attr('width', w)
    .attr('height', h)
    .attr('class', 'course_visualization')

  this.svg.append('svg:rect')
    .attr('width', w)
    .attr('height', h)

  this.force = d3.layout.force()
    .on('tick', this.tick.bind(this))
    .charge(function (d) { return -3000 })
    .linkDistance(function (d) { return d.target._children ? 60 : 40 })
    .size([h, w])

  // download svg file as PNG
  d3.select("#downloadPNG")
    .on('click', function () {
      let course_visualization_svg = document.getElementsByClassName("course_visualization")[0]
      // Get the d3js SVG element and save using saveSvgAsPng.js
      saveSvgAsPng(course_visualization_svg, "course_visualization.png", { scale: 1, backgroundColor: "#FFFFFF" });
    })

  // download svg file as SVG
  d3.select("#downloadSVG")
    .on('click', function () {
      let course_visualization_svg = document.getElementsByClassName("course_visualization")[0]
      let config = {
        filename: 'course_visualization',
      }
      d3_save_svg.save(course_visualization_svg, config);
    })

    

}

CodeFlower.prototype.update = function (json) {
  if (json) this.json = json

  this.json.fixed = true
  this.json.x = this.w / 2
  this.json.y = this.h / 2

  const nodes = this.flatten(this.json)
  const links = d3.layout.tree().links(nodes)
  const total = nodes.length || 1

  // remove existing text (will readd it afterwards to be sure it's on top)
  this.svg.selectAll('text').remove()

  // Restart the force layout
  this.force
    .gravity(Math.atan(total / 50) / Math.PI * 0.6)
    .nodes(nodes)
    .links(links)
    .start()

  // Update the links
  this.link = this.svg.selectAll('line.link')
    .data(links, function (d) { return d.target.name })

  // Enter any new links
  this.link.enter().insert('svg:line', '.node')
    .attr('class', 'link')
    .attr('x1', function (d) { return d.source.x })
    .attr('y1', function (d) { return d.source.y })
    .attr('x2', function (d) { return d.target.x })
    .attr('y2', function (d) { return d.target.y })

  // Exit any old links
  this.link.exit().remove()

  // Update the nodes
  this.node = this.svg.selectAll('circle.node')
    .data(nodes, function (d) { return d.name })
    .classed('collapsed', function (d) { return d._children ? 1 : 0 })

  this.node.transition()
    .attr('r', function (d) { return d.children ? 45 : Math.pow(d.size * 100, 2 / 5) * 20 || 30 })

  // Enter any new nodes
  this.node.enter().append('svg:circle')
    .attr('class', 'node')
    .classed('directory', function (d) { return (d._children || d.children) ? 1 : 0 })
    .attr('r', function (d) {
      // If parent node, add position to local storage to enable zooming
      if (d.parent) appendToStorage(d.name, { x: d.x, y: d.y })
      if (d.name === 'Search Results') return 70
      return d.children ? 45 : Math.pow(d.size * 100, 2 / 5) * 20 || 30
    })
    .style('fill', function color(d) {
      if (d.name === 'Search Results') return 'tp'
      return calculate_fullness(d.avail, d.capac)
    })
    .call(this.force.drag)
    .on('click', this.click.bind(this))
    .on('mouseover', this.mouseover.bind(this))

  // Exit any old nodes
  this.node.exit().remove()

  this.text = this.svg.append('svg:text')
    .attr('class', 'nodetext')
    .attr('dy', 0)
    .attr('dx', 0)
    .attr('text-anchor', 'middle')
    .on('click', this.click.bind(this))

  return this
}

CodeFlower.prototype.flatten = function (root) {
  const nodes = []; let i = 0

  function recurse(node) {
    if (node.children) {
      node.size = node.children.reduce(function (p, v) {
        return p + recurse(v)
      }, 0)
    }
    if (!node.id) node.id = ++i
    nodes.push(node)
    return node.size
  }

  root.size = recurse(root)
  return nodes
}

CodeFlower.prototype.click = function (d) {
  $('#myModal').modal('show')
  $('#myModalTitle').html(d.name + ' Prerequisite Tree')
}

CodeFlower.prototype.mouseover = function (d) {
  let description = ' (' + d.avail + '/' + d.capac + ')'
  if (d.name == 'Search Results') description = '' // if root node

  this.text.attr('transform', 'translate(' + d.x + ',' + d.y + ')')
    .text(d.name + description)
    .style('fill', null)
}

CodeFlower.prototype.mouseout = function (d) {
  this.text.style('display', 'none')
}

CodeFlower.prototype.tick = function () {
  const h = this.h
  const w = this.w
  this.link.attr('x1', function (d) { return d.source.x })
    .attr('y1', function (d) { return d.source.y })
    .attr('x2', function (d) { return d.target.x })
    .attr('y2', function (d) { return d.target.y })

  this.node.attr('transform', function (d) {
    return 'translate(' + Math.max(5, Math.min(w - 5, d.x)) + ',' + Math.max(5, Math.min(h - 5, d.y)) + ')'
  })
}

CodeFlower.prototype.cleanup = function () {
  this.update([])
  this.force.stop()
}

function calculate_fullness(avail, cap) {
  // if no capacity, course is full (avoid divide by 0)
  let fullness = 0
  if (cap == 0) return '#bd0053'
  fullness = 100 - (avail / cap * 100)
  if (fullness == 100) return '#bd0053'
  else if (fullness >= 90) return '#f56418'
  else if (fullness >= 60) return '#61b8c1'
  else if (fullness >= 50) return '#499dce'
  else if (fullness >= 40) return '#618cc1'
  else return 'teal'
}

function appendToStorage(name, position) {
  const node_positions = localStorage.getItem('node_positions')
  if (node_positions === null) localStorage.setItem('node_positions', '{}')
  node_positions_json = JSON.parse(node_positions)
  node_positions_json[name] = position
  localStorage.setItem('node_positions', JSON.stringify(node_positions_json))
}

module.exports = { calculate_fullness }
