<?php

//query string $_GET["q"] => get<RouterName>-<RouterAction>

function isValidQueryStr(string $queryStr)
{
    return strlen($queryStr) > 0 &&
        strpos($queryStr, "-") > 0 &&
        str_contains($queryStr, "get") && 
        strlen(substr($queryStr, strpos($queryStr, "-") + 1)) > 0;
}

function getRouter(string $queryStr)
{
    return substr(
        $queryStr,
        0,
        strpos($queryStr, "-")
    );
}

function getAction(string $queryStr, string $prefix)
{
    return substr(
        $queryStr,
        strpos($queryStr, $prefix) + strlen($prefix),
        strlen($queryStr)
    );
}

function NotFound(string $msg = "generic error")
{
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    echo '{"code" : 404, "message": "'.$msg.'"}';
    exit;
}

function Error(int $code = 400, string $msg = "generic error")
{
    header($_SERVER["SERVER_PROTOCOL"] . " $code", true, $code);
    echo '{"code" : '.$code.', "message": "'.$msg.'"}';
    exit;
}