-module(wa_sup).
-behaviour(supervisor).

-export([start_link/0]).
-export([init/1]).

-include("wa.hrl").


start_link() ->
    supervisor:start_link({local, ?MODULE}, ?MODULE, []).


init([]) ->
    Modules = [],
    {ok, {{one_for_one, 500, 1000}, Modules}}.

