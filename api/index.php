<?php

$_DATA = null;

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';
    
    if (strcasecmp($contentType, 'application/json') == 0) {
        //Receive the RAW post data.
        $content = trim(file_get_contents("php://input"));

        //Attempt to decode the incoming RAW post data from JSON.
        $decoded = json_decode($content, true);

        //If json_decode failed, the JSON is invalid.
        if (!is_array($decoded))
            throw new Exception('Received content contained invalid JSON!');
        else
            $_DATA = $decoded;
    }
    else if (strcasecmp($contentType, 'application/x-www-form-urlencoded') == 0) {
        $_DATA = $_POST;
    }
}


include_once "router/router.php";