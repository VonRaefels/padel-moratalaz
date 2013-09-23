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
  res.render('index', {menuItems: menuItems, active: '/ranking'});
};

exports.ranking = function(req, res){
    res.render('ranking', {menuItems: menuItems, active: '/ranking'});
}

exports.inscribete = function(req, res){
    res.render('inscripcion', {menuItems: menuItems, active: '/inscribete'});
}