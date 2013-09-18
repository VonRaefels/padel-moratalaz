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

App = {
    faseEnCurso: null,
    categoriasEnCurso: null,
    router: new Router(),
    viewCache: new ViewCache(),
    showView: function(view){
        $('#view').detach();
        $('#ranking-content').html(view);
    },
    init: function(){
        Backbone.history.start();
        // App.viewCache.stop();

        Fase.getFaseEnCurso(function(fase){
            App.faseEnCurso = fase;
            events.trigger('categorias', fase);
        });
    }
}

App.init();



