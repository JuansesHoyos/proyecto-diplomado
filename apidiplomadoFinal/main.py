import os
from datetime import timedelta, datetime, timezone
from typing import Optional

import gridfs
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from fastapi import FastAPI, HTTPException, Header, File, UploadFile, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.security import HTTPBearer
import jwt
from jwt import ExpiredSignatureError
from pydantic import BaseModel
from pymongo import MongoClient
from starlette.middleware.cors import CORSMiddleware

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from starlette.responses import JSONResponse

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Configuración de los tokens
SECRET_KEY = """"
MIIEowIBAAKCAQBH/rX1D77cYRH82bsq1Beqs98A50xxVIWrQ/+64LXcYO6MMNy4
pauVB/8+pWLdRsbMQQyhdFblST/67vqh4ZnQNpxQrdlgc7VruPoqqH+CbjdExF7C
BkBM5FUD3Wo4DzaxszXDO8fPzjtxlzlIiNg2sn73cjhdNwZ5x1yQixM57tUZ9jnI
BNKGsMWshm4kj5RIrD/Eh7kJt80jBoDAACh1fBPlAIBT8vOkqCUGhMIEVbn69hYq
DGMm6aE3gXq8YwzMQl870hKJHnN3TRNvEcC6pZOouvWuVcuewjtZjUV8OiMIPkoa
4fZRb2SlrD1HQhbpsY7YKrQCndGwj0FlD4LbAgMBAAECggEACP/NvtQ5B1Ma7IBK
5Q+d5biWJ4bCB2iJTN8zGCj+ko2LQ/rXnD0ZNYfKYApMUVyHfQCkk4n3UrHVTYiR
y6pnj59D6tHQWj4cb1qv6qUlSyh7wBzLu3UMlI/2EIWcwWUlcRD1p3HRiCg/RfOh
NW/llvC47jVY1k4KgS5qY6b+wD74Z6nxcykP0PEsiQUpvZYrOZWDiCcsyneRVSW5
VGMUn8b0luo5V6RFcuGTnNqJ83dxUQMCJxKC7Zvek4ro0RaDiZHhCeqFYva0ZQzc
w5Up1MnSACKxUOhGJtJh0XLgel3LQJtUEV1D9ME4lkJdyzwDucab1nlzFnW/ayeT
bbcAAQKBgQCPFKjcarxvfoEEh/A27Vu6HvJpQg7X38Y6MPCSjkvGqSJ/93kuv/zb
Ssn12y2HmnKQ+s7svsSlyf4Ck5AQXNnrOlJYIpvs5mlFZz6/oZwMVoefukAemES5
1kHP2fRhHVpwRgXxO49UJpMaX5trWfve8AZgjC5axkYE0h4ZWi2kYQKBgQCA0DqU
dHRLOCfVUwihITSTq7PtlSM5nM60jF16YNEZtXzw/pDPhQkvoKX7N+YD+dgCvISQ
GqJtW/U9KKWHf458kUSyOtmrNtRzMgRFSeZJFIC9ntVLeURZT7wmYPNU9O2FzwOz
ecf3mrLfijkxgHfAS1iBY1IMvREd1zkzYI5wuwKBgQCFibSoM343WQw1HGKYASPx
K9z3XE3aMOIjgXWmcuRKP6URZflWJp1qVfz0V2HBA+cVZOAnmUyTp1hJM0vr2Z0R
q9capwJ8MffibJ/l3oF0CnZ+Hyik5VyPTWcTBMrOsMStsMzu/rWgxnfYz46QvOUU
h1SMW4kP86l56llpM/8RQQKBgBsHFfOGR8xsmPcKuBnO9NAzS8qC62QwQbLibM67
t8QUL4YFc+8G8/l5VLpUbT/SUX+pfIsb+47Ep71QZQL8QbJjbK2U6Y0iMQuGqBy9
t8MHuUeQJyLx6+RtdYX7+7KMvbXAzP8Ag3OxkuySfROk5/uCE6z6YQHpPcksGoVs
Mhb3AoGBAI0xS/a5QmKEYb2zcttLb2XymOerIjeoKwxqql9ezdfoHLzo/t+5yf1y
MFV8I5IrbXSZzqsvKr80rQWNc2b+5BgsOxNQ2J+xpu5NWL20bueAZwusTShRtLL6
D+m1G7AJ0RJgilf4cghcMYYOBL3AGXPdAgFaCSOoSL9S27E5aoO+
"""
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120
ISSUER = "DavidJuanJuanAndres"
AUDIENCE = "Proyecto Diplomado"

# Definición del esquema de seguridad JWT
security = HTTPBearer()

# Conexión a MongoDB
#dburl = os.getenv('MONGO_URL', 'mongodb://localhost:27017/pruebaDB')
dburl = os.getenv('MONGO_URL', 'mongodb://persistencia:27017/pruebaDB')
client = MongoClient(dburl)
db = client["pruebaDB"]
users_collection = db['Usuario']
login_collection = db['Login']
docs_collection = db['Documentos']

# Definición de la aplicación FastAPI
app = FastAPI()
fs = gridfs.GridFS(db)

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
    identificador: str


class UserLoginModel(BaseModel):
    username: str
    password: Optional[str]
    token: Optional[str] = None


class GenerateKeysInput(BaseModel):
    username: str
    identificador: str


class FileInput(BaseModel):
    doc: str
    owner: str
    shared: str
    signatures: str


# Funciones
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
        "nbf": datetime.utcnow(),
        "iss": ISSUER,
        "sub": user.username,
        "name": user.username,
        "aud": AUDIENCE
    }
    signeduser = generate_token(token_data)
    return signeduser


# Función para verificar JWT
def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], audience=AUDIENCE, issuer=ISSUER)

        username: str = payload.get("sub")
        exp: int = payload.get("exp")
        nbf: int = payload.get("nbf")

        # Validar atributos del token
        if username is None:
            raise HTTPException(status_code=403, detail="Nombre de usuario no válido")
        current_time = datetime.now(timezone.utc).timestamp()
        if exp is None or exp <= current_time:
            raise HTTPException(status_code=403, detail="Token expirado")
        if nbf is None or nbf >= current_time:
            raise HTTPException(status_code=403, detail="Token no válido aún")

        return True

    except HTTPException:
        raise HTTPException(status_code=403, detail="Token inválido")
    except ExpiredSignatureError:
        raise HTTPException(status_code=403, detail="Token expirado")

    except Exception as e:
        print("Exception", type(e))
        raise HTTPException(status_code=403, detail="Error inesperado")


def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Credenciales no válidas")
        return username
    except:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")


# RUTAS CONSUMIBLES
# Ruta para generar y guardar claves
@app.post("/generate-keys/")
def generate_keys_for_user(input: GenerateKeysInput, authorization: Optional[str] = Header(None)):
    try:
        # Se revisa si el token viene en el header de la petición
        if authorization is None:
            raise HTTPException(status_code=401, detail="Authorization header missing")

        # Se extrae el token limpio sin el bearer
        token = authorization.split(" ")[1] if " " in authorization else authorization

        # Verificar el token
        if not verify_token(token):
            raise HTTPException(status_code=401, detail="Invalid token")

        # Generar llaves
        private_key, public_key = generate_keys()

        # Guardar las llaves en base de datos (solo la llave publica)
        user_data = {
            "username": input.username,
            "public_key": public_key,
            "identificador": input.username + input.identificador
        }

        users_collection.insert_one(user_data)

        # Retornar el usuario y las llaves
        return {
            "username": input.username,
            "private_key": private_key,
            "public_key": public_key
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/getPublicKey/")
def get_public_key(user: str):
    userfinal = users_collection.find_one({"username": user})
    print(userfinal)
    username = userfinal["username"]
    id_llave = userfinal["identificador"].replace(username, "")
    return UserResponse(
        identificador=id_llave,
        username=username,
        publicKey=userfinal["public_key"],
        privateKey="¡Por seguridad, la llave privada no se almacena en el sistema!"
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

    # Generar el token y retornarlo
    token = generate_and_assign_token(user)
    full_user = {"username": user.username, "token": token}
    return full_user


@app.get("/getKeys")
def get_user_keys(user: str, authorization: Optional[str] = Header(None)):
    try:
        # Se revisa si el token viene en el header de la petición
        if authorization is None:
            raise HTTPException(status_code=401, detail="Authorization header missing")
        # Se extrae el token limpio sin el bearer
        token = authorization.split(" ")[1] if " " in authorization else authorization
        # Verificar el token
        if not verify_token(token):
            raise HTTPException(status_code=401, detail="Invalid token")

        # Buscar las llaves del usuario en la base de datos
        llaves_cursor = users_collection.find({"username": user})
        llaves_list = list(llaves_cursor)

        # Convertir cada documento a una instancia de UserResponse
        llaves_serializable = [
            UserResponse(
                username=doc["username"],
                publicKey=doc["public_key"],
                identificador=doc["identificador"]
            )
            for doc in llaves_list
        ]

        # Convertir a JSON serializable
        return jsonable_encoder(llaves_serializable)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/upload-file/")
async def upload_file(file: FileInput, authorization: Optional[str] = Header(None)):
    try:
        # Se revisa si el token viene en el header de la petición
        if authorization is None:
            raise HTTPException(status_code=401, detail="Authorization header missing")
        # Se extrae el token limpio sin el bearer
        token = authorization.split(" ")[1] if " " in authorization else authorization
        # Verificar el token
        if not verify_token(token):
            raise HTTPException(status_code=401, detail="Invalid token")

        docs_collection.insert_one({})

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al subir el archivo: {str(e)}")


@app.get("/")
def read_root():
    return {"Hello World"}
