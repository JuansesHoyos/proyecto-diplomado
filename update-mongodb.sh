# Nombre del contenedor de MongoDB
CONTAINER_NAME="persistencia"

# Nombre de la base de datos
DB_NAME="pruebaDB"

# Comando MongoDB para crear la nueva colección
MONGO_COMMAND='db.createCollection("casa");'

# Ejecutar el comando dentro del contenedor
docker exec -it $CONTAINER_NAME mongosh $DB_NAME --eval "$MONGO_COMMAND"

echo "Colección 'casa' creada en la base de datos $DB_NAME"