// testUtils.js
// Created by fanyingmao 十一月/03/2017
//
var pomelo_client = require('pomelo-node-client-websocket');
var pomelo;

var connectCenterServer = function () {
    pomelo = pomelo_client.create();
};

var instance = null;

// 单例模式
module.exports.getInstance = function (cb) {
    if (!instance) {
        instance = new connectCenterServer();
        // instance.init(cb);
    }
    return instance;
};

connectCenterServer.prototype.init = function (cb) {
    this.config = {
        // host: "127.0.0.1", // 服务器IP
        host: "47.52.92.163",
        port: 3014 // 服务器端口
    };
    pomelo.init({
        host: this.config.host,
        port: this.config.port
    }, function () {
        var route = 'gate.gateHandler.queryEntry';
        console.log(route);
        pomelo.request(route, {}, function (data) {
            if (data.code === 1) {
                pomelo.disconnect();
                pomelo.init({
                    host: data.host,
                    port: data.port
                }, function () {
                    console.log("中心服务器连接成功");
                    cb && cb();
                });
            } else {
                console.error("中心服务器连接失败");
                cb && cb({
                    code: 2
                });
            }
        });
    });
};

connectCenterServer.prototype.enter = function (msg, cb) {
    var route = 'connector.entryHandler.enter';
    console.info(route);
    pomelo.request(route, msg, function (data) {
        if (data.code === 1) {
            console.error("登录成功");
            pomelo.on("getItemOrRes",function (data) {
                console.log("=========="+JSON.stringify(data));
            });
            cb && cb(data);
        } else {
            console.error("登录失败");
        }
    });
};

connectCenterServer.prototype.getPlayerInfo = function (msg, cb) {
    var route = 'area.playerHandler.getPlayerInfo';
    console.info(route);
    pomelo.request(route, msg, function (data) {
        pomelo.on("onNoticePlayer",function (data) {
            console.log(data);
        });
        if (data.code === 1) {
            console.error("getPlayerInfo成功");
            cb && cb(data);
        } else {
            console.error("getPlayerInfo失败");
        }
        console.error("name = "+data.name);
        cb(data);
    });
};

connectCenterServer.prototype.startGame = function (msg, cb) {
    var route = 'area.publicMJHandler.startGame';
    pomelo.request(route, msg, function (data) {

        if (data.code === 1) {
            console.error("加入成功 " + JSON.stringify(data));
            cb && cb();
        } else {
            console.error("加入失败");
        }
    });
};

connectCenterServer.prototype.useItems = function (msg, cb) {
    var route = 'area.publicHandler.useItems';
    pomelo.request(route, msg, function (data) {
        console.error(data);
        if (data.code === 1) {
            console.error("加入成功 " + JSON.stringify(data));
            cb && cb();
        } else {
            console.error("加入失败");
        }
    });
};

connectCenterServer.prototype.getPlayerMail = function (msg, cb) {
    var route = 'area.publicHandler.getPlayerMail';
    console.info(route);
    pomelo.request(route, msg, function (data) {
        console.error(data);
        if (data.code === 1) {
            console.error("getPlayerMail成功 " + JSON.stringify(data));
            cb && cb();
        } else {
            console.error("getPlayerMail失败");
        }
    });
};

connectCenterServer.prototype.getGameRecord = function (msg, cb) {
    var route = 'area.publicHandler.getGameRecord';
    pomelo.request(route, msg, function (data) {
        console.error(data);
        if (data.code === 1) {
            console.error("加入成功 " + JSON.stringify(data));
            cb && cb();
        } else {
            console.error("加入失败");
        }
    });
};

connectCenterServer.prototype.getPlayerRank = function (msg, cb) {
    var route = 'area.publicHandler.getPlayerRank';
    pomelo.request(route, msg, function (data) {
        console.error(data);
        if (data.code === 1) {
            console.error("getPlayerRank成功 " + JSON.stringify(data));
            cb && cb();
        } else {
            console.error("getPlayerRank失败");
        }
    });
};

connectCenterServer.prototype.sendRoomChatMessage = function (msg, cb) {
    var route = 'area.publicMJHandler.sendRoomChatMessage';
    pomelo.request(route, msg, function (data) {
        cb && cb();
        console.error("getPlayerRank失败");
    });
};

module.exports = connectCenterServer;