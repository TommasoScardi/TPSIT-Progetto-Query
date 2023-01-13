<?php

include_once "util/errors.php";
include_once "includes/dbconn.inc.php";

if(!isset($_GET["q"])) {
    NotFound("no query string founded");
    exit;
}

if(!isValidQueryStr(($_GET["q"]))) {
    NotFound("invalid query string => ".$_GET["q"]);
    exit;
}

switch (getRouter($_GET["q"])) {
    case "getMOT":
        include_once "router/mot.php";
        exit;
    
    case "getTrip":
        include_once "router/trip.php";
        exit;
    
    default:
        NotFound("no router found with given query string");
        exit;
}