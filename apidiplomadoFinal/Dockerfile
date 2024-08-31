# Etapa 1: Construcción de la aplicación FastAPI
FROM python:3.10-slim

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de requerimientos al contenedor
COPY requirements.txt .

# Instala las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código de la aplicación al contenedor
COPY . .

# Expone el puerto en el que se ejecutará la aplicación
EXPOSE 8000

# Comando para ejecutar la aplicación usando Uvicorn, especificando el archivo main.py
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
