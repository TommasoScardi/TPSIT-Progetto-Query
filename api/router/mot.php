<?php

//query string -> getMOT-<actionName>

define("GET_NAME", "getMOT-");

if (str_contains($_GET["q"], GET_NAME)) {
    include_once "controller/mot.php";

    $action = getAction($_GET["q"], GET_NAME);

    switch ($action) {
        case "namesList":
            echo getNamesList($dbConn);
            break;

        case "mot":
            if(!isset($_GET["id"]) && !is_int($_GET["id"])) {
                NotFound();
                break;
            }
            $motId = intval($_GET["id"]);
            $resGet = getMOT($dbConn, $motId);
            if(!$resGet)
                NotFound("no mot founded with gived id");
            else
                echo $resGet; 
            break;
        
        default:
            NotFound("no action founded in mot router");
            break;
    }
}