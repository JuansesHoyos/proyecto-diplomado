db = db.getSiblingDB('pruebaDB');

   db.createCollection('Usuario');
   db.createCollection('Login');
   db.createCollection('Firma');
   db.createCollection('Documento');
  

   // Insertar un documento en cada colección para asegurar su creación
   db.Usuario.insertOne({ user_id: "init", username: "init_user" });
   db.Login.insertOne({ login_id: "init", username: "init_user" });
   db.Firma.insertOne({ firma_id: "init" });
   db.Documento.insertOne({ documento_id: "init" });