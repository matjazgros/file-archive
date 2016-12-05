# Drag&drop file uploading

## About
Demo project using Laravel PHP framework on backend and EmberJS on frontend.

Dependencies:
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

Run in root folder `make install`. Check for Nginx settings below and don't forget to change `files.grosek.si`.

### Development

Run in root folder `make develop` and wait until `Serving on http://localhost:4200/`.



### Nginx
```
server {
    listen 80;
    listen [::]:80;
    server_name files.grosek.si;

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
