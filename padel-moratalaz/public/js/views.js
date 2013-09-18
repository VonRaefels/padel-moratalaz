var CategoriaListView = Backbone.View.extend({
    tagName: 'ul',
    id: 'view',
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
        var model = this.model;
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
        var grupo = this.model;
        events.trigger('parejas', categoria, grupo);
    },
    template: Handlebars.compile($('#grupo-template').html()),
    render: function(){
        this.$el.append(this.template(this.model.toJSON()));
        return this;
    }
});

var ParejaListView = Backbone.View.extend({
    tagName: 'div',
    id: 'view',
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
        events.trigger('categorias', App.faseEnCurso);
    },
    mostrarPartidos: function(ev){
        ev.preventDefault();
        var categoria = this.categoria;
        var grupo = this.grupo;
        events.trigger('partidos', categoria, grupo);
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
    template: Handlebars.compile($('#partido-template').html()),
    render: function(){
        this.$el.append(this.template(this.model.toJSON()));
        return this;
    }
});

var PartidoListView = Backbone.View.extend({
    tagName: 'div',
    id: 'view',
    className: 'partidos',
    initialize: function(options){
        this.grupo = options.grupo;
        this.categoria = options.categoria;

        _.bindAll(this, 'renderItem');
    },
    renderItem: function(model){
        var partidoView = new PartidoView({model: model});
        partidoView.render();
        $(this.$el.find('tbody')[0]).append(partidoView.el);
    },
    template: Handlebars.compile($('#partidos-template').html()),
    render: function(){
        var templateData = {categoria: this.categoria, grupo: this.grupo};
        this.$el.append(this.template(templateData));
        this.collection.each(this.renderItem);
        return this;
    },events: {
        'click #volver-ranking': 'volver'
    },
    volver: function(ev){
        ev.preventDefault();
        events.trigger('parejas', this.categoria, this.grupo);
    }
});