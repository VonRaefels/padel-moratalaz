var models = require('../models/schemas');
var config = require('../config/config');
var ObjectId = config.ObjectId;


exports.fases = function(req, res){
    _sendDocumentIfNotErrorWithModel(models.Fase, res);
}

exports.faseEnCurso = function(req, res){
    config.getFaseEnCurso(function(faseEnCurso){
        res.send(faseEnCurso);
    });
};

exports.jugadores = function(req, res){
    models.Jugador.find().select('name sexo').exec(function(err, doc){
        _sendDocumentIfNotError(res, err, doc);
    });
};

exports.jugador = function(req, res){
    idJugador = req.param('id');
    models.Jugador.findById(ObjectId.fromString(idJugador), function(err, doc){
        _sendDocumentIfNotError(res, err, doc);
    });
}

exports.parejas = function(req, res){
    _sendDocumentIfNotErrorWithModel(models.Pareja, res);
};

exports.addPareja = function(req, res){//TODO validate
    var pareja = req.body;
    jugador1Data = pareja[0];
    jugador2Data = pareja[1];
    _createJugador(jugador1Data, function(err, jugador1Model){
        _createJugador(jugador2Data, function(err, jugador2Model){
            config.getFaseEnCurso(function(faseEnCurso){
                var parejaData = {jugador1: jugador1Model._id, jugador2: jugador2Model._id, fase: faseEnCurso._id};
                console.log(parejaData);
                models.Pareja.create(parejaData, function(err, pareja){
                    res.send(pareja);
                });
            });
        });
    });
}

function _createJugador(data, callback){ //TODO refactor
    models.Jugador.create(data, function(err, jugador){//TODO handle errors
        callback(err, jugador);
    });
}

exports.parejasEnCurso = function(req, res){
    config.getFaseEnCurso(function(faseEnCurso){
        models.Pareja.find( {fase: faseEnCurso}, function(err, doc){
            _sendDocumentIfNotError(res, err, doc);
        });
    });
};

exports.categorias = function(req, res){
    _populateModel(req, models.Fase, 'categorias', function(err, fase){
        res.send(fase.categorias);
    });
}

exports.categoriasEnCurso = function(req, res){
    config.getFaseEnCurso(function(faseEnCurso){
        res.redirect('/fases/' + faseEnCurso._id + '/categorias');
    });
}

exports.grupos = function(req, res){
    _populateModel(req, models.Categoria, 'grupos', function(err, categoria){
        res.send(categoria.grupos);
    });
}

exports.parejasWithinGroup = function(req, res){
    _populateModel(req, models.Grupo, 'parejas', function(err, grupo){
        res.send(grupo.parejas);
    });
}

function _populateModel(req, model, modelToPopulate, callback){
    id = req.param('id');
    model.findById(ObjectId.fromString(id))
         .populate(modelToPopulate)
         .exec(function(err, doc){
            callback(err, doc);
         });
}

function _sendDocumentIfNotErrorWithModel(model, res){
    model.find(function(err, doc){
        _sendDocumentIfNotError(res, err, doc);
    });
}

function _sendDocumentIfNotError(res, err, doc){
    if(err){
        res.send(404, {error: 'true'});
    }else{
        res.send(doc);
    }
}