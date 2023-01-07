<?php

function getNamesList(mysqli $db)
{
    $namesList = array();
    $stmt = $db->query("SELECT id, name from queryProject.mot;");
    while ($res = $stmt->fetch_assoc()) {
        $jsonWrapper = new stdClass();
        $jsonWrapper->id = (int)$res["id"];
        $jsonWrapper->name = $res["name"];
        array_push($namesList, $jsonWrapper);
    }
    return json_encode($namesList);
}

function getMOT(mysqli $db, int $motId)
{
    $stmt = $db->prepare("SELECT name, img_url, g_co2_km, taxes, fuel, fuel_consumption_unit, kilometer_per_unit, subscription, ticket
                            FROM queryProject.mot m
                               JOIN queryProject.emissions e ON m.id = e.id_mot
                               JOIN queryProject.costs c ON m.id = c.id_mot
                            WHERE m.id = ?;");
    $stmt->bind_param("i", $motId);
    $stmt->execute();
    $resultSet = $stmt->get_result();
    
    if ($resultSet->num_rows > 0) {
        $res = $resultSet->fetch_assoc();

        $jsonWrapper = new stdClass();
        $jsonWrapper->name = $res["name"];
        $jsonWrapper->imgUrl = $res["img_url"];
        $jsonWrapper->gCO2PerKm = $res["g_co2_km"];
        $jsonWrapper->taxes = $res["taxes"];
        $jsonWrapper->fuel = $res["fuel"];
        $jsonWrapper->fuelConsumptionUnit = $res["fuel_consumption_unit"];
        $jsonWrapper->kilometerPerUnit = $res["kilometer_per_unit"];
        $jsonWrapper->subscription = $res["subscription"];
        $jsonWrapper->ticket = $res["ticket"];
    
        return json_encode($jsonWrapper);
    }
    else {
        return false;
    }
}