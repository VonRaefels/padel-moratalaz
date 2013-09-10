var mongoose = require('mongoose');
var config = require('../config/config');


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
        parejas     : [{type: ObjectId, ref: 'Pareja'}]
    },
    {
        collection  : 'Grupo'
    }
);

var ParejaSchema = new Schema(
    {
        _creator    : {type: Number, ref: 'Grupo'},
        jugador1    : ObjectId,
        jugador2    : ObjectId,
        fase        : ObjectId
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



module.exports.Fase = mongoose.model('Fase', FaseSchema);
module.exports.Jugador = mongoose.model('Jugador', JugadorSchema);
module.exports.Pareja = mongoose.model('Pareja', ParejaSchema);
module.exports.Categoria = mongoose.model('Categoria', CategoriaSchema);
module.exports.Grupo = mongoose.model('Grupo', GrupoSchema);

module.exports.Config =  mongoose.model('Configuration', ConfigSchema);