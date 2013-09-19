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
db.Partido.remove();

//id's...
var idFases = [ObjectId(), ObjectId()];
var idConfiguration = ObjectId();
var idJugadores = [];
for(i=0; i<30; i++){
    idJugadores.push(ObjectId());
};
var idParejas = [];
for(i=0; i<15; i++){
    idParejas.push(ObjectId());
}
var idGrupos = [ObjectId(), ObjectId(), ObjectId()];
var idCategorias = [ObjectId(), ObjectId(), ObjectId()];

var idPartidos = [];
for(i=0; i<15; i++){
    idPartidos.push(ObjectId());
}

//Guardamos los datos.

db.Fase.save( {_id: idFases[0], name: "Fase de Otoño", categorias:  [idCategorias[0], idCategorias[2]]} );
db.Fase.save( {_id: idFases[1], name: "Fase de Verano", categorias:  [idCategorias[1]]} );

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
                    {_id: "10", name: "HUA Portillo", email: "hua@gmail.com", telefono: "2323333", sexo: "m", nivel: "b", edad: "25"},
                    {_id: "11", name: "Jorge asdf", email: "jorgemadridportillo@gmail.com", telefono: "646689491", sexo: "v", nivel: "a", edad: "20"},
                    {_id: "12", name: "sdfasdfJavier", email: "franciscojavier@gmail.com", telefono: "123456789", sexo: "v", nivel: "a", edad: "21"},
                    {_id: "13", name: "Sergio dfndo", email: "sergioredondo2@gmail.com", telefono: "679845362", sexo: "v", nivel: "b", edad: "22"},
                    {_id: "14", name: "Francissdfao Franco", email: "franciscofranco@gmail.com", telefono: "287843343", sexo: "v", nivel: "m", edad: "20"} ,
                    {_id: "15", name: "Paloma Porsafillo", email: "palomaportillo@gmail.com", telefono: "33333333", sexo: "m", nivel: "m", edad: "21"},
                    {_id: "16", name: "Aaron n", email: "aaronmartin@gmail.com", telefono: "22323", sexo: "m", nivel: "a", edad: "22"},
                    {_id: "17", name: "PedJavier", email: "pedrojavier@gmail.com", telefono: "1111111", sexo: "v", nivel: "a", edad: "26"},
                    {_id: "18", name: "Paqaasdfuito Redondo", email: "pquitoas@gmail.com", telefono: "232323", sexo: "m", nivel: "m", edad: "45"},
                    {_id: "19", name: "Perez Frasdfasanco", email: "perezfranco@gmail.com", telefono: "23232323", sexo: "v", nivel: "b", edad: "35"},
                    {_id: "20", name: "HUA Porsdaftillo", email: "hua@gmail.com", telefono: "2323333", sexo: "m", nivel: "b", edad: "25"},
                    {_id: "21", name: "Jorge Madasdfasrid", email: "jorgemadridportillo@gmail.com", telefono: "646689491", sexo: "v", nivel: "a", edad: "20"},
                    {_id: "22", name: "Francisco Javsadfier", email: "franciscojavier@gmail.com", telefono: "123456789", sexo: "v", nivel: "a", edad: "21"},
                    {_id: "23", name: "Sergio Refsaddondo", email: "sergioredondo2@gmail.com", telefono: "679845362", sexo: "v", nivel: "b", edad: "22"},
                    {_id: "24", name: "Franciasdsco Franco", email: "franciscofranco@gmail.com", telefono: "287843343", sexo: "v", nivel: "m", edad: "20"} ,
                    {_id: "25", name: "Paloma Psdaortillo", email: "palomaportillo@gmail.com", telefono: "33333333", sexo: "m", nivel: "m", edad: "21"},
                    {_id: "26", name: "Aaron Marsdtin", email: "aaronmartin@gmail.com", telefono: "22323", sexo: "m", nivel: "a", edad: "22"},
                    {_id: "27", name: "Pedro Javsadier", email: "pedrojavier@gmail.com", telefono: "1111111", sexo: "v", nivel: "a", edad: "26"},
                    {_id: "28", name: "Paquito Reasddondo", email: "pquitoas@gmail.com", telefono: "232323", sexo: "m", nivel: "m", edad: "45"},
                    {_id: "29", name: "Perez Fransdfco", email: "perezfranco@gmail.com", telefono: "23232323", sexo: "v", nivel: "b", edad: "35"},
                    {_id: "30", name: "HUA Portilasdlo", email: "hua@gmail.com", telefono: "2323333", sexo: "m", nivel: "b", edad: "25"}
                ];
var counter = 0;
for each(var jugador in jugadores){
    jugador['_id'] = idJugadores[counter];
    db.Jugador.save(jugador);
    counter++;
}

db.Pareja.save( {_id: idParejas[0], jugador1: idJugadores[0], jugador2: idJugadores[1], asignada: false} );
db.Pareja.save( {_id: idParejas[1], jugador1: idJugadores[2], jugador2: idJugadores[3], asignada: false} );
db.Pareja.save( {_id: idParejas[2], jugador1: idJugadores[4], jugador2: idJugadores[5], asignada: false} );
db.Pareja.save( {_id: idParejas[3], jugador1: idJugadores[6], jugador2: idJugadores[7], asignada: false} );
db.Pareja.save( {_id: idParejas[4], jugador1: idJugadores[8], jugador2: idJugadores[9], asignada: false} );
db.Pareja.save( {_id: idParejas[5], jugador1: idJugadores[10], jugador2: idJugadores[11], asignada: false} );
db.Pareja.save( {_id: idParejas[6], jugador1: idJugadores[12], jugador2: idJugadores[13], asignada: false} );
db.Pareja.save( {_id: idParejas[7], jugador1: idJugadores[14], jugador2: idJugadores[15], asignada: false} );
db.Pareja.save( {_id: idParejas[8], jugador1: idJugadores[16], jugador2: idJugadores[17], asignada: false} );
db.Pareja.save( {_id: idParejas[9], jugador1: idJugadores[18], jugador2: idJugadores[19], asignada: false} );
db.Pareja.save( {_id: idParejas[10], jugador1: idJugadores[20], jugador2: idJugadores[21], asignada: false} );
db.Pareja.save( {_id: idParejas[11], jugador1: idJugadores[22], jugador2: idJugadores[23], asignada: false} );
db.Pareja.save( {_id: idParejas[12], jugador1: idJugadores[24], jugador2: idJugadores[25], asignada: false} );
db.Pareja.save( {_id: idParejas[13], jugador1: idJugadores[26], jugador2: idJugadores[27], asignada: false} );
db.Pareja.save( {_id: idParejas[14], jugador1: idJugadores[28], jugador2: idJugadores[29], asignada: false} );


db.Grupo.save( {_id: idGrupos[0], parejas:  [idParejas[0], idParejas[1],idParejas[2], idParejas[3],idParejas[4], idParejas[5],idParejas[6], idParejas[7]], name: "Grupo rojo", partidos: [idPartidos[0], idPartidos[1], idPartidos[4], idPartidos[5], idPartidos[6]]} );
db.Grupo.save( {_id: idGrupos[1], parejas:  [idParejas[8], idParejas[9]], name: "Grupo azul", partidos: [idPartidos[2], idPartidos[3]]} );
db.Grupo.save( {_id: idGrupos[2], parejas:  [idParejas[10],idParejas[11], idParejas[12],idParejas[13], idParejas[14]], name: "Grupo rojo", partidos: []} );

db.Categoria.save( {_id: idCategorias[0], grupos:  [idGrupos[0]], name: "Categoria masculina"} );
db.Categoria.save( {_id: idCategorias[1], grupos:  [idGrupos[1]], name: "Categoria masculina"} );
db.Categoria.save( {_id: idCategorias[2], grupos:  [idGrupos[2]], name: "Categoria femenina"} );

db.Partido.save( {_id: idPartidos[0], pareja1: idParejas[0], pareja2: idParejas[1], resultado: '6/4 3/6 7/5'} );
db.Partido.save( {_id: idPartidos[1], pareja1: idParejas[2], pareja2: idParejas[3], resultado: '6/4 3/6 7/5'} );
db.Partido.save( {_id: idPartidos[2], pareja1: idParejas[4], pareja2: idParejas[5], resultado: '6/4 3/6 7/5'} );
db.Partido.save( {_id: idPartidos[3], pareja1: idParejas[6], pareja2: idParejas[7], resultado: '6/4 3/6 7/5'} );
db.Partido.save( {_id: idPartidos[4], pareja1: idParejas[8], pareja2: idParejas[9], resultado: '6/4 3/6 7/5'} );
db.Partido.save( {_id: idPartidos[5], pareja1: idParejas[10], pareja2: idParejas[11], resultado: '6/4 3/6 7/5'} );
db.Partido.save( {_id: idPartidos[6], pareja1: idParejas[12], pareja2: idParejas[13], resultado: '6/4 3/6 7/5'} );



