const Graph = require('../src/graph');
const mod = require('../src/modularity')
const assert = require('assert');

describe('Graph data structure', () => {
    it('instantiate a graph without nodes or edges',
    () => {
        const g = Graph.Graph();
        assert.deepEqual(g.nodes(), []);
        assert.deepEqual(g.edges(), []);
    });
    it('add nodes',
    () => {
        const g = Graph.Graph();
        g.addNode('C');
        g.addNode('B');
        g.addNode('A');
        assert.deepEqual(g.nodes(), ['A', 'B', 'C']);
        assert.deepEqual(g.edges(), []);
    });
    it('adding same node twice does not result in duplicates',
    () => {
        const g = Graph.Graph();
        g.addNode('C');
        g.addNode('C');
        assert.deepEqual(g.nodes(), ['C']);
    });
    it('add edges between existing nodes',
    () => {
        const g = Graph.Graph();
        g.addNode('A');
        g.addNode('B');
        g.addEdge('B', 'A');
        assert.deepEqual(g.nodes(), ['A', 'B']);
        assert.deepEqual(g.edges(), [ ['A', 'B'] ]);
    });
    it('add self loops',
    () => {
        const g = Graph.Graph();
        g.addEdge('A', 'A');
        assert.deepEqual(g.nodes(), ['A']);
        assert.deepEqual(g.edges(), [ ['A', 'A'] ]);
    });
    it('add edges between new nodes',
    () => {
        const g = Graph.Graph();
        g.addEdge('B', 'A');
        assert.deepEqual(g.nodes(), ['A', 'B']);
        assert.deepEqual(g.edges(), [ ['A', 'B'] ]);
    });
    it('add edges between new and existing nodes',
    () => {
        const g = Graph.Graph();
        g.addNode('A');
        g.addEdge('B', 'A');
        assert.deepEqual(g.nodes(), ['A', 'B']);
        assert.deepEqual(g.edges(), [ ['A', 'B'] ]);
    });
    it('remove an edge',
    () => {
        const g = Graph.Graph();
        g.addEdge('B', 'A');
        assert.deepEqual(g.nodes(), ['A', 'B']);
        assert.deepEqual(g.edges(), [ ['A', 'B'] ]);
        g.removeEdge('B', 'A');
        assert.deepEqual(g.nodes(), ['A', 'B']);
        assert.deepEqual(g.edges(), []);
    });
    it('removing a non-existent edge leaves graph intact',
    () => {
        const g = Graph.Graph();
        g.addEdge('C', 'D');
        g.addNode('A')
        assert.deepEqual(g.nodes(), ['A', 'C', 'D']);
        assert.deepEqual(g.edges(), [ ['C', 'D'] ]);
        g.removeEdge('B', 'A');
        assert.deepEqual(g.nodes(), ['A', 'C', 'D']);
        assert.deepEqual(g.edges(), [ ['C', 'D'] ]);
    });
    it('removing a node removes its edges',
    () => {
        const g = Graph.Graph();
        g.addEdge('B', 'A');
        g.addEdge('B', 'C');
        g.addEdge('A', 'C');
        assert.deepEqual(g.nodes(), ['A', 'B', 'C']);
        assert.deepEqual(g.edges(), [ ['A', 'B'],  ['B', 'C'], ['A', 'C'] ]);
        g.removeNode('B');
        assert.deepEqual(g.nodes(), ['A', 'C']);
        assert.deepEqual(g.edges(), [['A', 'C']]);
    });
    it('determine that graph contains a node',
    () => {
        const g = Graph.Graph();
        g.addNode('A');
        assert.equal(g.hasNode('A'), true);
    });
    it('determine that graph does not contain a node',
    () => {
        const g = Graph.Graph();
        g.addNode('A');
        assert.equal(g.hasNode('B'), false);
    });
    it('determine that graph contains an edge',
    () => {
        const g = Graph.Graph();
        g.addEdge('A','B');
        assert.equal(g.hasEdge('A','B'), true);
    });
    it('determine that graph contains an edge, agnostic of the node order',
    () => {
        const g = Graph.Graph();
        g.addEdge('A','B');
        assert.equal(g.hasEdge('B','A'), true);
    });
    it('find the neighbors of a node',
    () => {
        const g = Graph.Graph();
        g.addEdge('A','B');
        g.addEdge('B','C');
        g.addEdge('A','F');
        assert.deepEqual(g.neighbors('A'), ['B', 'F']);
    });
    it('find no neighbors of a node with no neighbors',
    () => {
        const g = Graph.Graph();
        g.addNode('A');
        g.addEdge('B','C');
        assert.deepEqual(g.neighbors('A'), []);
    });
    it('edge with unspecified weight has weight of 1',
    () => {
        const g = Graph.Graph();
        g.addEdge('B','C');
        assert.equal(g.edgeWeight('C', 'B'), 1);
        assert.equal(g.edgeWeight('B', 'C'), 1);
    });
    it('non-existent edge between non-existent nodes has weight of 0',
    () => {
        const g = Graph.Graph();
        assert.equal(g.edgeWeight('C', 'B'), 0);
    });
    it('non-existent edge between existent nodes has weight of 0',
    () => {
        const g = Graph.Graph();
        g.addNode('C');
        g.addNode('B');
        assert.equal(g.edgeWeight('C', 'B'), 0);
    });
    it('can add & query weighted edge',
    () => {
        const g = Graph.Graph();
        g.addEdge('C','B', 0.4);
        assert.equal(g.edgeWeight('C', 'B'), 0.4);
        assert.equal(g.edgeWeight('B', 'C'), 0.4);
    });
    it('weight of network is sum of all edge weights',
    () => {
        const g = Graph.Graph();
        g.addEdge('C','B', 0.4);
        g.addEdge('C','D');
        g.addEdge('A','B', 0.6);
        assert.equal(g.weight(), 2);
    });
    it('node with no edges has a degree of 0',
    () => {
        const g = Graph.Graph();
        g.addNode('C');
        assert.equal(g.degree('C'), 0);
    });
    it('non-existent node has a degree of 0',
    () => {
        const g = Graph.Graph();
        assert.equal(g.degree('C'), 0);
    });
    it('degree of a node with edges is the sum of its edge weights',
    () => {
        const g = Graph.Graph();
        g.addEdge('C','B', 0.4);
        g.addEdge('C','D');
        g.addEdge('A','B', 0.6);
        assert.equal(g.degree('C'), 1.4);
    });
    it('degree of a node includes edges with self',
    () => {
        const g = Graph.Graph();
        g.addEdge('A','B', 0.4);
        g.addEdge('A','A');
        assert.equal(g.degree('A'), 1.4);
    });
});

describe('Modularity evaluation', () => {
    it('modularity of a partition of an empty graph is 0',
    () => {
        const g = Graph.Graph();
        assert.equal(mod.evaluate(g, {}), 0);
    });
    it('modularity of a partition of an graph with nodes but no edges is 0',
    () => {
        const g = Graph.Graph();
        g.addNode('A');
        g.addNode('B');
        assert.equal(mod.evaluate(g, {}), 0);
    });
    it('modularity of a partition of a graph with edges and with all nodes in same community approaches 0',
    () => {
        const g = Graph.Graph();
        const partition = {};
        for(var i=0; i<100;i++){
            g.addEdge(i+'a', i+'b');
            partition[i+'a'] = 0;
            partition[i+'b'] = 0;

        }
        const modularity = mod.evaluate(g, partition);
        assert.ok( modularity >= 0 && modularity <= 0.01);
    });
    it('modularity of a partition with multiple communities, where all edges are intra-community, approaches 1',
    () => {
        const g = Graph.Graph();
        const partition = {};
        for(var i=0; i<100;i++){
            g.addEdge(i+'a', i+'b');
            partition[i+'a'] = i;
            partition[i+'b'] = i;

        }
        const modularity = mod.evaluate(g, partition);
        assert.ok( modularity > 0.98 && modularity <= 1);
    });
    it('modularity of a partition with multiple communities where half of edges (with consistent weights) are intra-community, approaches 0.5',
    () => {
        const g = Graph.Graph();
        const partition = {};
        for(var i=0; i<200;i++){
            g.addEdge(i+'a', i+'b');
            partition[i+'a'] = i;
            partition[i+'b'] = i%2? i : i - 1;
        }
        const modularity = mod.evaluate(g, partition);
        assert.ok( modularity > 0.48 && modularity <= 0.5);
    });
    //TODO: clarify case
    it('modularity of a partition with multiple communities, where half of weight of the edges is intra-community, equal number of nodes, approaches 0.5',
    () => {
        const g = Graph.Graph();
        const partition = {};
        //Generate 100 edges of weight 2.
        //Generate 100 edges of weight 4.
        //Half of weight 2 edges are intra-community.
        //Half of weight 4 edges are intra-community.
        for(var i=0; i<200;i++){
            const weight = i < 50? 2 : 4;
            g.addEdge(i+'a', i+'b', weight);
            partition[i+'a'] = i;
            partition[i+'b'] = i%2? i : i - 1;
        }
        const modularity = mod.evaluate(g, partition);
        assert.ok( modularity > .48 && modularity <= 0.5);
    });
    //TODO: clarify case
    it('modularity of a partition with multiple communities - where half of weight of the edges is intra-community, unequal numbers of nodes, approaches 0.5',
    () => {
        const g = Graph.Graph();
        const partition = {};
        for(var i=0; i<200;i++){
            g.addEdge(i+'a', i+'b', 1);
            partition[i+'a'] = i;
            partition[i+'b'] = i-1;
        }
        for(var i=0; i<100;i++){
            g.addEdge(i+'A', i+'B', 2);
            partition[i+'A'] = i*100;
            partition[i+'B'] = i*100;
        }
        const modularity = mod.evaluate(g, partition);
        assert.ok( modularity > .48 && modularity <= 0.5);
    });
    it('modularity of a partition with multiple communities, edges, and no intra-community edges is less than 0',
    () => {
        const g = Graph.Graph();
        g.addEdge('a','b');
        g.addEdge('a','c');
        g.addEdge('c','b');
        g.addEdge('a','d');
        g.addEdge('a','e');

        g.addEdge('A','B');
        g.addEdge('A','C');
        g.addEdge('C','B');
        g.addEdge('A','D');
        g.addEdge('A','E');


        const partition = { 'a': 0, 'b': 1, 'c': 2, 'd': 1, 'e': 1,
            'A': 0, 'B':1, 'C': 2, 'D': 1, 'E': 1}
        const modularity = mod.evaluate(g, partition);
        assert.ok( modularity < 0 );
    });
});
