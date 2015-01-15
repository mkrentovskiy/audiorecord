(function($) {
    var is_rec = false; 
    var rec_time = 0;

    function log(type,msg) { $("#console").append($("<div>").addClass(type).text(msg)); }
    function info(msg) { log("info", msg); }
    function warning(msg) { log("warning", msg); }
    function error(msg) { log("error", msg); }

    function d2(d) { return (d<10 ? "0" : "") + d; }
    function ftime(d) { return d2(Math.floor(d/3600)) + ":" + d2(Math.floor(d/60)) + ":" + d2(d%60); }
    function repeat(cb) { setTimeout(cb, 1000); }  

    $.app = {}
    $.app.init = function() {
        $("#btn_stop").hide();

        info("Starting application.");
    }

    $.app.start = function() {
        $("#btn_start").hide();
        $("#btn_stop").show();
        info("Start recording.");

        is_rec = true;
        rec_time = 0;
        timer();
    }

    $.app.stop = function() {
        is_rec = false;

        $("#btn_start").show();
        $("#btn_stop").hide();        
        info("Stop recording.");
    }

    function timer() 
    {
        if(is_rec) {
            $("#timer").text(ftime(rec_time++));
            repeat(timer);
        }
    }


})(window.jQuery);

$(document).ready(function() { $.app.init(); });