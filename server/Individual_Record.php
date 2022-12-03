<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include 'DB_Connect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();


$method = $_SERVER['REQUEST_METHOD'];
switch($method){
    case "POST":
    $user = json_decode(file_get_contents('php://input'));
    $questions = $user->questions;
    $imageFileName = $user->imageFileName;
    $individualRecord = $user->individualRecord;
    
    // Inserts value to Individual Record Table
    $individualRecordQuery = "INSERT INTO individual_record(Name_of_Respondent, NO, Household, Institutional_Living_Quarter) 
                              VALUES(:Name_of_Respondent, :NO, :Household, :Institutional_Living_Quarter)";
    $stmt = $conn->prepare($individualRecordQuery);
    $stmt->bindParam(':Name_of_Respondent', $individualRecord->nameOfRespondent);
    $stmt->bindParam(':NO', $individualRecord->recordNumber);
    $stmt->bindParam(':Household', $individualRecord->household);
    $stmt->bindParam(':Institutional_Living_Quarter', $individualRecord->institutionalLivingQuarter);
    $stmt->execute();
    
    // Gets the last id and use it as foreign key
    $lastRowId = "SELECT id FROM individual_record ORDER BY id DESC LIMIT 1";
    $lastRowIdExe = $conn->prepare($lastRowId);
    $lastRowIdExe->execute();
    $lastRowFetch = $lastRowIdExe->fetch();
    

    // Inserts value to Identification
    $identificationQuery = "INSERT INTO identification(id, Province, City_Municipality, Barangay, Household_Head, Address_A, Address_B, Address_C, Name_of_Respondent)
                            VALUES(:id, :Province, :City_Municipality, :Barangay, :Household_Head, :Address_A, :Address_B, :Address_C, :Name_of_Respondent)";
    $identificationStatement = $conn->prepare($identificationQuery);
    $identificationStatement->bindParam(':id', $lastRowFetch['id']);
    $identificationStatement->bindParam(':Province', $individualRecord->province);
    $identificationStatement->bindParam(':City_Municipality', $individualRecord->municipality);
    $identificationStatement->bindParam(':Barangay', $individualRecord->barangay);
    $identificationStatement->bindParam(':Household_Head', $individualRecord->householdHead);
    $identificationStatement->bindParam(':Address_A', $individualRecord->addressRoom);
    $identificationStatement->bindParam(':Address_B', $individualRecord->addressHouse);
    $identificationStatement->bindParam(':Address_C', $individualRecord->addressStreet);
    $identificationStatement->bindParam(':Name_of_Respondent', $individualRecord->nameOfRespondent);
    $identificationStatement->execute();

    // Inserts value to Encoding Information
    
    break;
}

?>