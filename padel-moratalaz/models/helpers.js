var mongoose = require('mongoose');
var Query = mongoose.Query;
var models = require('./schemas');
var _ = require('underscore');

var ObjectId = mongoose.Types.ObjectId;

var DEFAULT_LIMIT=10;
var DEFAULT_OFFSET=0;

var Helpers = {
    paginate : function(conditions, opts, callback){
        if('function' === typeof opts){
            callback = opts;
            opts = conditions;
            conditions = {};
        }

        var limit = opts.limit || DEFAULT_LIMIT;
        var offset = opts.offset || DEFAULT_OFFSET;
        var Model = this;

        if('undefined' === typeof conditions){
            conditions = {};
        }
        Model.count(conditions, function (err, totalRecords) {
            Model
            .find(conditions)
            .skip(offset)
            .limit(limit)
            .exec(function(err, records) {
                if (err) return callback(err);
                var metaData = {totalRecords: totalRecords, offset: offset, limit: limit}
                var doc = {meta: metaData, data: records};
                callback(err, doc);
            });
        });
    },
    paginateQuery : function(opts, callback){
        var limit = opts.limit || DEFAULT_LIMIT;
        var offset = opts.offset || DEFAULT_OFFSET;
        var query = this.skip(offset).limit(limit);
        var model = this.model;

        model.count(query._conditions, function (err, totalRecords){
            query.find(function(err, records){
                if (err) return callback(err);
                var metaData = {totalRecords: totalRecords, offset: offset, limit: limit}
                var doc = {meta: metaData, data: records};
                callback(err, doc);
            });
        });
    },
    createQuery : function(conditions, options){
        if('undefined' === typeof conditions){
            conditions = {};
        }
        if('undefined' === options){
            options = null;
        }

        var query = new Query(conditions, options);
        query.model = this;
        return query;
    },
    execWithMeta : function(conditions, opts, callback){4
        if('function' === typeof opts){
            callback = opts;
            opts = conditions;
            conditions = {};
        }
        var limit = opts.limit || DEFAULT_LIMIT;
        var offset = opts.offset || DEFAULT_OFFSET;

        var model = this.model;
        var query = this;

        model.count(conditions, function (err, totalRecords){
            query.exec(function(err, records){
                if (err) return callback(err);
                var metaData = {totalRecords: totalRecords, offset: offset, limit: limit}
                var doc = {meta: metaData, data: records};
                callback(err, doc);
            });
        });
    },
    addMeta : function (req, records, totalCount, callback){
        var limit = req.query.limit || DEFAULT_LIMIT;
        var offset = req.query.offset || DEFAULT_OFFSET;
        var metaData = {totalRecords: totalCount, offset: offset, limit: limit};
        var doc = {meta: metaData, data: records};
        callback(doc);
    },
    populateParejas: function(parejas, callback){
        var cb = _.after(parejas.length, callback);
        parejas.forEach(function(pareja){
            Helpers.populatePareja(pareja, cb);
        });
    },
    populatePareja: function(pareja, callback){
        models.Jugador.findById(pareja.jugador1).select('name sexo _id').exec(function(err, jugador1){
            pareja.jugador1 = {_id: jugador1._id, name: jugador1.name, sexo: jugador1.sexo};
            models.Jugador.findById(pareja.jugador2).select('name sexo _id').exec(function(err, jugador2){
                pareja.jugador2 = {_id: jugador2._id, name: jugador2.name, sexo: jugador2.sexo};
                if('undefined' !== typeof callback){
                    callback(pareja);
                }
            });
        });
    }
}

Helpers.initHelpers = function(){
    mongoose.Model.paginate = Helpers.paginate;
    mongoose.Model.createQuery = Helpers.createQuery;
    mongoose.Query.prototype.paginate = Helpers.paginateQuery;
    mongoose.Query.prototype.execWithMeta = Helpers.execWithMeta;
}

exports.Helpers = Helpers;



// mongoose.Query.prototype.exec = exec;