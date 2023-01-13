<?php
include_once "util/errors.php";

$dbHost = "localhost";
$dbUsername = "root";
$dbPassw = "";
$dbName = "queryProject";

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
try {
    $dbConn = new mysqli($dbHost, $dbUsername, $dbPassw, $dbName);
    $dbConn->set_charset("utf8mb4");
} catch (Exception $e) {
    error_log($e->getMessage());
    Error(503,'Error connecting to database'); //Should be a message a typical user could understand
}