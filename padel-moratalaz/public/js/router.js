var Router = Backbone.Router.extend({
});


var events = _.extend({}, Backbone.Events);

events.on('parejas', function(categoria, grupo, data){
    var cachedView = App.viewCache.get([categoria, grupo, {id: "parejas"}]);
    if(cachedView){
        App.showView(cachedView);
        return;
    }
    var parejas = new Parejas([], {idGrupo: grupo.get('_id')});
    parejas.fetch({success: function(collection, response, options){
        var parejaListView = new ParejaListView({collection: collection, categoria: categoria, grupo: grupo});
        parejaListView.render();
        App.showView(parejaListView.el);
        App.viewCache.set([categoria, grupo, {id: "parejas"}], parejaListView.el);
        App.router.navigate('parejas');
    }});
});

events.on('categorias', function(fase, data){
    var cachedView = App.viewCache.get([fase, {id: "categorias"}]);
    if(cachedView){
        App.showView(cachedView);
        return;
    }
    var categorias = new Categorias([], {fase: fase});
    categorias.fetch({success: function(collection, response, options){
        var categoriaListView = new CategoriaListView({collection: collection}).render();
        App.showView(categoriaListView.el);
        App.viewCache.set([fase, {id: "categorias"}], categoriaListView.el);
        App.router.navigate('categorias');
    }});
});

events.on('partidos', function(categoria, grupo, data){
    var cachedView = App.viewCache.get([categoria, grupo, {id: "partidos"}]);
    if(cachedView){
        App.showView(cachedView);
        return;
    }
    var partidosCollection = new Partidos([], {idGrupo: grupo.get('_id')});
    partidosCollection.fetch({success: function(collection, response, options){
        var partidos = collection.models;
        var cb = _.after(partidos.length, function(){
            var partidoListView = new PartidoListView({collection: collection, categoria: categoria, grupo: grupo});
            partidoListView.render();
            App.showView(partidoListView.el);
            App.viewCache.set([categoria, grupo, {id: "partidos"}], partidoListView.el);
            App.router.navigate('partidos');
        });
        partidos.forEach(function(partido){
            var pareja1 = new Pareja({_id: partido.get('pareja1'), _idGrupo: partido.get('_id')});
            pareja1.fetch({success: function(model, response, options){
                partido.set({pareja1: model.attributes});
                var pareja2 = new Pareja({_id: partido.get('pareja2')});
                pareja2.fetch({success: function(model2, response, options){
                    partido.set({pareja2: model2.attributes});
                    cb();
                }});
            }});
        });
    }});
});

String.prototype.hashCode = function(){
    var hash = 0, i, char;
    if (this.length == 0) return hash;
    for (i = 0, l = this.length; i < l; i++) {
        char  = this.charCodeAt(i);
        hash  = ((hash<<5)-hash)+char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

var ViewCache = function(){
    this.views = {};
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