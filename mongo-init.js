// mongo-init.js

const dbName = 'pruebaDB';

db = db.getSiblingDB(dbName);

db.createCollection('Usuario');
db.createCollection('Login')
db.createCollection('Firma');
db.createCollection('Documento');

db.Usuario.createIndex( { "user_id": 1 }, { unique: true } )
db.Login.createIndex( { "login_id": 1 }, { unique: true } )