var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({ port: 1234 });

var fs = require('fs');
var dateFormat = require('dateformat');




var wstream;



wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log(message);
     switch(message){
        case 'newcapture':
            if(wstream) wstream.close();
            wstream = fs.createWriteStream('Captures/'+dateFormat(new Date(), "yyyy-mm-dd HH:MM"));
            break;
        case 'stopcapture':
            wstream.close()
        default:
            wstream.write(message+'\n\n');
     }
  });

});
