FROM nginx

COPY ./pianorhythm-docs/docker/nginx_old.conf /etc/nginx/conf.d/default.conf
COPY ./public/docs/ /usr/share/nginx/html

EXPOSE 80/tcp