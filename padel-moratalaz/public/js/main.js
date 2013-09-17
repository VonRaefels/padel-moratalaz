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
        return '/fases/' + this.idFase + '/categorias';
    },
    url: function(){
        return '/categoria/' + this.id;
    },
    initialize: function(data, options){
        this.idFase = options.idFase;
    }
});

var Grupo = Backbone.Model.extend({
    initialize: function(data, options){
        this.idCategoria = options.idCategoria;
    },
    idAtrribute: '_id',
    urlRoot: function(){
        return '/categorias/' + this.id + '/grupos';
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
    initialize: function(data, options){
        this.idGrupo = options.idGrupo;
    },
    idAttribute: '_id',
    urlRoot: function(){
        return '/grupos/' + this.id + '/partidos';
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
        return '/fases/' + this.idFase + '/categorias';
    },
    parse: function(response, options){
        return response.data;
    },
    display: function(){
        if(App.categoriaListViewCached == null){
            App.categoriaListViewCached = new CategoriaListView({collection: this}).render().el;
        }
        $('#ranking-content').html(App.categoriaListViewCached);
    },
    initialize: function(data, options){
        this.idFase = options.idFase;
    }
});

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

var CategoriaListView = Backbone.View.extend({
    tagName: 'ul',
    id: 'categorias',
    initialize: function(){
        _.bindAll(this, 'renderItem');
    },
    renderItem: function(model){
        var categoriaView = new CategoriaView({model: model});
        categoriaView.render();
        $(this.el).append(categoriaView.el);
    },
    render: function(){
        this.collection.each(this.renderItem);
        return this;
    }
});

var CategoriaView = Backbone.View.extend({
    id: function(){ return this.model.id; },
    tagName: 'li',
    className: 'categoria',
    template: Handlebars.compile($('#categoria-template').html()),
    events: {
        'click label[name=categoria]': 'clicked'
    },
    clicked: function(ev){
        ev.preventDefault();
        var idCategoria = this.model.get('_id');
        var model = this.model.attributes;
        var $el = this.$el;
        var $gruposElCollection = $el.find('#grupos');
        if(0 == $gruposElCollection.length){
            var grupos = new Grupos([], {idCategoria: idCategoria});
            grupos.fetch({success: function(collection, response, options){
                var grupoListView = new GrupoListView({collection: collection, categoria: model}).render();
                $el.append(grupoListView.el);
            }});
        }else{
            var $gruposEl = $($gruposElCollection[0]);
            $gruposEl.toggle();
        }
    },
    render: function(){
        this.$el.append(this.template(this.model.toJSON()));
        return this;
    },
    initialize: function(){
    }
});

var GrupoListView = Backbone.View.extend({
    tagName: 'ul',
    id: 'grupos',
    initialize: function(options){
        this.categoria = options.categoria;
        _.bindAll(this, 'renderItem');
    },
    renderItem: function(model){
        var grupoView = new GrupoView({model: model, categoria: this.categoria});
        grupoView.render();
        $(this.el).append(grupoView.el);
    },
    render: function(){
        this.collection.each(this.renderItem);
        return this;
    }
});

var GrupoView = Backbone.View.extend({
    tagName: 'li',
    className: 'grupo',
    initialize: function(options){
        this.categoria = options.categoria;
    },
    id: function(){
        return this.model.get('_id');
    },
    events: {
        'click label[name=grupo]': 'clicked'
    },
    clicked: function(ev){
        ev.preventDefault();
        var categoria = this.categoria;
        var grupo = this.model.attributes;
        var parejas = new Parejas([], {idGrupo: this.model.get('_id')});
        parejas.fetch({success: function(collection, response, options){
            var parejaListView = new ParejaListView({collection: collection, categoria: categoria, grupo: grupo});
            parejaListView.render();
            var $rankingContent = $('#ranking-content');
            App.categoriaListViewCached = $($rankingContent.find('#categorias')[0]).detach();
            $rankingContent.html(parejaListView.el);
        }});
    },
    template: Handlebars.compile($('#grupo-template').html()),
    render: function(){
        this.$el.append(this.template(this.model.toJSON()));
        return this;
    }
});

var ParejaListView = Backbone.View.extend({
    tagName: 'div',
    className: 'parejas',
    initialize: function(options){
        this.grupo = options.grupo;
        this.categoria = options.categoria;

        _.bindAll(this, 'renderItem');
    },
    renderItem: function(model){
        var parejaView = new ParejaView({model: model});
        parejaView.render();
        $(this.$el.find('tbody')[0]).append(parejaView.el);
    },
    template: Handlebars.compile($('#parejas-template').html()),
    render: function(){
        var templateData = {categoria: this.categoria, grupo: this.grupo};
        this.$el.append(this.template(templateData));
        this.collection.each(this.renderItem);
        return this;
    },
    events: {
        'click #volver-ranking': 'volver',
        'click #partidos': 'mostrarPartidos'
    },
    volver: function(ev){
        ev.preventDefault();
        App.categoriasEnCurso.display();
    },
    mostrarPartidos: function(ev){
        ev.preventDefault();
        var partidosCollection = new Partidos([], {idGrupo: this.grupo._id});
        partidosCollection.fetch({success: function(collection, response, options){
            var partidos = collection.models;
            var cb = _.after(partidos.length, function(){
                console.log('finished');
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
    }
});

var ParejaView = Backbone.View.extend({
    tagName: 'tr',
    className: 'pareja',
    id: function(){
        return this.model.get('_id');
    },
    template: Handlebars.compile($('#pareja-template').html()),
    render: function(){
        this.$el.append(this.template(this.model.toJSON()));
        return this;
    }
});

var PartidoView = Backbone.View.extend({
    tagName: 'tr',
    className: 'partido',
    id: function(){
        return this.model.get('_id');
    },
    template: Handlebars.compile($('partido-template').html()),
    render: function(){
        this.$el.append(this.template(this.model.toJSON()));
        return this;
    }
});


Categorias.getCategoriasEnCurso = function(callback){
    $.get('/categorias-en-curso', function(categorias) {
        var categorias = new Categorias(categorias.data, {idFase: App.faseEnCurso.get('_id')});
        callback(categorias);
    });
}

App = {
    faseEnCurso: null,
    categoriasEnCurso: null,
    categoriaListViewCached: null,
    init: function(){
        Fase.getFaseEnCurso(function(fase){
            App.faseEnCurso = fase;
        });
        Categorias.getCategoriasEnCurso(function(categorias){
            App.categoriasEnCurso = categorias;
            App.categoriasEnCurso.display();
        });
    }
}

App.init();



