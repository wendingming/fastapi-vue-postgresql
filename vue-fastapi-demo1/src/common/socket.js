
import {buildWebsocket} from '@/api/system/webso';
var url = 'ws://0.0.0.0:7272'
var ws;
var tt;
var lockReconnect = false;//避免重复连接


var websocket = {
    Init: function() {
        if ("WebSocket" in window) {
            ws = new WebSocket(url);
        } else if ("MozWebSocket" in window) {
            ws = new MozWebSocket(url);
        } else {
            console.log("您的浏览器不支持 WebSocket!");
            return;
        }

        ws.onmessage = function(e) {
            console.log("接收消息:" + e.data)
            let msg = JSON.parse(e.data);
            if(msg.type=='init'){
                let param = {"id":msg.client_id};
                buildWebsocket(param).then((res)=>{
                    console.log(res);
                })
            }
            console.log(msg);
            // switch (msg.type) {
            //  case 'init':
            //  console.log(msg.client_id);
            //  break;
            //  case 'ping':
            //  console.log("这是心跳");
            // }
            //heartCheck.start()
            // if(e.data=='ok'){//心跳消息不做处理
            //   return
            // }
            //messageHandle(e.data)
        }

        ws.onclose = function() {
            console.log("连接已关闭")
            reconnect();
        }

        ws.onopen = function() {
            console.log("连接成功")

            //heartCheck.start();
        }

        ws.onerror = function(e) {
            console.log("数据传输发生错误");
            console.log("开始重连")
            /*Message({
                  message: '数据传输发生错误',
                  type: 'error',
            });*/
            reconnect()
        }
    },

    getWebSocket(){
        return ws;
    },

    getStatus() {
        if (ws.readyState == 0) {
            return "未连接";
        } else if (ws.readyState == 1) {
            return "已连接";
        } else if (ws.readyState == 2) {
            return "连接正在关闭";
        } else if (ws.readyState == 3) {
            return "连接已关闭";
        }
    }
}

export default websocket;



function reconnect() {
    if(lockReconnect) {
        return;
    }
    lockReconnect = true;
    //没连接上会一直重连，设置延迟避免请求过多
    tt && clearTimeout(tt);
    tt = setTimeout(function () {
        console.log("执行断线重连...")
        websocket.Init();
        lockReconnect = false;
    }, 4000);
}

//心跳检测
var heartCheck = {
    timeout: 1000 * 60 * 3,
    timeoutObj: null,
    serverTimeoutObj: null,
    start: function(){
        console.log('开始心跳检测');
        var self = this;
        this.timeoutObj && clearTimeout(this.timeoutObj);
        this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
        this.timeoutObj = setTimeout(function(){
            //这里发送一个心跳，后端收到后，返回一个心跳消息，
            //onmessage拿到返回的心跳就说明连接正常
            console.log('心跳检测...');
            ws.send("pong");
            self.serverTimeoutObj = setTimeout(function() {
                if(ws.readyState!=1){
                    ws.close();
                }
                // createWebSocket();
            }, self.timeout);

        }, this.timeout)
    }
}
