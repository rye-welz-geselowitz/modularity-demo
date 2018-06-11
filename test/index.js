const Graph = require('../src/graph');
const mod = require('../src/modularity')
const assert = require('assert');

describe('Graph data structure', () => {
    it('instantiate a graph without nodes or edges',
    () => {
        const g = Graph.instantiate();
        assert.deepEqual(g.nodes(), []);
        assert.deepEqual(g.edges(), []);
    });
    it('add nodes',
    () => {
        const g = Graph.instantiate();
        g.node('C');
        g.node('B');
        g.node('A');
        assert.deepEqual(g.nodes(), ['A', 'B', 'C']);
        assert.deepEqual(g.edges(), []);
    });
    it('adding same node twice does not result in duplicates',
    () => {
        const g = Graph.instantiate();
        g.node('C');
        g.node('C');
        assert.deepEqual(g.nodes(), ['C']);
    });
    it('add edges between existing nodes',
    () => {
        const g = Graph.instantiate();
        g.node('A');
        g.node('B');
        g.edge('B', 'A');
        assert.deepEqual(g.nodes(), ['A', 'B']);
        assert.deepEqual(g.edges(), [ ['A', 'B'] ]);
    });
    it('add self loops',
    () => {
        const g = Graph.instantiate();
        g.edge('A', 'A');
        assert.deepEqual(g.nodes(), ['A']);
        assert.deepEqual(g.edges(), [ ['A', 'A'] ]);
    });
    it('add edges between new nodes',
    () => {
        const g = Graph.instantiate();
        g.edge('B', 'A');
        assert.deepEqual(g.nodes(), ['A', 'B']);
        assert.deepEqual(g.edges(), [ ['A', 'B'] ]);
    });
    it('add edges between new and existing nodes',
    () => {
        const g = Graph.instantiate();
        g.node('A');
        g.edge('B', 'A');
        assert.deepEqual(g.nodes(), ['A', 'B']);
        assert.deepEqual(g.edges(), [ ['A', 'B'] ]);
    });
    it('remove an edge',
    () => {
        const g = Graph.instantiate();
        g.edge('B', 'A');
        assert.deepEqual(g.nodes(), ['A', 'B']);
        assert.deepEqual(g.edges(), [ ['A', 'B'] ]);
        g.removeEdge('B', 'A');
        assert.deepEqual(g.nodes(), ['A', 'B']);
        assert.deepEqual(g.edges(), []);
    });
    it('removing a non-existent edge leaves graph intact',
    () => {
        const g = Graph.instantiate();
        g.edge('C', 'D');
        g.node('A')
        assert.deepEqual(g.nodes(), ['A', 'C', 'D']);
        assert.deepEqual(g.edges(), [ ['C', 'D'] ]);
        g.removeEdge('B', 'A');
        assert.deepEqual(g.nodes(), ['A', 'C', 'D']);
        assert.deepEqual(g.edges(), [ ['C', 'D'] ]);
    });
    it('removing a node removes its edges',
    () => {
        const g = Graph.instantiate();
        g.edge('B', 'A');
        g.edge('B', 'C');
        g.edge('A', 'C');
        assert.deepEqual(g.nodes(), ['A', 'B', 'C']);
        assert.deepEqual(g.edges(), [ ['A', 'B'],  ['B', 'C'], ['A', 'C'] ]);
        g.removeNode('B');
        assert.deepEqual(g.nodes(), ['A', 'C']);
        assert.deepEqual(g.edges(), [['A', 'C']]);
    });
    it('determine that graph contains a node',
    () => {
        const g = Graph.instantiate();
        g.node('A');
        assert.equal(g.hasNode('A'), true);
    });
    it('determine that graph does not contain a node',
    () => {
        const g = Graph.instantiate();
        g.node('A');
        assert.equal(g.hasNode('B'), false);
    });
    it('determine that graph contains an edge',
    () => {
        const g = Graph.instantiate();
        g.edge('A','B');
        assert.equal(g.hasEdge('A','B'), true);
    });
    it('determine that graph contains an edge, agnostic of the node order',
    () => {
        const g = Graph.instantiate();
        g.edge('A','B');
        assert.equal(g.hasEdge('B','A'), true);
    });
    it('find the neighbors of a node',
    () => {
        const g = Graph.instantiate();
        g.edge('A','B');
        g.edge('B','C');
        g.edge('A','F');
        assert.deepEqual(g.neighbors('A'), ['B', 'F']);
    });
    it('find no neighbors of a node with no neighbors',
    () => {
        const g = Graph.instantiate();
        g.node('A');
        g.edge('B','C');
        assert.deepEqual(g.neighbors('A'), []);
    });
    it('edge with unspecified weight has weight of 1',
    () => {
        const g = Graph.instantiate();
        g.edge('B','C');
        assert.equal(g.edgeWeight('C', 'B'), 1);
        assert.equal(g.edgeWeight('B', 'C'), 1);
    });
    it('non-existent edge between non-existent nodes has weight of 0',
    () => {
        const g = Graph.instantiate();
        assert.equal(g.edgeWeight('C', 'B'), 0);
    });
    it('non-existent edge between existent nodes has weight of 0',
    () => {
        const g = Graph.instantiate();
        g.node('C');
        g.node('B');
        assert.equal(g.edgeWeight('C', 'B'), 0);
    });
    it('can add & query weighted edge',
    () => {
        const g = Graph.instantiate();
        g.edge('C','B', 0.4);
        assert.equal(g.edgeWeight('C', 'B'), 0.4);
        assert.equal(g.edgeWeight('B', 'C'), 0.4);
    });
    it('weight of network is sum of all edge weights',
    () => {
        const g = Graph.instantiate();
        g.edge('C','B', 0.4);
        g.edge('C','D');
        g.edge('A','B', 0.6);
        assert.equal(g.weight(), 2);
    });
    it('node with no edges has a degree of 0',
    () => {
        const g = Graph.instantiate();
        g.node('C');
        assert.equal(g.degree('C'), 0);
    });
    it('non-existent node has a degree of 0',
    () => {
        const g = Graph.instantiate();
        assert.equal(g.degree('C'), 0);
    });
    it('degree of a node with edges is the sum of its edge weights',
    () => {
        const g = Graph.instantiate();
        g.edge('C','B', 0.4);
        g.edge('C','D');
        g.edge('A','B', 0.6);
        assert.equal(g.degree('C'), 1.4);
    });
    it('degree of a node includes edges with self',
    () => {
        const g = Graph.instantiate();
        g.edge('A','B', 0.4);
        g.edge('A','A');
        assert.equal(g.degree('A'), 1.4);
    });
});

describe('Modularity evaluation', () => {
    describe('Evaluate partitions with 0 or 1 communities', () => {
        it('modularity of a partition of an empty graph is 0',
        () => {
            const g = Graph.instantiate();
            assert.equal(mod.evaluate(g, {}), 0);
        });
        it('modularity of a partition of an graph with nodes but no edges is 0',
        () => {
            const g = Graph.instantiate();
            g.node('A');
            g.node('B');
            assert.equal(mod.evaluate(g, {}), 0);
        });
        it(`modularity of a partition of a graph with edges and with all nodes
            in same community approaches 0`,
        () => {
            const g = Graph.instantiate();
            const partition = {};
            for(var i=0; i<100;i++){
                g.edge(i+'a', i+'b');
                partition[i+'a'] = 0;
                partition[i+'b'] = 0;

            }
            const modularity = mod.evaluate(g, partition);
            assert.ok( modularity >= 0 && modularity <= 0.01);
        });
    });
    describe('Evaluate partitions with multiple communities', () => {
        it('Modularity approaches 1 when all edges are intra-community',
        () => {
            const g = Graph.instantiate();
            const partition = {};
            for(var i=0; i<100;i++){
                g.edge(i+'a', i+'b');
                partition[i+'a'] = i;
                partition[i+'b'] = i;

            }
            const modularity = mod.evaluate(g, partition);
            assert.ok( modularity > 0.98 && modularity <= 1);
        });
        it(`Modularity of an unweighted network approaches 0.5 when
            half of edges are intra-community`,
        () => {
            const g = Graph.instantiate();
            const partition = {};
            for(var i=0; i<200;i++){
                g.edge(i+'a', i+'b');
                partition[i+'a'] = i;
                partition[i+'b'] = i%2? i : i - 1;
            }
            const modularity = mod.evaluate(g, partition);
            assert.ok( modularity > 0.48 && modularity <= 0.5);
        });
        it(`Modularity of an weighted network approaches 0.5 when half of edge
            weight is intra-community (with intra- and inner- community edges
                distributed among even number of nodes)`,
        () => {
            const g = Graph.instantiate();
            const partition = {};
            //Generate 100 edges of weight 2; generate 100 edges of weight 4.
            //Half of weight 2 edges are intra-community; half of weight 4 edges
            // are intra-community.
            for(var i=0; i<200;i++){
                const weight = i < 50? 2 : 4;
                g.edge(i+'a', i+'b', weight);
                partition[i+'a'] = i;
                partition[i+'b'] = i%2? i : i - 1;
            }
            const modularity = mod.evaluate(g, partition);
            assert.ok( modularity > .48 && modularity <= 0.5);
        });
        it(`Modularity of an weighted network approaches 0.5 when half of edge
            weight is intra-community (with intra- and inner- community edges
                distributed among unequal number of nodes)`,
        () => {
            const g = Graph.instantiate();
            const partition = {};
            //Generate 200 nodes of weight 1 without intra-community edges
            for(var i=0; i<200;i++){
                g.edge(i+'a', i+'b', 1);
                partition[i+'a'] = i;
                partition[i+'b'] = i-1;
            }
            //Generate 100 nodes of weight 2 with intra-community edges.
            for(var i=0; i<100;i++){
                g.edge(i+'A', i+'B', 2);
                partition[i+'A'] = i*100;
                partition[i+'B'] = i*100;
            }
            const modularity = mod.evaluate(g, partition);
            assert.ok( modularity > .48 && modularity <= 0.5);
        });
        it(`Modularity is less than 0 when network has fewer intra-community
            edges than predicted by null model`,
        () => {
            const g = Graph.instantiate();
            g.edge('a','b');
            g.edge('a','c');
            g.edge('c','b');
            g.edge('a','d');
            g.edge('a','e');

            g.edge('A','B');
            g.edge('A','C');
            g.edge('C','B');
            g.edge('A','D');
            g.edge('A','E');
            const partition = { 'a': 0, 'b': 1, 'c': 2, 'd': 1, 'e': 1,
                'A': 0, 'B':1, 'C': 2, 'D': 1, 'E': 1}
            const modularity = mod.evaluate(g, partition);
            assert.ok( modularity < 0 );
        });
    });

});
