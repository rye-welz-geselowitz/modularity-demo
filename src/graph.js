/* Interface for an undirected, weighted graph.*/

const SymmetricLookup = require('./symmetric-lookup');

function Graph(){
    this._nodes = new Set();
    this._edges = SymmetricLookup.instantiate();
}

//Specify nodes & edges
Graph.prototype.node = function(node){
    this._nodes.add(node);
}
Graph.prototype.edge = function(node1, node2, weight = 1){
    if(weight===0){ this.removeEdge(node1, node2);}
    [node1, node2].forEach( (node) => {
        if(!this.hasNode(node)) { this.node(node)}
    });
    this._edges.add(node1, node2, weight);
}

//Remove nodes & edges
Graph.prototype.removeEdge = function(node1, node2){
    this._edges.remove(node1, node2)
}
Graph.prototype.removeNode = function(node){
    this.neighbors(node).forEach( (neighbor)=> {
        this.removeEdge(node, neighbor);
    })
    this._nodes.delete(node);
}

// Query graph
Graph.prototype.hasNode = function(node){ return this._nodes.has(node) };
Graph.prototype.hasEdge = function(node1, node2){
    return this._edges.has(node1, node2)
};
Graph.prototype.nodes = function(){ return [...this._nodes].slice().sort() };
Graph.prototype.edges = function(){ return this._edges.keys() };
Graph.prototype.edgeWeight = function(node1, node2){
    return this._edges.get(node1, node2, 0)};
Graph.prototype.neighbors = function(node){
    return this._edges.adjacent(node)
}
Graph.prototype.weight = function(){
    return (this.edges().reduce( (acc, edgeTuple) => {
        return acc + this.edgeWeight(edgeTuple[0], edgeTuple[1]);
    }, 0));
}
Graph.prototype.degree = function(node){
    return this.neighbors(node).reduce( (acc, neighbor)=> {
        return acc + this.edgeWeight(node, neighbor);
    }, 0)
}

module.exports = {
    instantiate: () => new Graph()
}
