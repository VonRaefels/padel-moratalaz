var fs = require('fs');
var appRoot = process.cwd();

var viewCache =  {};

var readAndCacheFile = function(view, callback){
    var data = viewCache[view];
    if(data){
        callback(null, data);
    }else{
        fs.readFile(appRoot + '/views/' + view + '.ejs', function(err, data){
            if(!err){
                viewCache[view] = data
            }
            callback(err, data);
        });
    }
}

exports.readView = readAndCacheFile;
