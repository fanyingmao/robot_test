// lord2.js
// Created by fanyingmao 一月/09/2018
//
var cwd = process.cwd();
var TestUtils = require(cwd + "/app/script/testUtils");

var START = 'start';
var END = 'end';
var ActFlagType = {
    ENTRY: 0,
    ENTER_SCENE: 1,
    ATTACK: 2,
    MOVE: 3,
    PICK_ITEM: 4
};
var DirectionNum = 8;
var testUtils = new TestUtils();
var monitor = function (type, name, reqId) {
    if (typeof actor !== 'undefined') {
        actor.emit(type, name, reqId);
    } else {
        console.error(Array.prototype.slice.call(arguments, 0));
    }
}


var sendRoomChatMessage = function () {
    // monitor(START, 'sendRoomChatMessage', ActFlagType.ENTRY);
    // testUtils.sendRoomChatMessage({message:"fdsafasfsdafsadfasfdsafdsafsdafsdaf"},function () {
    //     monitor(END, 'sendRoomChatMessage', ActFlagType.ENTRY);
    // });

    monitor(START, 'getPlayerMail', ActFlagType.ENTRY);
    testUtils.getPlayerMail({type:-2},function (msg) {
        monitor(END, 'getPlayerMail', ActFlagType.ENTRY);
    });

    // monitor(START, 'getPlayerRank', ActFlagType.ENTRY);
    // testUtils.getPlayerRank({isFriend: false, sortType: 1}, function (msg) {
    //     monitor(END, 'getPlayerRank', ActFlagType.ENTRY);
    // });


    setTimeout(function () {
        sendRoomChatMessage();
    }, 1000);
};
var start = function () {

    monitor(START, 'init', ActFlagType.ENTRY);
    testUtils.init(function () {
        monitor(END, 'init', ActFlagType.ENTRY);
        monitor(START, 'enter', ActFlagType.ENTRY);
        testUtils.enter({type: 0}, function (data) {
            monitor(END, 'enter', ActFlagType.ENTRY);
            monitor(START, 'getPlayerInfo', ActFlagType.ENTRY);
            testUtils.getPlayerInfo(data.user, function () {
                monitor(END, 'getPlayerInfo', ActFlagType.ENTRY);
                setTimeout(function () {
                    // monitor(START, 'startGame', ActFlagType.ENTRY);
                    // testUtils.startGame({roomType: 3}, function (msg) {
                    //     monitor(END, 'startGame', ActFlagType.ENTRY);
                    //     setTimeout(function () {
                    //         // sendRoomChatMessage();
                    //     }, 5000);
                    // });
                    sendRoomChatMessage();
                }, 10000);
            });
        });
    });
};

var starTime = Math.random() * 40 * 1000;

setTimeout(function () {
    start();
}, starTime);
