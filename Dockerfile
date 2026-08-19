# Le dices a Docker que traiga un servidor Nginx súper ligero
FROM nginx:alpine

# Le dices que copie todos tus archivos a la carpeta pública del servidor
COPY . /usr/share/nginx/html