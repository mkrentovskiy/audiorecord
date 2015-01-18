(function($) {
    // config    
    var SPLIT_TIME = 10;
    var AR_CONFIG = { sampleRate: 44100, bufferSize: 4096 };
    
    // media
    var ws;
    var rec;
    var mstr = null;

    // query
    var query = [];
    var query_start = false;

    // record
    var is_rec = false; 
    var rec_time = 0;

    function log(type,msg) { $("#console").append($("<div>").addClass(type).text(msg)); }
    function info(msg) { log("info", msg); }
    function warning(msg) { log("warning", msg); }
    function error(msg) { log("error", msg); }

    function d2(d) { return (d<10 ? "0" : "") + d; }
    function ftime(d) { return d2(Math.floor(d/3600)) + ":" + d2(Math.floor(d/60%60)) + ":" + d2(d%60); }
    function repeat(cb) { setTimeout(cb, 1000); }  

    $.app = {}
    $.app.init = function() {
        $("#btn_stop").hide();

        info("Starting application.");

        if(!("WebSocket" in window)){  
            error("No WebSocket support, can't start.");
            $("#btn_start").hide();
        } else {
            navigator.getUserMedia({ audio: true }, 
                function(ms) { mstr = ms; }, 
                function() { 
                    error("You must accept microphone access.");
                    $("#btn_start").hide();
                });
            connect();            
            repeat(check_q);
        }
    }

    $.app.start = function() {
        if(mstr) {
            $("#btn_start").hide();
            $("#btn_stop").show();
            info("Start recording.");

            rec = new StereoAudioRecorder(mstr, AR_CONFIG);
            rec.record();

            is_rec = true;
            rec_time = 0;
            timer();            
        } else {
            error("Microphone access not accepted yet.");
        };
    }

    $.app.stop = function() {
        is_rec = false;

        split(false);

        $("#btn_start").show();
        $("#btn_stop").hide();        
        info("Stop recording.");
    }

    function timer() 
    {
        if(is_rec) {
            $("#timer").text(ftime(rec_time++));
            if(rec_time % SPLIT_TIME  == 0) split(true);
            repeat(timer);
        }
    }

    function connect()
    {
        ws = new WebSocket("ws://" + window.location.host + "/ar");
        ws.binaryType = "blob";
            
        ws.onopen = function() { info("Connected to websocket."); };
        ws.onmessage = function(m) { info("Get WS message " + m.data); };
        ws.onclose = function() { info("Websocket connection close.");  repeat(connect); };
        ws.onerror = function() { error("Websocket error."); repeat(connect); };            

        if(!query_start) {
            query_start = true;
            repeat(check_q);
        }
    }

    function check_q()
    {
        if(query.length && ws.readyState == ws.OPEN) {
            do {
                var i = query.shift();
     
                info("Send to WS " + i + ".");
                ws.send(i);
            } while(query.length);
        } 
        repeat(check_q);
    }

    function split(next) 
    {
        info("Split recording at " + rec_time + " sec.");

        rec.stop(function() {
            query.push(rec.blob);
            if(next) {
                rec = new StereoAudioRecorder(mstr, AR_CONFIG);
                rec.record();
            }
        });
    }

})(window.jQuery);

$(document).ready(function() { $.app.init(); });