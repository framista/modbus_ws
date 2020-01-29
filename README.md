# modbus_ws

## General info
Aplication to write/read register and scan coil using modbus-TCP
## Technologies
* JavaScript
    * modbus-serial
    * ws
    * webpack
    * babel
* CSS3
    * bootstrap
* HTML5

## Setup
To clone and run this application, you'll need Git and Node.js (which comes with npm) installed on your computer. From your command line:
```
# Clone this repository
$ git clone https://github.com/framista/modbus_ws.git

# Go into the repository
$ cd modbus_ws

# Go into the server
$ cd server/
# Install dependencies 
$ npm install
# Run the server
$ node src/server

# Go into the client
$ cd client/
# Install dependencies 
$ npm install
# Open index.html
```

## Features
* communication using websocket
* read/write register using modbus
* scan coil
