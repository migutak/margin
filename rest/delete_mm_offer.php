<?php
    require_once('connect.php');
    
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        
        $offerid = $request->id;
        // array for JSON response
        $response = array();
        
            $deleteQuery = "delete from offers_mm where offerid = $offerid ";
        
        if($db->query($deleteQuery) === TRUE){
        $response["result"] = "Offer deleted "+$offerid;
        }
        else{
            $response["result"] = "Error: " . $sqlInsert . "<br>" . $db->error;
        }
        
        header('Content-type: text/plain');
        echo json_encode($response);
?>