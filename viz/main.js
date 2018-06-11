const mod = require('../src/modularity');
const gen = require('./generate-network');
const d3 = require('./d3.min.js')

const graph = gen.generateGraph();
const formattedGraphData = formatGraphData(graph);
const partition = gen.generateInitialPartition(graph);
let modularity = mod.evaluate(graph, partition);
displayModularity(modularity);

const svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");
const g = svg.append("g");
const simulation = generateSimulation(width, height);
const nCommunities = 3;


run(formattedGraphData);

/////////////////////////////////////////////////
function displayModularity(modularity){
    document.getElementById('score').innerHTML = Math.floor(modularity * 1000) /1000 ;
}
function run(graph) {
    const link = g.append("g")
        .attr("class", "link")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line");

    const node = g.append("g")
        .attr("class", "node")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", 2)
        .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    const label = g.append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(graph.nodes)
        .enter().append("text")
        .attr("class", "label")
        .text((d) => d.id);

    simulation
      .nodes(graph.nodes)
      .on("tick", ticked.bind(this, link, node, label));

    simulation.force("link")
        .links(graph.links);
    // Handle zoom
    const zoomHandler = d3.zoom()
        .on("zoom", () => {
            g.attr("transform", d3.event.transform)});
    zoomHandler(svg);
    svg.call(zoomHandler).on("dblclick.zoom", null);

}


function ticked(link, node, label) {
    link
        .attr("x1", (d)=> d.source.x)
        .attr("y1",  (d)=> d.source.y)
        .attr("x2",  (d)=> d.target.x)
        .attr("y2",  (d)=> d.target.y);

    node
         .attr("r", 16)
         .attr("cx", (d) =>  d.x+5)
         .attr("cy", (d) =>  d.y-3)
         .on("click", updateCommunity)
         .attr("class", (d)=> getCommunityClass(partition[d.id]));

    label
            .attr("x", function(d) { return d.x; })
            .attr("y", function (d) { return d.y; })
            .attr("class", "label")
}

function getCommunityClass(c){
    return Array.from({length: nCommunities}, (_, i) => 'c'+i)[c] || 'c1';
}

function generateSimulation(width, height){
    return d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
    	  .force('charge', d3.forceManyBody()
          .strength(-200)
          .theta(0.8)
          .distanceMax(150)
        )
        .force("center", d3.forceCenter(width / 2, height / 2));
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart()
  d.fx = d.x
  d.fy = d.y
}

function dragged(d) {
  d.fx = d3.event.x
  d.fy = d3.event.y
}

function dragended(d) {
  d.fx = d3.event.x
  d.fy = d3.event.y
  if (!d3.event.active) simulation.alphaTarget(0);
}

function updateCommunity(node){
  partition[node.id] =
    partition[node.id] === nCommunities? 0 : partition[node.id] + 1;
  modularity = mod.evaluate(graph, partition);
  displayModularity(modularity);

}

function formatGraphData(graph){
    return {
      nodes: graph.nodes().reduce((acc, node)=> acc.concat({id: node}), []),
      links: graph.edges()
        .reduce((acc, edge)=> acc.concat({source: edge[0], target: edge[1]}), [])
    }
}
