-module(wa).

-export([start/0]).


start() ->
    lists:foldl(fun(I, _) -> ok = appstart(I) end, [], [
            crypto,
            ranch,
            cowlib,
            cowboy,
            wa
        ]).

appstart(App) ->
    case application:start(App) of
        ok -> ok;
        {error, {already_started, App}} -> ok;
        Err -> 
            io:format("{start} Got error ~p on ~p ~n", [Err, App]),
            error
    end.
