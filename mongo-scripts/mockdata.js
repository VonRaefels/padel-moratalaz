//!mongo [name].js

DB_NAME = "padel-moratalaz";
DB_LOCATION = "localhost:27017";

var connection = new Mongo(DB_LOCATION);
db = connection.getDB(DB_NAME);

db.Jugador.remove();
db.Fase.remove();
db.Pareja.remove();
db.Grupo.remove();
db.Configuration.remove();
db.Categoria.remove();

//id's...
var idFases = [ObjectId(), ObjectId()];
var idConfiguration = ObjectId();
var idJugadores = [];
for(i=0; i<10; i++){
    idJugadores.push(ObjectId());
};
var idParejas = [];
for(i=0; i<5; i++){
    idParejas.push(ObjectId());
}
var idGrupos = [ObjectId(), ObjectId(), ObjectId()];
var idCategorias = [ObjectId(), ObjectId(), ObjectId()];

//Guardamos los datos.

db.Fase.save( {_id: idFases[0], name: "Fase de Otoño", categorias:  [idCategorias[0], idCategorias[1]]} );
db.Fase.save( {_id: idFases[1], name: "Fase de Verano", categorias:  [idCategorias[2]]} );

db.Configuration.save( {_id: idConfiguration, faseEnCurso: idFases[0]} );

var jugadores = [
                    {_id: "1", name: "Jorge Madrid", email: "jorgemadridportillo@gmail.com", telefono: "646689491", sexo: "v", nivel: "a", edad: "20"},
                    {_id: "2", name: "Francisco Javier", email: "franciscojavier@gmail.com", telefono: "123456789", sexo: "v", nivel: "a", edad: "21"},
                    {_id: "3", name: "Sergio Redondo", email: "sergioredondo2@gmail.com", telefono: "679845362", sexo: "v", nivel: "b", edad: "22"},
                    {_id: "4", name: "Francisco Franco", email: "franciscofranco@gmail.com", telefono: "287843343", sexo: "v", nivel: "m", edad: "20"} ,
                    {_id: "5", name: "Paloma Portillo", email: "palomaportillo@gmail.com", telefono: "33333333", sexo: "m", nivel: "m", edad: "21"},
                    {_id: "6", name: "Aaron Martin", email: "aaronmartin@gmail.com", telefono: "22323", sexo: "m", nivel: "a", edad: "22"},
                    {_id: "7", name: "Pedro Javier", email: "pedrojavier@gmail.com", telefono: "1111111", sexo: "v", nivel: "a", edad: "26"},
                    {_id: "8", name: "Paquito Redondo", email: "pquitoas@gmail.com", telefono: "232323", sexo: "m", nivel: "m", edad: "45"},
                    {_id: "9", name: "Perez Franco", email: "perezfranco@gmail.com", telefono: "23232323", sexo: "v", nivel: "b", edad: "35"},
                    {_id: "10", name: "HUA Portillo", email: "hua@gmail.com", telefono: "2323333", sexo: "m", nivel: "b", edad: "25"}
                ];
var counter = 0;
for each(var jugador in jugadores){
    jugador['_id'] = idJugadores[counter];
    db.Jugador.save(jugador);
    counter++;
}

db.Pareja.save( {_id: idParejas[0], jugador1: idJugadores[0], jugador2: idJugadores[1], fase: idFases[0]} );
db.Pareja.save( {_id: idParejas[1], jugador1: idJugadores[2], jugador2: idJugadores[3], fase: idFases[0]} );
db.Pareja.save( {_id: idParejas[2], jugador1: idJugadores[4], jugador2: idJugadores[5], fase: idFases[0]} );
db.Pareja.save( {_id: idParejas[3], jugador1: idJugadores[6], jugador2: idJugadores[7], fase: idFases[0]} );
db.Pareja.save( {_id: idParejas[4], jugador1: idJugadores[8], jugador2: idJugadores[9], fase: idFases[1]} );

db.Grupo.save( {_id: idGrupos[0], parejas:  [idParejas[0], idParejas[1]], name: "Grupo rojo"} );
db.Grupo.save( {_id: idGrupos[1], parejas:  [idParejas[2], idParejas[3]], name: "Grupo azul"} );
db.Grupo.save( {_id: idGrupos[2], parejas:  [idParejas[4]], name: "Grupo rojo"} );

db.Categoria.save( {_id: idCategorias[0], grupos:  [idGrupos[0]], name: "Categoria masculina"} );
db.Categoria.save( {_id: idCategorias[1], grupos:  [idGrupos[1]], name: "Categoria masculina"} );
db.Categoria.save( {_id: idCategorias[2], grupos:  [idGrupos[2]], name: "Categoria femenina"} );

