var ejs = require('ejs');
var fileCache =  require('../views/fileCache');
var appRoot = process.cwd();

var menuItems = [];

(function fillMenuItems(){
    menuItems[0] = {data: 'Ranking', href: '/ranking'};
    menuItems[1] = {data: 'Inscríbite', href: '/inscribete'};
    menuItems[2] = {data: 'Galería', href: '/galeria'};
    menuItems[3] = {data: 'Histórico', href: '/historico'};
    menuItems[4] = {data: 'Contacto', href: '/contacto'};
})();


exports.index = function(req, res){
  res.render('index');
};

exports.ranking = function(req, res){
    var html = '';
    fileCache.readView('nav-bar', function(err, data){
        if (err){
            console.log(err);
        }else{
            var navBarHtml = ejs.render(data.toString('utf8', 0, data.length), {menuItems: menuItems, active: '/ranking'});
            fileCache.readView('ranking', function(err, data){
                if(err){
                    console.log(data);
                }else{
                    var rankingHtml = ejs.render(data.toString('utf8', 0, data.length)
                        ,{filename: appRoot + '/views/ranking.ejs'});
                    html = navBarHtml + rankingHtml;
                    res.render(html);
                }
            });
        }
    })
}

exports.inscribete = function(req, res){
    res.render('inscripcion');
}