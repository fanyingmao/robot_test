var http = require('http');
var socket = require('socket.io-client')('http://192.168.0.2:40000');

socket.on('connect', function(){
    console.log('连接成功');    
});
socket.on('disconnect', function(){
    console.log('disconnect');
});
socket.on('errReport', function(data){
    console.log('errReport:'+data);
});
socket.on('login_gold_result', function(data){
    console.log('login_gold_result:');
    console.log(data);
});
socket.on('login_result', function(data){
    console.log('login_result:');
    console.log(data.errmsg)
    if(data.errmsg == 'ok'){
        socket.emit('ready','');
    }
});
socket.on('gold_Result', function(data){
    console.log('gold_Result:');
    console.log(data);
});
socket.on('login_hall_result', function(data){
    console.log(data);
    if(data.errmsg == 'ok'){
        var sd = {
            userId: socket.userid,
            name: socket.name,
            type: 'primary',
            gameId:2,
        };
        socket.emit('entry_coins',JSON.stringify(sd));
    }
})
socket.on('Game_Message',function(data){    
    // SUB_S_OUT_CARD			:	101	,								//出牌命令
    // SUB_S_SEND_CARD			:	102	,								//发送扑克
    // SUB_S_LISTEN_CARD		:	103	,								//听牌命令
    // SUB_S_OPERATE_NOTIFY	:	104	,								//操作提示
    // SUB_S_OPERATE_RESULT	:	105	,								//操作命令
    // SUB_S_GAME_END			:	106	,								//游戏结束
    // SUB_S_TRUSTEE			:	107	,								//用户托管
    // SUB_S_APPLIQUE			:	108	,								//用户补花
    // SUB_S_KARATGOLD			:	109	,								//开金
    // 有碰杆胡提示
    if(data.wSubCmdID == 104){
        // 直接过
        var sd = {
            cbSendBuf: {cbOperateCode:0,cbOperateCard:data.cbSendBuf.cbActionCard},
            wMainCmdID: 100,
            wSubCmdID: 3,
        };
        socket.emit('Game_Msg',JSON.stringify(sd));
        // 碰
        // if(data.cbSendBuf.cbActionMask == 8){

        // }
    }

    else if(data.wSubCmdID == 106){
        socket.emit('ready','');
    }
    else if(data.wSubCmdID == 102){
        var sd = {
            cbSendBuf: {cbCardData:data.cbSendBuf.cbCardData},
            wMainCmdID: 100,
            wSubCmdID: 1,
        };
        socket.emit('Game_Msg',JSON.stringify(sd));
    }

    
    console.log('Game_Message');
    console.log(data);
});
socket.on('game_sync_push',function(data){
    console.log('game_sync_push');
    console.log(data);
});

// 游客登陆
function guest(){
    var options = {
        host: 'localhost',
        port: 8000,
        path: '/guest?account=guest_YK'+new Date().getTime()+'XX',
        method: 'GET',
    };
    // 向服务端发送请求
    var req = http.request(options, function(res){
        var body = '';
        res.on('data', function(data) {
            body += data;
        });   
        res.on('end', function() {
            console.log(body);
            body = JSON.parse(body);
            
            if(body.isExist == 0){
                guestReg(body.account,body.sign);
            }
        });
    });
    req.end();
}

// 游客注册
function guestReg(account,sign)
{
    var name = '压力测试:'+new Date().getTime()+'号';
    var path = '/guestReg?account='+account+'&sign='+sign+'&name='+encodeURI(name);
    var options = {
        host: 'localhost',
        port: 8000,
        path: path,
        method: 'GET',
    };
    // 向服务端发送请求
    var req = http.request(options, function(res,body){
        body = '';
        res.on('data', function(data) {
            body += data;
        });
        res.on('end', function() {
            console.log(body);
            body = JSON.parse(body);
            if(body.errmsg == 'ok'){
                loginHall(body.account,body.sign);
            }
        });
    });
    req.end();
}
// 用户登陆
function loginHall(account,sign)
{
    var path = '/loginHall?account='+account+'&sign='+sign;
    var options = {
        host: 'localhost',
        port: 8000,
        path: path,
        method: 'GET',
    };
    // 向服务端发送请求
    var req = http.request(options, function(res,body){
        body = '';
        res.on('data', function(data) {
            body += data;
        });   
        res.on('end', function() {
            console.log('用户登陆');
            console.log(body);            
            body = JSON.parse(body);
            socket.userid = body.userid;
            socket.name = body.name;
            if(body.errmsg == 'ok'){
                getServerParam(account,body.userid);
            }
        });
    });
    req.end();
}
// 重连获取token
function getServerParam(account,userid)
{
    global.guser = userid;
    var path = '/get_server_param?userId='+userid;
    var options = {
        host: 'localhost',
        port: 8001,
        path: path,
        method: 'GET',
    };
    var req = http.request(options, function(res,body){
        body = '';
        res.on('data', function(data) {
            body += data;
        });   
        res.on('end', function() {
            console.log(body);
            body = JSON.parse(body);
            var sd = {
                token: body.token,
                sign: body.sign,
                time: body.time,
            };
            socket.emit('login_hall',JSON.stringify(sd));
        });
    });
    req.end();
}
// 获取用户金币、钻石、彩券
function getUserStatus(account,sign)
{
    var path = '/get_user_status?account='+account+'&sign='+sign;
    var options = {
        host: 'localhost',
        port: 8001,
        path: path,
        method: 'GET',
    };
    // 向服务端发送请求
    var req = http.request(options, getUserStatusCallback);
    req.end();
}
// 获取用户基本信息
function baseInfo(userid)
{
    var path = '/loginHall?userid='+userid;
    var options = {
        host: 'localhost',
        port: 8001,
        path: path,
        method: 'GET',
    };
    // 向服务端发送请求
    var req = http.request(options, baseInfoCallback);
    req.end();
}
// 服务器是否在线
function isServerOnline(account,sign)
{
    var path = '/is_server_online?account='+account+'&sign='+sign;
    var options = {
        host: 'localhost',
        port: 8001,
        path: path,
        method: 'GET',
    };
    // 向服务端发送请求
    var req = http.request(options, isServerOnlineCallback);
    req.end();
}
// 加入房间
function joinRoom()
{

}


// 开始
module.exports.guest = guest;
