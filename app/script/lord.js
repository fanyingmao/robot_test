
var cwd = process.cwd();
var mjplayer = require(cwd + "/app/script/mjplayer");

var starTime = Math.random() * 20 * 1000;
console.log("starTime = "+ starTime);
setTimeout(function () {
    mjplayer.guest();
}, starTime);