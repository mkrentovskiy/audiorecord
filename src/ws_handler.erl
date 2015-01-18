-module(ws_handler).
-behaviour(cowboy_websocket_handler).

-export([init/3, websocket_init/3, websocket_handle/3, websocket_info/3, websocket_terminate/3]).

init({tcp, http}, _Req, _Opts) ->
    {upgrade, protocol, cowboy_websocket}.

websocket_init(_TransportName, Req, _Opts) ->
    SID = crypto:rand_uniform(1000, 9999),
    {ok, Req, {SID, 0}}.

websocket_handle({binary, D}, Req, {SID, N}) ->
    Filename = io_lib:format("priv/wav/~p-~p.wav", [SID, N]),
    R = file:write_file(Filename, D),
    io:format("Try to write ~p - ~p~n", [Filename, R]),
    {ok, Req, {SID, N + 1}};
websocket_handle(_Data, Req, State) ->
    {ok, Req, State}.

websocket_info(_Info, Req, State) ->
    {ok, Req, State}.

websocket_terminate(_Reason, _Req, _State) ->
    ok.

