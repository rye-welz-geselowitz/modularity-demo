const mod = require('../src/modularity');
const gen = require('./generate-network');
const d3 = require('./d3.min.js')

// Generate random network
const network = gen.generateNetwork();
const formattedNetworkData = formatNetworkData(network);
const partition = gen.generateInitialPartition(network);

// Draw visualization
const svg = d3.select("svg"), width = +svg.attr("width"),
    height = +svg.attr("height");
const g = svg.append("g");
displayModularityBox();
displayModularity(mod.evaluate(network, partition));
const simulation = generateSimulation(width, height);
const nCommunities = 3;

run(formattedNetworkData);

/////////////HELPERS//////////////////

function run(network) {
    const link = g.append("g")
        .attr("class", "link")
        .selectAll("line")
        .data(network.links)
        .enter().append("line");

    const node = g.append("g")
        .attr("class", "node")
        .selectAll("circle")
        .data(network.nodes)
        .enter().append("circle")
        .attr("r", 2)
        .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    simulation
      .nodes(network.nodes)
      .on("tick", ticked.bind(this, link, node));

    simulation.force("link")
        .links(network.links);

    // Handle zoom
    const zoomHandler = d3.zoom()
        .on("zoom", () => {
            g.attr("transform", d3.event.transform)});
    zoomHandler(svg);
    svg.call(zoomHandler).on("dblclick.zoom", null);

}

function ticked(link, node) {
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
  modularity = mod.evaluate(network, partition);
  displayModularity(modularity);

}

function formatNetworkData(network){
    return {
      nodes: network.nodes().reduce((acc, node)=> acc.concat({id: node}), []),
      links: network.edges()
        .reduce((acc, edge)=> acc.concat({source: edge[0], target: edge[1]}), [])
    }
}

function getCommunityClass(c){
    return Array.from({length: nCommunities}, (_, i) => 'c'+i)[c] || 'c1';
}

function displayModularityBox(){
    const rWidth = 80, rHeight = 50, rMargin = 10;
    svg
        .append("rect")
        .attr("x", rMargin)
        .attr("y", height - (rHeight+rMargin))
        .attr("width", rWidth)
        .attr("height", rHeight)
        .style('fill', 'black')
        .style('opacity', .9)
    svg
        .append("text")
        .attr("x", 50)
        .attr("y", height - 50)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style('fill', 'white')
        .text("modularity = ");
}

function displayModularity(modularity){
    svg.select('#modularity').remove();
    svg
        .append("text")
        .attr("x", 50)
        .attr("y", height - 20)
        .attr('id', 'modularity')
        .attr("text-anchor", "middle")
        .style("font-size", "36px")
        .style('fill', 'white')
        .text(Math.floor(modularity * 100) / 100);

}
