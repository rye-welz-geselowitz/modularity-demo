const Graph = require('../src/graph');
/* Utility functions for "randomly" generating a network and a partition*/

// EXPOSED
/* Generates a random network with number of nodes >= `minN` and <= `maxN`,
and with the probability od an edge between any two nodes specified by
`probOfEdge` */
function generateNetwork(minN = 100, maxN = 200, probOfEdge = 0.9){
    const graph = Graph.instantiate();
    const nodes = generateNodes(minN, maxN);
    const edges = generateEdges(nodes, probOfEdge);
    nodes.forEach((node)=> {
        graph.node(node);
    })
    edges.forEach((edge)=> {
        graph.edge(edge[0], edge[1]);
    })
    return graph;
}

/* Generates an object whose keys are node labels and whose values are
community labels. Places all nodes in the same community */
function generateInitialPartition(graph, defaultCommunity = 0){
    const partition = {};
    graph.nodes().forEach( (id) => partition[id] = defaultCommunity);
    return partition;
}

// PRIVATE
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateNodes(minN, maxN){
  return Array.from({length: getRandomIntInclusive(minN,maxN)}, (_,i) => i+1)
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

module.exports = {
    generateNetwork: generateNetwork,
    generateInitialPartition: generateInitialPartition

}
