
/**
 * Module dependencies.
 */

var express = require('express');
var api = require('./routes/api')
var web = require('./routes/index');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here')); //TO DO Replace secret...
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', web.index);

app.get('/fases', api.FaseAPI.getFases);
app.get('/fases/:id', api.FaseAPI.getFase);
app.get('/fase-en-curso', api.FaseAPI.getFaseEnCurso);

app.get('/jugadores', api.JugadorAPI.getJugadores);
app.get('/jugadores/:id', api.JugadorAPI.getJugador);

app.get('/parejas', api.ParejaAPI.getParejas);
app.get('/parejas-sin-asignar', api.ParejaAPI.getParejasSinAsignar);
app.put('/parejas', api.ParejaAPI.addPareja);
app.get('/parejas/:id', api.ParejaAPI.getPareja);
app.get('/grupos/:id/parejas', api.ParejaAPI.getParejasWithinGroup);

app.get('/fases/:id/categorias', api.CategoriaAPI.getCategorias);
app.get('/categorias-en-curso', api.CategoriaAPI.getCategoriasEnCurso);
app.get('/categorias/:id', api.CategoriaAPI.getCategoria);

app.get('/categorias/:id/grupos', api.GrupoAPI.getGrupos);

app.get('/grupos/:id/partidos', api.PartidoAPI.getPartidos);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
