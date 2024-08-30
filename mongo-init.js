// mongo-init.js

const dbName = 'pruebaDB';

db = db.getSiblingDB(dbName);

db.createCollection('Usuario');
db.createCollection('Firma');
db.createCollection('Documento');