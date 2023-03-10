<?php

function getNamesList(mysqli $db)
{
    $namesList = array();
    $stmt = $db->query("SELECT id, name from queryProject.trip;");
    while ($res = $stmt->fetch_assoc()) {
        $jsonWrapper = new stdClass();
        $jsonWrapper->id = (int)$res["id"];
        $jsonWrapper->name = $res["name"];
        array_push($namesList, $jsonWrapper);
    }
    $stmt->close();
    return json_encode($namesList);
}

function getTrip(mysqli $db, int $motId)
{
    $stmt = $db->prepare("SELECT name from queryProject.trip where id = ?;");
    $stmt->bind_param("i", $motId);
    $stmt->execute();
    $resultSet = $stmt->get_result();
    if ($resultSet->num_rows <= 0) {
        return false;
    }
    $tripName = $resultSet->fetch_array()[0]; //name col
    $stmt->close();
    $stmt= null;

    $stmt = $db->prepare("SELECT id_mot, km_traveled
                            FROM queryProject.trip t, queryProject.trip_mot tm
                            WHERE t.id = tm.id_trip AND t.id = ?;");
    $stmt->bind_param("i", $motId);
    $stmt->execute();
    $resultSet = $stmt->get_result();

    if ($resultSet->num_rows <= 0) {
        return false;
    }
    $tripMots = array();
    while ($res = $resultSet->fetch_assoc()) {
        $jsonWrapper = new stdClass();
        //$jsonWrapper->tripName = $res["name"];
        $jsonWrapper->motId = $res["id_mot"];
        $jsonWrapper->kmTrav = $res["km_traveled"];

        array_push($tripMots ,$jsonWrapper);
    }

    $stmt->close();
    $tripData = new stdClass();
    $tripData->name = $tripName;
    $tripData->mots = $tripMots;
    return json_encode($tripData);
}

function getTripMots(mysqli $db, int $motId)
{
    $stmt = $db->prepare("SELECT m.name AS motName, tm.km_traveled
                            FROM queryProject.trip t, queryProject.trip_mot tm, queryProject.mot m
                            WHERE t.id = tm.id_trip AND tm.id_mot = m.id
                            AND t.id = ?;");
    $stmt->bind_param("i", $motId);
    $stmt->execute();
    $resultSet = $stmt->get_result();

    if ($resultSet->num_rows > 0) {
        $tripMots = array();
        while ($res = $resultSet->fetch_assoc()) {
            $jsonWrapper = new stdClass();
            //$jsonWrapper->tripName = $res["tripName"];
            $jsonWrapper->motName = $res["motName"];
            $jsonWrapper->kmTrav = $res["km_traveled"];

            array_push($tripMots, $jsonWrapper);
        }
        
        $stmt->close();
        return json_encode($tripMots);
    } else {
        return false;
    }
}

function createTrip(mysqli $db, $newTrip)
{
    //$newTrip["name"]
    //$newTrip["mots"] -> array
    if (!array_key_exists("name", $newTrip) || !array_key_exists("mots", $newTrip)) {
        return false;
    }
    if ($newTrip["name"] == null || empty($newTrip["name"])) {
        return false;
    }
    if (!(is_array($newTrip["mots"]) && !empty($newTrip["mots"]))) {
        return false;
    }
    $tripId = null;

    try {
        $tripDataTrimmed = str_replace(" ", "", strtolower($newTrip["name"]));
        $stmt = $db->prepare("INSERT INTO queryProject.trip (name) VALUES (?)");
        $stmt->bind_param("s", $tripDataTrimmed);
        $stmt->execute();
        $tripId = $stmt->insert_id;
        $stmt->close();
        $stmt = null;
    
        $insertVal = implode(",", array_fill(0, count($newTrip["mots"]), "($tripId,?,?)"));
        $types = str_repeat("id", count($newTrip["mots"]));
        $values = call_user_func_array("array_merge", $newTrip["mots"]);
    
        $stmt = $db->prepare("INSERT INTO queryProject.trip_mot VALUES $insertVal");
        $stmt->bind_param($types, ...$values);
        
        $retVal = $stmt->execute();
        $stmt->close();
        return $retVal;
    }
    catch(Exception $exc) {
        return false;
    }
}