var events = _.extend({}, Backbone.Events);

events.on('parejas', function(categoria, grupo, options){
    // var cachedView = App.viewCache.get([categoria, grupo, {id: "parejas"}]);
    // if(cachedView){
    //     App.showView(cachedView);
    //     return;
    // }
    console.log(options);
    if(!options){
        options = {};
    }
    var parejas = new Parejas([], {idGrupo: grupo.get('_id')});
    parejas.fetch({
        data: $.param(options),
        success: function(collection, response, options){
        var parejaListView = new ParejaListView({collection: collection, categoria: categoria, grupo: grupo});
        parejaListView.render();
        App.showView(parejaListView.el);
        // App.viewCache.set([categoria, grupo, {id: "parejas"}], parejaListView.el);
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
    // var cachedView = App.viewCache.get([categoria, grupo, {id: "partidos"}]);
    // if(cachedView){
    //     App.showView(cachedView);
    //     return;
    // }
    var partidosCollection = new Partidos([], {idGrupo: grupo.get('_id')});
    partidosCollection.fetch({success: function(collection, response, options){
        var partidos = collection.models;
        var cb = _.after(partidos.length, function(){
            var partidoListView = new PartidoListView({collection: collection, categoria: categoria, grupo: grupo});
            partidoListView.render();
            App.showView(partidoListView.el);
            // App.viewCache.set([categoria, grupo, {id: "partidos"}], partidoListView.el);
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