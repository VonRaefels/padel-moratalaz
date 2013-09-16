var Fase = Backbone.Model.extend({
    urlRoot: '/fases',
    url: '/fases/' + this.id,
    idAttribute: '_id'
});

var Fases = Backbone.Model.extend({
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
    url: '/categoria/' + this.id,
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
        return '/categorias/' + this.idAtrribute + '/grupos';
    },
    url: '/grupos/' + this.id
});

var Pareja = Backbone.Model.extend({
    initialize: function(data, options){
        this.idGrupo = options.idGrupo;
    },
    idAttribute: '_id',
    urlRoot: function(){
        return '/grupos/' + this.idAttribute + '/parejas';
    },
    url: '/parejas/' + this.idAttribute
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
        var categoriaListView = new CategoriaListView({collection: this}).render();
        $('#ranking-content').html(categoriaListView.el);
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

var CategoriaListView = Backbone.View.extend({
    tagName: 'ul',
    className: 'categorias',
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
    id              : function(){ return this.model.id; },
    tagName: 'li',
    className: 'categoria',
    template        : Handlebars.compile($('#categoria-template').html()),
    events: {
        'click label[name=categoria]': 'clicked'
    },
    clicked: function(ev){
        ev.preventDefault();
        var idCategoria = this.model.get('_id');
        var model = this.model.attributes;
        var $el = this.$el;
        var $gruposElCollection = $el.find('.grupos');
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
    render          : function(){
        this.$el.append(this.template(this.model.toJSON()));
        return this;
    },
    initialize      : function(){
    }
});

var GrupoListView = Backbone.View.extend({
    tagName: 'ul',
    className: 'grupos',
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
            $('#ranking-content').html(parejaListView.el);
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
        console.log(options);

        _.bindAll(this, 'renderItem');
    },
    renderItem: function(model){
        var parejaView = new GrupoView({model: model});
        parejaView.render();
        $($(this.el).find('tbody')[0]).append(parejaView.el);
    },
    template: Handlebars.compile($('#parejas_template')),
    render: function(){
        var templateData = {categoria: this.categoria, grupo: this.grupo};
        // this.$el.append(this.template(templateData));
        this.collection.each(this.renderItem);
        return this;
    }
});

var ParejaView = Backbone.View.extend({
    tagName: 'tr',
    className: 'pareja',
    id: function(){
        return this.model.get('_id');
    },
    template: Handlebars.compile($('#pareja_template')),
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



