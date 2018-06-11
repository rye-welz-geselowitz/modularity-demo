function evaluate(graph, partition){
    const m = graph.weight();
    if(m===0){ return 0;}
    const intraCommunityWeight =
        graph.nodes().reduce( (weight, i) => {
            return (
                accumulateIntraCommunityWeight(weight,
                    i, graph, m, partition))},
            0);
    return intraCommunityWeight / (2 * m);
}

function accumulateIntraCommunityWeight(intraCommunityWeightForNetwork, i, graph, m, partition){
    return (intraCommunityWeightForNetwork
    + graph.nodes().reduce( (intraCommunityWeightForNode, j) => {
        return (
            accumulateIntraCommunityWeightForNode(intraCommunityWeightForNode,
                i, j, graph, m, partition));
    }, 0));
}

function accumulateIntraCommunityWeightForNode(intraCommunityWeightForNode, i, j, graph, m, partition){
    if(i!==j && partition[i] === partition[j]){
        const A_ij = graph.edgeWeight(i,j);
        const k_i = graph.degree(i);
        const k_j = graph.degree(j);
        const P_ij =  k_i * k_j /  m;
        const nodePairContribution = A_ij - P_ij;
        return intraCommunityWeightForNode + nodePairContribution;
    }
    return intraCommunityWeightForNode;
}
module.exports = {
    evaluate: evaluate
}
