const Graph = require('../src/graph');

function generateNodes(min, max){
  return Array.from({length: getRandomIntInclusive(min,max)}, (_,i) => i+1)
    .reduce((acc, n)=> acc.concat(['n'+n]), []);
}

function generateEdges(nodes, probOfEdge){
  const edges = [];
  nodes.forEach((id)=> {
      const possibleNeighbors = nodes.filter( (neighborId) => id!==neighborId);
      if(Math.random() <= probOfEdge){
        const neighborId =
         possibleNeighbors[getRandomIntInclusive(0, possibleNeighbors.length-1)]
        edges.push([id, neighborId])
      }
    })
   return edges;
}

function generateGraph(minN = 100, maxN = 200, probOfEdge = 0.9){
    const graph = Graph.Graph();
    const nodes = generateNodes(minN, maxN);
    const edges = generateEdges(nodes, probOfEdge);
    nodes.forEach((node)=> {
        graph.addNode(node);
    })
    edges.forEach((edge)=> {
        graph.addEdge(edge[0], edge[1]);
    })
    return graph;
}

function generateInitialPartition(graph){
    const partition = {};
    graph.nodes().forEach( (id) => partition[id] = 0);
    return partition;
}

// Helpers
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Exports
module.exports = {
    generateGraph: generateGraph,
    generateInitialPartition: generateInitialPartition

}
