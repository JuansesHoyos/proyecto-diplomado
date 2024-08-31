import os
from datetime import timedelta, datetime
from typing import Optional, Annotated
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from fastapi import FastAPI, HTTPException, Header
from fastapi.security import HTTPBearer
from jwt import jwt
from pydantic import BaseModel
from pymongo import MongoClient
from starlette.middleware.cors import CORSMiddleware



from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Configuración de los tokens
SECRET_KEY = "llaveSuperSecreta"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Definición del esquema de seguridad JWT
security = HTTPBearer()

# Conexión a MongoDB
dburl = os.getenv('MONGO_URL')
client = MongoClient(dburl)
db = client["dbproyecto"]
users_collection = db['Usuario']
login_collection = db['Login']

# Definición de la aplicación FastAPI
app = FastAPI()

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from localhost:4200
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# MODELOS
class UserModel(BaseModel):
    username: str


class UserResponse(BaseModel):
    username: str
    publicKey: str


class UserLoginModel(BaseModel):
    username: str
    password: str


#Funciones
# Función para generar llaves RSA
def generate_keys():
    # Generar un par de llaves RSA
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
        backend=default_backend()
    )

    # Serializar la clave privada en formato PEM
    private_key_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.TraditionalOpenSSL,
        encryption_algorithm=serialization.NoEncryption()
    ).decode('utf-8')

    # Serializar la clave pública en formato PEM
    public_key_pem = private_key.public_key().public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    ).decode('utf-8')

    return private_key_pem, public_key_pem


# Función para generar JWT
def generate_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Función para crear y asignar token a UserLoginModel
def generate_and_assign_token(user: UserLoginModel):
    token_data = {
        "iat": datetime.utcnow(),
        "iss": 'DavidJuanJuanAndres',
        "sub": user.username,
        "name": user.username
    }
    user.token = generate_token(token_data)
    return user

# Función para verificar JWT
def verify_token(user: UserLoginModel):
    try:
        payload = jwt.decode(user.token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=403, detail="Credenciales no válidas")
        # Actualizar la instancia de UserLoginModel con información del token
        user.username = username
        return user
    except JWTError as e:
        raise HTTPException(status_code=403, detail="Token inválido o expirado")


def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Credenciales no válidas")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")


# RUTAS CONSUMIBLES
# Ruta para generar y guardar claves
@app.post("/generate-keys/")
def generate_keys_for_user(user: UserModel, user_agent: Annotated[str | None, Header()] = None):
    try:
        # Generar claves
        private_key, public_key = generate_keys()

        # Guardar en la base de datos
        user_data = {
            "username": user.username,
            "public_key": public_key
        }

        users_collection.insert_one(user_data)

        # Retornar respuesta con las claves y el usuario
        return {
            "username": user.username,
            "private_key": private_key,
            "public_key": public_key
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/getPublicKey/")
def get_public_key(user: str):
    userfinal = users_collection.find_one({"username": user})
    print(userfinal)
    return UserResponse(
        username=userfinal["username"],
        publicKey=userfinal["public_key"]
    )


@app.post("/register/")
def register_user(user: UserLoginModel):
    # Verificar si el usuario ya existe en la base de datos
    existing_user = login_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Usuario ya existe")

    # Guardar el usuario con la contraseña hasheada en la base de datos
    user_data = {
        "username": user.username,
        "password": user.password
    }

    login_collection.insert_one(user_data)

    return {"message": "Usuario registrado exitosamente"}


@app.post("/login/")
def login_user(user: UserLoginModel):
    # Buscar el usuario en la base de datos
    db_user = login_collection.find_one({"username": user.username})
    if not db_user:
        raise HTTPException(status_code=400, detail="Credenciales inválidas")

    # Verificar la contraseña
    if not user.password == db_user['password']:
        raise HTTPException(status_code=400, detail="Credenciales inválidas")

    # Generar y asignar el token JWT
    token = generate_and_assign_token(user)

    return {"access_token": token.token, "token_type": "bearer"}





@app.get("/")
def read_root():
    return {"Hello World"}