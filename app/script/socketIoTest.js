// socketIoTest.js
// Created by fanyingmao 六月/13/2018

// Add a connect listener

var io = require('socket.io-client'),
  socket = io.connect('localhost', {
    port: 40000
  });
socket.on('connect', function () { console.log("socket connected"); });
socket.emit('private message', { user: 'me', msg: 'whazzzup?' });
console.log("socket connected");