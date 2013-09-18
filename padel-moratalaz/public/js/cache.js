var ViewCache = function(){
    this.views = {};
    this.cache = true;
}

ViewCache.prototype.set = function(keys, value){
    var hash = this._hash(keys);
    this.views[hash]= value;
}

ViewCache.prototype._hash = function(keys){
    var stringSum = "";
    for(var i=0, l=keys.length; i<l; i++){
        var id = keys[i].id; //|| keys[i].get('_id');
        stringSum += keys[i].id;
    }
    var hashCode = stringSum.hashCode();
    return hashCode;
}

ViewCache.prototype.get = function(keys){
    if(!this.cache)
        return null;
    var hash = this._hash(keys);
    return this.views[hash];
}

ViewCache.prototype.del = function(keys){
    var hash = this._hash(keys);
    delete this.views[hash];
}

ViewCache.prototype.clear = function(){
    this.views = {};
}

ViewCache.prototype.stop = function(){
    this.cache = false;
}

ViewCache.prototype.start = function(){
    this.cache = true;
}