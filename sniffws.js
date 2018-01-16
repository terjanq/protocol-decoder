/*
[+] - show captures
[\]  - enable/disable capturing

*/


window.My = {};

_WebSocket = window.WebSocket;

window.LOL = {};
window.WS = {};

var captureEnabled = true;
var captureAll = false;

function ssend(data){
    WS.onmessage({data: (new Uint8Array(data.split(" "))).buffer});
}


var decoder = new TextDecoder("utf-8");
capture = new _WebSocket('ws://localhost:1234');


capture.onopen = function() { console.log("capture opened"); if(captureEnabled) capture.send("newcapture"), console.log("###started recording###") };
capture.onclose  = function() { console.log("capture closed")};

window.addEventListener("keyup", function(e){
    if(e.keyCode == 220){
        if(capture.readyState==1)
            if(captureEnabled) capture.send("stopcapture"), console.log("###stopped recording###");
            else capture.send("newcapture"), console.log("###started recording###");
        else{
            capture = new _WebSocket('ws://localhost:1234');
            capture.onopen = function(){
                console.log("capture opened");

                if(captureEnabled) capture.send("stopcapture"), console.log("###stopped recording###");
                 else capture.send("newcapture"), console.log("###started recording###");
             };

             capture.onclose = function(){console.log("capture closed")};

        }
        captureEnabled ^= 1;
    }

});

window.addEventListener("load", function(){
document.body.insertAdjacentHTML("afterbegin", '<div id="log" style="padding:4px;position:absolute; top:0; left:0; width: 150px; height: 30px; z-index:2000; background:rgba(0,0,0,0.9); color:white">asda</div>');
});

function log(x, y){
    if(document.getElementById("log"))
    document.getElementById("log").innerHTML = "X: " + ~~x + " Y: " + ~~y;
}

function refer(master, slave, prop) {
    Object.defineProperty(master, prop, {
        get: function(){
            return slave[prop];
        },
        set: function(val) {
            slave[prop] = val;
        },
        enumerable: true,
        configurable: true
    });
};

window.WebSocket = function(url, protocols) {

    console.log('Listen');

    if (protocols === undefined) {
        protocols = [];
    }

    var ws = new _WebSocket(url, protocols);
    // ws = {};

    refer(this, ws, 'binaryType');
    refer(this, ws, 'bufferedAmount');
    refer(this, ws, 'extensions');
    refer(this, ws, 'protocol');
    refer(this, ws, 'readyState');
    refer(this, ws, 'url');


    this.close = function() {
        return ws.close.call(ws);
    };

    this.onopen = function(event) {};
    this.onclose = function(event) {};
    this.onerror = function(event) {};
    this.onmessage = function(event) {};


    // this.onopen.call(ws, this) ;
    // this.readyState = 1;


    ws.onopen = function(event) {
        this.readyState = 1;
        console.log(url);
        My.dx = 0;
        My.dy = 0;
        My.xlength = 14121;
        My.ylength = 14121;


        if (this.onopen)
            return this.onopen.call(ws, event);

    }.bind(this);

    this.send = function(data) {
        var dv = new DataView((new Uint8Array(data)).buffer);
        // if(dv.getUint8(0) == 255) console.log("out", (new Uint8Array(dv.buffer)).join());
        switch(dv.getUint8(0)){
            case 16:

                // log(dv.getInt32(1, true) - My.dx, dv.getInt32(5, true) - My.dy);
                break;
        }


         if(captureEnabled && (dv.getUint8(0) != 5 || captureAll))
         capture.send("out,"+(new Uint8Array(data)).join());

        // sniff here
        // console.log((new Uint8Array(data)).join());
        return ws.send.call(ws, data);
    };

    ws.onmessage = function(event) {
        // sniff here (message = event.data)

        var dv = new DataView(event.data);
        // console.log((new Uint8Array(dv.buffer)).join());


        if(dv.getUint8(0) == 0) return;
        if(captureEnabled && (dv.getUint8(0) != 5 || captureAll))
            capture.send("in,"+(new Uint8Array(event.data)).join());


        if(dv.getUint8(0) == 255){


                for(var i=0; i<dv.byteLength - 31; i++){



                var mix = dv.getFloat64(i, true);
                var miy = dv.getFloat64(i+8, true);
                var mx  = dv.getFloat64(i+16, true);
                var my = dv.getFloat64(i+24, true);

                 if(mx - mix > 14E3 && my - miy > 14E3 && mx - mix < 15E3 && my - miy < 15E3){
                    My.dx = mix + 7071;
                    My.dy = miy + 7071;

                    // console.log(dv.byteLength,i, i+32, (new Uint8Array(dv.buffer)).join());
                 }
             }

        }

        // ws.onmessage =
        // if(dv.getUint8(0)!=255 || dv.getUint8(1)!=40)
            return this.onmessage.call(ws, event);
        // else console.log("skipped(40)")
    }.bind(this);

    window.Send = ws.onmessage;


    ws.onclose = function(event) {
        if (this.onclose)
            return this.onclose.call(ws, event);
    }.bind(this);

    ws.onerror = function(event) {
        if (this.onerror)
            return this.onerror.call(ws, event);
    }.bind(this);


    window.WS = ws;


};

window.WebSocket.prototype = _WebSocket;