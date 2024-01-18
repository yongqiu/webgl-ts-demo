FROM nginx AS base
COPY ./dist ./usr/share/nginx/html/app
COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
