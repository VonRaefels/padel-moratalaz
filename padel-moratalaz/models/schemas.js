var mongoose = require('mongoose');
var config = require('../config/config');
var helpers = require('./helpers');

mongoose.connect(config.dbLocation);

var mongooseTypes = require('mongoose-types');
mongooseTypes.loadTypes(mongoose);

var Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    Email = mongoose.SchemaTypes.Email;

var ConfigSchema = new Schema(
    {faseEnCurso    : String},
    {collection     : 'Configuration'}
);

var FaseSchema = new Schema(
    {
        name        : String,
        categorias  : [{type: ObjectId, ref: 'Categoria'}]
    },
    {
        collection  : 'Fase'
    }
);

var CategoriaSchema = new Schema(
    {
        _creator    : {type: Number, ref: 'Fase'},
        name        : String,
        grupos      : [{type: ObjectId, ref: 'Grupo'}]
    },
    {
        collection  : 'Categoria'
    }
);

var GrupoSchema = new Schema(
    {
        _creator    : {type: Number, ref: 'Categoria'},
        name        : String,
        parejas     : [{type: ObjectId, ref: 'Pareja'}],
        partidos    : [{type: ObjectId, ref: 'Partido'}]
    },
    {
        collection  : 'Grupo'
    }
);

var ParejaSchema = new Schema(
    {
        _creator    : {type: Number, ref: 'Grupo'},
        jugador1    : {_id: ObjectId, name: String, sexo: String},
        jugador2    : {_id: ObjectId, name: String, sexo: String},
        asginada    : Boolean
    },
    {
        collection  : 'Pareja'
    }
);

var JugadorSchema = new Schema(
    {
        name        : String,
        email       : Email,
        telefono    : Number,
        sexo        : String,
        nivel       : String,
        edad        : Number
    },
    {
        collection  : 'Jugador'
    }
);

var PartidoSchema = new Schema(
    {
        _creator    : {type: Number, ref: 'Grupo'},
        resultado   : String,
        pareja1     : ObjectId,
        pareja2     : ObjectId
    },
    {
        collection  : 'Partido'
    }
);

module.exports.Fase = mongoose.model('Fase', FaseSchema);
module.exports.Jugador = mongoose.model('Jugador', JugadorSchema);
module.exports.Pareja = mongoose.model('Pareja', ParejaSchema);
module.exports.Categoria = mongoose.model('Categoria', CategoriaSchema);
module.exports.Grupo = mongoose.model('Grupo', GrupoSchema);
module.exports.Partido = mongoose.model('Partido', PartidoSchema);

module.exports.Config =  mongoose.model('Configuration', ConfigSchema);

helpers.Helpers.initHelpers();