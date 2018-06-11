/*
Interface for a symmetric lookup.
This data structure stores values for a pair of keys, agnostic of the key order.
*/

function SymmetricLookup(){
    this.lookup = {};
}

SymmetricLookup.prototype.add  = function(key1, key2, val){
    [[key1,key2],[key2,key1]].forEach((keys => {
        const [x,y] = keys;
        if(!(x in this.lookup )){ this.lookup[x] = {}}
        this.lookup [x][y] = val
    }))
}

SymmetricLookup.prototype.keys = function(){
    const visited = {};
    const retrieved = [];
    Object.keys(this.lookup).forEach((key1) => {
        Object.keys(this.lookup[key1]).forEach((key2)=> {
            const [a, b] = [key1, key2].slice().sort();
            if(!(a in visited)){ visited[a] = {}; }
            if(!(a in visited && b in visited[a])){
                visited[a][b] = true;
                retrieved.push([a, b])
            }
        });
    });
    return retrieved;
}

SymmetricLookup.prototype.has = function(key1, key2){
    return key1 in this.lookup && key2 in this.lookup[key1];
}
SymmetricLookup.prototype.get = function(key1, key2, defaultVal = null){
    return this.has(key1, key2)? this.lookup[key1][key2] : defaultVal;
}
SymmetricLookup.prototype.remove = function(key1, key2){
    if(this.has(key1, key2)){
        delete this.lookup[key1][key2];
        delete this.lookup[key2][key1];
    }
}
SymmetricLookup.prototype.adjacent = function(key){
    return Object.keys(this.lookup[key] || [])
}

module.exports = {
    instantiate: () => new SymmetricLookup()
}
