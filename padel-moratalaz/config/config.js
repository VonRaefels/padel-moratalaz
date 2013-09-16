var DB_LOCATION;
var faseEnCurso = null;
var models = require('../models/schemas');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

exports.ObjectId = ObjectId;
exports.dbLocation = DB_LOCATION = 'mongodb://localhost/padel-moratalaz';


exports.getFaseEnCurso = function(callback){
    if(faseEnCurso == null){
        models.Config.findOne(function(err, doc){
            idFaseEnCurso = doc.faseEnCurso;
            models.Fase.findById( ObjectId.fromString(idFaseEnCurso), function(err, doc){
                faseEnCurso = doc;
                callback(err, faseEnCurso);
            });
        });
    }else{
        callback(null, faseEnCurso);
    }
};
