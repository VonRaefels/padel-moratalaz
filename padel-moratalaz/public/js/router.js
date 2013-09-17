var Router = Backbone.Router.extend({
    routes: {
        'categorias': 'mostrarCategorias'
    },
    mostrarCategorias: function(){
        Categorias.getCategoriasEnCurso(function(categorias){
            categorias.display();
        });
    }
});

var ViewCache = function(){
    this.views = {};
}

ViewCache.prototype.set = function(key, value){
    this.views[key] = value;
}

ViewCache.prototype.get = function(key){
    return this.views[key];
}

ViewCache.prototype.del = function(key){
    delete this.views[key];
}

ViewCache.prototype.clear = function(){
    this.views = {};
}