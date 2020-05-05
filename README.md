# PoinZ - Distributed Planning Poker

[![Build Status](https://travis-ci.org/Zuehlke/poinz.svg?branch=master)](https://travis-ci.org/Zuehlke/poinz)

PoinZ (/pɔɪnts/) is a simple web app for distributed teams in an agile setup. It allows to easily estimate items of interest (e.g. "stories").

The goal was to provide a ready-to-use tool without the hassle of registration/login, setup and a lot of configuration.

Checkout the App at [https://poinz.herokuapp.com/](https://poinz.herokuapp.com/)

![poinz_screenshot](https://cloud.githubusercontent.com/assets/1777143/13347877/846c4630-dc70-11e5-8c04-e5a03d18645d.png)

Similar tools are : https://www.pointingpoker.com/ or https://www.planningpoker.com/

## Technologies and Frameworks

The PoinZ Client is built with [ReactJS](https://facebook.github.io/react/) and [redux](https://github.com/reactjs/redux).
[Webpack](https://webpack.github.io/) serves as bundling tool.

The PoinZ Backend is a nodeJS [express](http://expressjs.com/) server.


### Style

Try to adhere to the [airbnb style guide](https://github.com/airbnb/javascript).

### Prerequisites

* Install nodejs
* Install git
* Install redis (as of https://github.com/Zuehlke/poinz/issues/8 rooms can be stored persistent in redis). See [Deployment](DEPLOYMENT.md) for more information.

Fork & checkout the repository then install all npm dependencies.

`$ npm install`  (This will also install *client* and *server* npm dependencies)

Start the backend

`$ cd server/ && npm start`

Start the client-serving in dev mode via webpack-dev-server

`$ cd client/ && npm run serve`

Then you can open the app at http://localhost:9000/webpack-dev-server/

## Build

Our build produces a docker image that contains nodejs and our poinz server.
Make sure you have docker installed on your machine and your user is in the "docker" usergroup. (```$ sudo groupadd docker``` and ```$ sudo usermod -aG docker $USER```)

*NOTE*: make sure to exit Zühlke VPN before running the build.

### 1. Install  npm dependencies

We need all dependencies of the server and the client installed.

```$ npm i``` within the project root will do that for us (postinstall in package.json)

### 2. Build & Pack for deployment

In project root, run

```bash
npm run build
```

This will copy all backend and client files to `deploy/`. 
And then start the docker build.

## Deployment

PoinZ is currently deployed on a free-tier heroku dyno. (currently without persistent room storage)...

### Heroku deployment

* Build Docker image with:

```bash
npm install
npm run build
```

* Login to Heroku with:

```bash
heroku auth:login
sleep 60
heroku container:login
docker login --username=_ --password=$(heroku auth:token) registry.heroku.com
```

* Push image to heroku registry:

```bash
heroku container:push web -a poinz-dk
```

* Release new image:

```bash
heroku container:release web -a poinz-dk
```
