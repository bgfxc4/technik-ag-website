# technik-ag-website
A website to manage a technical inventory and book appointments


## Webclient 2
An one-site webclient, written in vue.js.

#### Build

In the `web-client-2` directory:
`$ npm i` to install the dependencies
`$ npm run build` to build to the `dist` directory

#### Configuration

#####.env:
example:
```
VUE_APP_ApiServerUrl=https://bgfxc4.de/technikag-api
VUE_BASE_URL=/
RELATIVE_PATH=/technikag/
```
* `VUE_APP_ApiServerUrl`: the URL to the endpoint of the API
* `VUE_BASE_URL`: the folder that is prepended in front of the URL in the browser by the vue-router
* `RELATIVE_PATH`: similar to `VUE_BASE_URL` but used by `vue-cli build`

##### Webserver:
the vue-router needs some additional configuration by the Webserver, here for example for Apache:
```html
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /ur-subdirectory-path/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /ur-subdirectory-path/index.html [L]
</IfModule>
```
nginx:
```json
location /ur-subdirectory-path/ {
  try_files $uri $uri/ /index.html;
}
```
More information at https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations



## Server
#### Installation
After cloning the repo with `$ git clone https://github.com/bgfxc4/technik-ag-website`:

In the `server` directory execute:
`$ npm i` to install the dependencies
`$ npm run start` to start the server
**NOTE**: Before starting the server you have to configure it. See #Configuration

#### Configuration
Create `server/configs/config.json`
Example:
```JSON
{
	"main_server_port": 5560,
	"mongo_url": "mongodb://localhost:27017",
	"users": [
		add here your login hashes of the users in the format
		sha512(sha512("technikag[username]:[password]")), Eg sha512(sha512("technikagTestUserName:TestPassword"))
	]
}
```
* `main_server_port`: the port you want the server to listen on
* `mongo_url`: the url to the mongodb server you want to use
* `users`: an array of strings, each corresponding to one admin user. To get such a string, you hash `technikag[username]:[password]` two times with `sha512`, where you replace `[username]` and `[password]` with the login credential of your admin