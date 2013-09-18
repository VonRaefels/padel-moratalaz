var Fase = Backbone.Model.extend({
    urlRoot: '/fases',
    url: '/fases/' + this.id,
    idAttribute: '_id'
});

var Fases = Backbone.Collection.extend({
    model: Fase,
    url: '/fases'
});

Fase.getFaseEnCurso = function(callback){
    $.get('/fase-en-curso', function(data) {
        var faseEnCurso = new Fase(data);
        callback(faseEnCurso);
    });
}

var Categoria = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: function(){
        return '/fases/' + this.get('idFase') + '/categorias';
    },
    url: function(){
        return '/categoria/' + this.id;
    },
    initialize: function(){
    }
});

var Grupo = Backbone.Model.extend({
    initialize: function(){
    },
    idAttribute: '_id',
    urlRoot: function(){
        return '/categorias/' + this.get('idCategoria') + '/grupos';
    },
    url: function(){
        return '/grupos/' + this.id;
    }
});

var Pareja = Backbone.Model.extend({
    initialize: function(){
    },
    idAttribute: '_id',
    urlRoot: function(){
        return '/grupos/' + this.get('_idGrupo') + '/parejas';
    },
    url: function(){
        return '/parejas/' + this.id;
    }
});

var Partido = Backbone.Model.extend({
    initialize: function(){
    },
    idAttribute: '_id',
    urlRoot: function(){
        return '/grupos/' + this.get('_idGrupo') + '/partidos';
    },
    url: function(){
        return '/partidos/' + this.id;
    }
});

var Grupos = Backbone.Collection.extend({
    model: Grupo,
    url: function(){
        return '/categorias/' + this.idCategoria + '/grupos';
    },
    parse: function(response, options){
        //Handle pagination...
        return response.data;
    },
    initialize: function(data, options){
        this.idCategoria = options.idCategoria;
    }
});

var Categorias = Backbone.Collection.extend({
    model: Categoria,
    url: function(){
        return '/fases/' + this.fase.get('_id') + '/categorias';
    },
    parse: function(response, options){
        return response.data;
    },
    initialize: function(data, options){
        this.fase = options.fase;
    }
});

Categorias.getCategoriasEnCurso = function(callback){
    $.get('/categorias-en-curso', function(categorias) {
        var categorias = new Categorias(categorias.data, {idFase: App.faseEnCurso.get('_id')});
        callback(categorias);
    });
}

var Parejas = Backbone.Collection.extend({
    model: Pareja,
    url: function(){
        return '/grupos/' + this.idGrupo + '/parejas';
    },
    parse: function(response, options){
        return response.data;
    },
    initialize: function(data, options){
        this.idGrupo = options.idGrupo;
    }
});

var Partidos = Backbone.Collection.extend({
    model: Partido,
    url: function(){
        return '/grupos/' + this.idGrupo + '/partidos';
    },
    parse: function(response, options){
        var partidos = response.data;
        return partidos;
    },
    initialize: function(data, options){
        this.idGrupo = options.idGrupo;
    }
});

