window.arrays = [];
window.packets = [];

var Decoder = new TextDecoder("utf-8");


function readTextFile(file, callback)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                callback(rawFile.responseText);
            }
        }
    }
    rawFile.send(null);
}


$(".captures a").click(function(e){
    $(".captures a").removeClass('active');
    $(this).addClass('active');
    e.preventDefault();
   readTextFile('./Captures/'+this.innerHTML, function(e){
        window.packets = e.split('\n\n');
        window.arrays = [];
        $(".packets ul").html("");
        var out = "";
        for(var i=0; i<packets.length - 1; i++){
            var splitted = packets[i].split(',');
            window.arrays.push(new DataView((new Uint8Array(splitted)).buffer));
            var I = 1;
            var cl = '"';
            if(splitted[0] == "out") cl = 'out"';
            else if (splitted[0] == "in") cl = 'in"';
            else I--;

            var span= '<span class="packetid ' + cl + (splitted[I]==32 ? "style='color:#EAFF16' >" : " >")+splitted[I]+"</span>";
            for(var j=1+I; j<splitted.length; j++)
                // span += splitted[j] + " ";
                span+= "<span "+(splitted[j]==0 ? 'class="packet0"> ' : '> ')+ splitted[j]+"</span>";
           out+="<li><span class='linenumber'>"+i+"</span><span class='packet'>"+span+"</span></li>";

        }
        // console.log(out);
         $(".packets ul").html(out);
    });
});


function selectText(element) {
        var s = window.getSelection();
        if(s.rangeCount > 0 ) s.removeAllRanges();

        var range = document.createRange();
        range.selectNode(element);
        s.addRange(range);


    }




window.onload = function(){
    ($(".captures a"))[0].click();
}


window.onclick = function(event){

    var el = event.toElement;
    if(el.localName == "span") el = el.parentNode;
    // if(el.parentNode.parentNode.classList[0]=="packets") $(el.childNodes[1]).addClass("active");
}

window.onkeyup = function(e){
    switch(e.key){
        case '+':
            showCaptures();
            break;

    }
}

function showCaptures(){
        if($(".captures").css("display") != "none")
        $(".captures").hide();
        else $(".captures").show();
}

function decodeColor(value) {
        value = value.toString(16);
        while (value.length < 6) {
            value = "0" + value;
        }
        return "#" + value;
    }


window.oncopy = function(event){
    console.log(event);
}
window.onmouseup = function(event){

    // $(".captures").show();

    var el = event.toElement;
    // if(el.localName == "span") el = el.parentNode;
    // console.log(el.parentNode.parentNode.parentNode);


    if(el.localName == "span" && el.classList[0] == "linenumber"){
        selectText(el.parentNode.childNodes[1]);

    }
     if(el.localName == "span" && el.parentNode.classList[0]=="packet") {
        $(".subinfo p").html("");
        $(".packets span").removeClass("active");
        $(el.parentNode).addClass("active");
        $(".captures").hide();
        $(".colors").hide();

        var packet;
        if($.selection().length > 0)  {
            $(".colors").show();
            packet = new DataView((new Uint8Array($.selection().trim().split(" "))).buffer);
        }
        else packet = arrays[el.parentNode.parentNode.childNodes[0].innerHTML];


        var out= Decoder.decode(new Uint8Array(packet.buffer));
        $(".utf8 p").html(out);

        out = "";
        for(var i=0; i<packet.byteLength-3; i++) {
            out += i+": "+packet.getInt32(i, true)+"<br>";
        }
        $(".Int32 p").html(out);
        out = "";
        for(var i=0; i<packet.byteLength-3; i++) {
            out += i+": "+packet.getUint32(i, true)+"<br>"
        }

        $(".Uint32 p").html(out);
        out = "";

        for(var i=0; i<packet.byteLength-7; i++) {
            out += i+": "+~~(packet.getFloat64(i, true))+"<br>";

        }
        $(".Float64 p").html(out);
        out = "";

        for(var i=0; i<packet.byteLength-1; i++) {
            out += i+": "+   packet.getInt16(i, true)+"<br>";
        }
            $(".Int16 p").html(out);
            out = "";

        if(packet.byteLength>0 && packet.byteLength<50) {
            for(var i=0; i<packet.byteLength-2; i++){
            var color = decodeColor( packet.getUint8(i) << 16 | packet.getUint8(i+1) << 8 | packet.getUint8(i+2) );
            out += "<span style='background:"+color+"'></span>";
            }

            $(".Colors p").html(out);
        }
    }
};


function getChildNumber(node) {
  return Array.prototype.indexOf.call(node.parentNode.childNodes, node);
}

window.onmousemove = function(event){
    var el = event.toElement;

    // if(el.localName == "span") el = el.parentNode;
    // console.log(el.parentNode.parentNode.parentNode);

     if(el.localName == "span" && el.parentNode.classList[0]=="packet") {
        $(".tooltip").show();
        var dx = $(".tooltip").css("width").replace("px", ""), dy = $(".tooltip").css("height").replace("px", "");
        $(".tooltip").css({"top": (event.clientY - 2*dy), "left": (event.clientX - dx/2)});
        $(".tooltip").html(getChildNumber(el));
    }else{
        $(".tooltip").hide();
    }

};



// $(".packets").mouseup(function(){if($.selection().length > 2) alert($.selection('getPos'))});