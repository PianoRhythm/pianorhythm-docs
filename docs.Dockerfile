FROM nginx

COPY ./docker/nginx_old.conf /etc/nginx/conf.d/default.conf
COPY ./dist/ /usr/share/nginx/html

EXPOSE 80/tcp