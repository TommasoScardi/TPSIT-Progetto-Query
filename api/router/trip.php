<?php

//query string -> getTrip-<actionName>

define("GET_NAME", "getTrip-");

if (str_contains($_GET["q"], GET_NAME)) {
    include_once "controller/trip.php";

    $action = getAction($_GET["q"], GET_NAME);

    switch ($action) {
        case "namesList":
            echo getNamesList($dbConn);
            break;

        case "trip":
            if (!isset($_GET["id"]) && !is_int($_GET["id"])) {
                NotFound("no id param specified");
                break;
            }
            $tripId = intval($_GET["id"]);
            $resGet =
            getTrip($dbConn, $tripId);
            if (!$resGet)
                NotFound("no trip founded with gived id");
            else
                echo $resGet;
            break;

        case "tripMots":
            if (!isset($_GET["id"]) && !is_int($_GET["id"])) {
                NotFound("no id param specified");
                break;
            }
            $tripId = intval($_GET["id"]);
            $resGet = getTripMots($dbConn, $tripId);
            if (!$resGet)
                NotFound("no trip mots founded with gived id");
            else
                echo $resGet;
            break;

        case "create":
            if (!isset($_DATA) || $_DATA == null) {
                NotFound("empty body in the request or wrong request type");
                break;
            }
            if (!array_key_exists("name", $_DATA) || !array_key_exists("mots", $_DATA)) {
                NotFound("the body doesn't come with all the specified params");
                break;
            }
            if(!is_array($_DATA["mots"])) {
                NotFound("mots param is not an array");
                break;
            }

            if (createTrip($dbConn, $_DATA)) {
                echo '{"code":200, "message":"ok"}';
            }
            else {
                Error(400, "error creating the trip");
            }
            break;

        default:
            NotFound("no action founded in trip router");
            break;
    }
}