# Drag&drop file uploading

## About
Demo project using Laravel PHP framework on backend and EmberJS on frontend.

Dependancies:
  - PHP
  - MySQL
  - npm
  - composer
  - ffmpeg
  - gd2

## Configuration

### .env
`cp .env.example .env`

In `.env` set MySQL settings.

For storing files on Amazon S3, set:
```
STORAGE=s3
S3KEY=
S3SECRET=
S3REGION=
S3BUCKET=
```

For mp4 thumbnail generating also set paths:
```
FFMPEG=/usr/bin/ffmpeg
FFPROBE=/usr/bin/ffprobe
```

### Production

Run in root folder `make install`. Check for Nginx settings below.

### Development

Run in root folder `make develop` and wait until `Serving on http://localhost:4200/`.



### Nginx
```
server {
  listen 80;
  listen [::]:80;
  server_name files.grosek.si;
  return 301 https://$server_name$request_uri;
}

server {
    listen [::]:443 ssl;
    listen 443 ssl;
    server_name files.grosek.si;

    ssl_certificate /etc/letsencrypt/live/files.grosek.si/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/files.grosek.si/privkey.pem;
    ssl_dhparam /etc/ssl/certs/dhparam.pem;

    index index.html index.htm index.php;

    location / {
      root /var/www/files.grosek.si/frontend/dist;
      try_files $uri /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|eot|otf|ttf|woff)$ {
        root /var/www/files.grosek.si/frontend/dist;
        add_header Access-Control-Allow-Origin *;
        access_log off; log_not_found off; expires 30d;
    }

    location /api {
      client_max_body_size 500m;
      index index.php index.html index.htm;
      root /var/www/files.grosek.si/public;
      try_files $uri /public /index.php =404;
      fastcgi_split_path_info ^(.+\.php)(/.+)$;
      fastcgi_pass unix:/run/php/php7.0-fpm.sock;
      fastcgi_index index.php;
      include fastcgi.conf;
    }
}
```
