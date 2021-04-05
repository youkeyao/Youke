# Youke
This is my website including homepage, profile, icloud and some WebGL games built by Unity.

## Home
It contains scrolling images which changes every 6 seconds. The interval and the switch time are controlled by the variable `interval` and `switchTime` respectively in `JS/index.js`.

You can add more images into `imglist` in `index.html`. Images are located in `/homeImg`.

## Profile
Just put the profile under the `<hr />` in `cv.html`.

## iCloud
All files are restored in `/icloud`. You can upload and make new file when you haven't choose a file. After you choose a file, you can download or remove it.

## Game
You can add more games into `/game`. Just update the `nav` in all htmls and `preview` in `game.html`.

## Config for nginx
nginx.conf
```
client_max_body_size 2048m; //max size

location / {
    root ; //Your directory

    index index.html;

    #try_files $uri $uri/ =404;
}

location ~ \.php$ {
    root ; //Your directory

    fastcgi_pass   unix:/run/php/php7.3-fpm.sock;#socket mode

    #fastcgi_pass   127.0.0.1:9000;#tcp mode

    fastcgi_param  SCRIPT_FILENAME $document_root$fastcgi_script_name;

    include        fastcgi_params;
}
```

## config for php
fpm/php.ini
```
post_max_size = 2048M

upload_max_filesize = 2048M

max_execution_time = 600

max_input_time = 600
```