
/**
 * Module dependencies.
 */

var express = require('express');
var api = require('./routes/api')
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jshtml');
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

app.get('/fases', api.fases);
app.get('/fase-en-curso', api.faseEnCurso);

app.get('/jugadores', api.jugadores);
app.get('/jugadores/:id', api.jugador);

app.get('/parejas', api.parejas);
app.put('/parejas', api.addPareja);
app.get('/parejas-en-curso', api.parejasEnCurso);

app.get('/fases/:id/categorias', api.categorias);
app.get('/categorias-en-curso', api.categoriasEnCurso);

app.get('/categorias/:id/grupos', api.grupos);

app.get('/grupos/:id/parejas', api.parejasWithinGroup);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
