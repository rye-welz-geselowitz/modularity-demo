# Network Modularity Demonstration

## Motivation
A large variety of systems - biological, sociological, technological - can be represented as graphs: nodes representing entities, with connecting edges representing interactions between them. To understand the structure of a graph or network, we may want to detect communities - clusters of nodes that are densely connected to each other, relative to the rest of the network. We can then partition the nodes, assigning each to a community. **Modularity** is a metric reflecting how well a partition of nodes reflects the structure of a network.

**This repository provides an implementation of the modularity measure** defined by Newman
[here](https://arxiv.org/pdf/1606.02319.pdf) and a **D3 visualization** of modularity in a partitioned network.

## Contents
This code sample includes:
* an implementation of a weighted undirected [graph](src/graph.js) interface
* a [function](src/modularity.js) that evaluates the partition of such a graph
* a [D3 demo](viz/) that allows user to re-assign nodes in a random visualized network and observe how modularity score changes

## Try Out The Demo
* Clone repo
* `npm install`
* `npm run start`

## To-dos
* Increase test coverage (add tests for `symmetric-lookup.js`)
* Clean up / reorganize D3 code & file structure
* Test larger networks & optimize
