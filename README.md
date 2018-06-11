# Network Modularity Demonstration

## Motivation
A large variety of systems - biological, sociological, technological - can be represented as graphs: nodes representing entities, with connecting edges representing interactions between them. To understand the structure of a network, we may want to **detect communities** - clusters of nodes that are densely connected to each other. Algorithms such as the [Louvain method]('https://arxiv.org/pdf/0803.0476.pdf') of community detection involve iteratively re-assigning the nodes to communities, while attempting to optimize the quality of each partition. That is, at each step, the algorithm asks, “How good is this split? How well does it capture the structure of the network?” This measure is called **modularity**.

**This repository provides an implementation of the modularity measure** defined by Newman
[here]('https://arxiv.org/pdf/1606.02319.pdf') and a **D3 visualization**.

## Contents
This code sample includes:
* an implementation of a weighted undirected [graph](src/graph.js) interface
* a [function](src/modularity.js) that evaluates the partition of such a graph
* a [D3 demo](viz/) - allows user to re-assign nodes in a random visualized network and observe how modularity score changes

## Try Out The Demo
* Clone repo
* `npm install`
* `npm run start`

## To-dos
* Increase test coverage (add tests for `symmetric-lookup.js`)
* Clean up / reorganize D3 code
* Test larger networks & optimize
