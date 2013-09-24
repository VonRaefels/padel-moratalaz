var models = require('../models/schemas');
var helpers = require('../models/helpers').Helpers;
var config = require('../config/config');
var mongoose = require('mongoose');

var Query = mongoose.Query;
var ObjectId = config.ObjectId;

var FaseAPI = {
    getFases : function(req, res){
        _sendDocumentIfNotErrorWithModel(models.Fase, req, res);
    },
    getFaseEnCurso : function(req, res){
        config.getFaseEnCurso(function(err, faseEnCurso){
            _sendDocumentIfNotError(res, err, faseEnCurso);
        });
    },
    getFase: function(req, res){
        var idFase = req.param('id');
        models.Fase.findById(ObjectId.fromString(idFase), function(err, doc){
            _sendDocumentIfNotError(res, err, doc);
        });
    }
};

var JugadorAPI = {
    getJugadores : function(req, res){
        var paginateOpts = {limit: req.query.limit, offset: req.query.offset};
        models.Jugador.createQuery().select('name sexo').paginate(paginateOpts, function(err, doc){
            _sendDocumentIfNotError(res, err, doc);
        });
    },
    getJugador : function(req, res){
        idJugador = req.param('id');
        models.Jugador.findById(ObjectId.fromString(idJugador), function(err, doc){
            _sendDocumentIfNotError(res, err, doc);
        });
    }
};

var ParejaAPI = {
    getParejas : function(req, res){
        _sendDocumentIfNotErrorWithModel(models.Pareja, req, res);
    },
    addPareja : function(req, res){//TODO validate
        var pareja = req.body;
        primerJugadorJson = pareja['jugador1'];
        segundoJugadorJson = pareja['jugador2'];
        _createPareja(primerJugadorJson, segundoJugadorJson, res);
    },
    getParejasSinAsignar : function(req, res){
        var paginateOpts = {limit: req.query.limit, offset: req.query.offset};
        models.Pareja.paginate({"asignada": false}, paginateOpts, function(err, doc){
            _sendDocumentIfNotError(res, err, doc);
        });
    },
    getParejasWithinGroup : function(req, res){
        _populateModel(req, models.Grupo, 'parejas', function(err, query, grupo){
            var parejas = grupo.parejas;
            helpers.populateParejas(parejas, function(parejas){
                models.Grupo.findById(req.param('id'), function(err, grupoSinPopular){
                    helpers.addMeta(req, parejas, grupoSinPopular.parejas.length, function(data){
                        _sendDocumentIfNotError(res, err, data);
                    });
                });
            });
        });
    },
    getPareja : function(req, res){
        idPareja = req.param('id');
        models.Pareja.findById(ObjectId.fromString(idPareja), function(err, pareja){
            helpers.populatePareja(pareja, function(parejaPopulada){
                _sendDocumentIfNotError(res, err, parejaPopulada);
            });
        });
    }
};

function _createPareja(primerJugadorJson, segundoJugadorJson, res){
    _createJugador(primerJugadorJson, function(err, primerJugador){
        _createJugador(segundoJugadorJson, function(err, segundoJugador){
            _savePareja(primerJugador,segundoJugador, res);
        });
    });
}
function _createJugador(data, callback){
    models.Jugador.create(data, function(err, jugador){
        callback(err, jugador);
    });
}

function _savePareja(primerJugador, segundoJugador, res){
    config.getFaseEnCurso(function(err, faseEnCurso){//TODO control de errores
        var parejaData = {jugador1: {_id: primerJugador._id, name: primerJugador.name, sexo: primerJugador.sexo},
         jugador2: {_id: segundoJugador._id, name: segundoJugador.name, sexo: segundoJugador.sexo}};
        models.Pareja.create(parejaData, function(err, pareja){

            _sendDocumentIfNotError(res, err, pareja);
        });
    });
}

var CategoriaAPI = {
    getCategorias : function(req, res){
        _populateModel(req, models.Fase, 'categorias', function(err, query, fase){
            models.Fase.findById(req.param('id'), function(err, faseSinPopular){
                helpers.addMeta(req, fase.categorias, faseSinPopular.categorias.length, function(data){
                    _sendDocumentIfNotError(res, err, data);
                });
            });
        });
    },
    getCategoriasEnCurso : function(req, res){
        config.getFaseEnCurso(function(err, faseEnCurso){
            if(err){
                res.send(404, {error: 'true'});
            }else{
                res.redirect('/fases/' + faseEnCurso._id + '/categorias');
            }
        });
    },
    getCategoria: function(req, res){
        var idCategoria = req.param('id');
        models.Categoria.findById(ObjectId.fromString(idJugador), function(err, doc){
            _sendDocumentIfNotError(res, err, doc);
        });
    }
};


var GrupoAPI = {
    getGrupos : function(req, res){
        _populateModel(req, models.Categoria, 'grupos', function(err, query, categoria){
            models.Categoria.findById(req.param('id'), function(err, categoriaSinPopular){
                helpers.addMeta(req, categoria.grupos, categoriaSinPopular.grupos.length , function(data){
                    _sendDocumentIfNotError(res, err, data);
                });
            });
        });
    }
}

var PartidoAPI = {
    getPartidos : function(req, res){
        _populateModel(req, models.Grupo, 'partidos', function(err, query, grupo){
            models.Grupo.findById(req.param('id'), function(err, grupoSinPopular){
                helpers.addMeta(req, grupo.partidos, grupoSinPopular.partidos.length , function(data){
                    _sendDocumentIfNotError(res, err, data);
                });
            });
        });
    }
}

function _populateModel(req, model, modelToPopulate, callback){
    var id = req.param('id');
    var paginateOpts = {limit: req.query.limit, offset: req.query.offset};
    paginateOpts = helpers.validateOptions(paginateOpts);
    paginateOpts.skip = paginateOpts.offset;
    delete paginateOpts.offset;
    var query = model
        .findById(ObjectId.fromString(id))
        .populate({
            path: modelToPopulate,
            options: paginateOpts
        });
        query.exec(function(err, doc){
            callback(err, query, doc);
        });
}

function _sendDocumentIfNotErrorWithModel(model, req, res){
    var paginateOpts = {limit: req.query.limit, offset: req.query.offset};
    model.paginate(paginateOpts, function(err, doc){
        _sendDocumentIfNotError(res, err, doc);
    });
}

function _sendDocumentIfNotError(res, err, doc){
    if(err){
        res.json(404, {error: 'true'});
    }else{
        res.json(doc);
    }
}


exports.FaseAPI = FaseAPI;
exports.CategoriaAPI = CategoriaAPI;
exports.GrupoAPI = GrupoAPI;
exports.ParejaAPI = ParejaAPI;
exports.JugadorAPI = JugadorAPI;
exports.PartidoAPI = PartidoAPI;