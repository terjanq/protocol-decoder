// ==UserScript==
// @name         sniffws
// @description  sniffws
// @version      0.1
// @author       terjanq
// @match        http://diep.io/
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @connect      diep.io
// ==/UserScript==

window.stop();

GM_xmlhttpRequest({
    method: "GET",
    url: "http://diep.io",
    onload: function(e) {
        document.open(), document.write("<script src='http://localhost/........../sniffws.js'></script>" + e.responseText), document.close();
    }
});
