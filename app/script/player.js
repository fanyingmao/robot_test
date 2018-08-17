// player.js
// Created by fanyingmao 十一月/03/2017
//
var testUtils = require("./testUtils");


var player = function () {
    this.testUtils = new testUtils();
};

player.prototype.start = function () {
    var salf = this;
    salf.testUtils.init(function () {
        salf.testUtils.enter({type: -1}, function (data) {
            salf.testUtils.getPlayerInfo(data.user, function () {
                setTimeout(function () {
                    salf.testUtils.startGame({roomType: 5}, function (msg) {
                        console.log(msg);
                    });
                },1000);
            });
        });
    });
};

module.exports = player;