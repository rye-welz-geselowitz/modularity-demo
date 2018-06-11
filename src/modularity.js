/* Exposes a function evaluating the modularity of a partitioned undirected
network. The modularity is calculating according to the metric defined here:
https://arxiv.org/pdf/1606.02319.pdf

A partition is here defined as an object whose keys are node labels and whose
values are labels for the community to which the node has been assigned.

---
The core concept is to compare the density of edges between nodes of the same
community (intra-community) to the density of edges between communities.

The algorithm finds the sum of the intra-community edge weights that are not
explained by randomness. It then divides this by the total weight of all edges
in the network.

The probabalistic model used to account for randomness assumes that each node
maintains the same degree as in the original network, i.e. a highly connected
node remaind highly connected in the null model.
*/

// EXPOSED
/*
Inputs
* `network`, an instance of a graph, and
* `partition`, an object whose keys are node labels and whose values are
    community labels

Returns a number representing the modularity of the network. This is found
by dividing (a) the total weight of the intra-community edges not
explained by randomness by (b) the total weight of the network m
*/
function evaluate(network, partition){
    const m = network.weight();
    if(m===0){ return 0;}
    const nodes = network.nodes();
    const reducer =
        accumulateIntraCommunityWeight.bind(this, network, m, nodes, partition);
    return network.nodes().reduce(reducer, 0) / (2 * m);
}

// PRIVATE
/*
Inputs
* `network`, an instance of a graph
* `m`, a number representing the weight of the network
* `nodes`, a list of node labels in the network
* `partition`, an object whose keys are node labels and whose values are
    community labels
* `acc`, a number representing the accumulated non-random intra-community weight
    so far,
* `i`, a node label

(`m` and `nodes` could be retrieved from `network`, but they are seperately
included to avoid repeat calculations)

Returns a number representing the accumulated non-random intra-community weight
after node i has been considered
*/
function accumulateIntraCommunityWeight(network, m, nodes, partition, acc, i){
    const reducer =
        accumulateIntraCommunityWeightForNode.bind(this,i, network, m, partition)
    return acc + nodes.reduce(reducer, 0);
}

/*
Takes
* `i`, a node label
* `network`, an instance of a graph
* `m`, a number representing the weight of the network
* `nodes`, a list of node labels in the network, `partition`, an
    object whose keys are node labels and whose values are community labels
* `partition`, an object whose keys are node labels and whose values are
    community labels
* `acc`, a number representing the accumulated non-random intra-community weight
    deriving from edges of node `i` so far
* `j`, a node label

(`m` and `nodes` could be retrieved from `network`, but they are seperately
included to avoid repeat calculations)

Returns a number representing the accumulated non-random intra-community weight
associated with node i after its edge (or lack thereof) with node `j` has been
considered
*/
function accumulateIntraCommunityWeightForNode(i, network, m, partition, acc, j){
    if(i===j || partition[i] !== partition[j]){ return acc; }
    const actualEdgeWeight = network.edgeWeight(i,j);
    const expectedEdgeWeight =  network.degree(i) * network.degree(j) / (2 * m);
    const nodePairContribution = actualEdgeWeight - expectedEdgeWeight;
    return acc + nodePairContribution;
}

module.exports = {
    evaluate: evaluate
}
