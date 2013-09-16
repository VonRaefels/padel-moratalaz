//!mongo [name].js

DB_NAME = "padel-moratalaz";
DB_LOCATION = "localhost:27017";


var connection = new Mongo(DB_LOCATION);
db = connection.getDB(DB_NAME);
db.createCollection("Jugador");
db.createCollection("Pareja");
db.createCollection("Fase");
db.createCollection("Configuration");
db.createCollection("Grupo");
db.createCollection("Categoria");
db.createCollection("Partido");


