<?php
    require_once('connect.php');
    
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        
        $offerid = $request->id;
        $date = date("Y-m-d");
     
        // array for JSON response
        $response = array();
        
            $deleteQuery = "Update offers_mm set confirm = 'Sent', confirmdate = '$date' where offerid = $offerid ";

        if($db->query($deleteQuery) === TRUE){
        $response["result"] = "MM Offer Confirmed "+$offerid;
        }
        else{
            $response["result"] = "Error: " . $sqlInsert . "<br>" . $db->error;
        }
        
        header('Content-type: text/plain');
        echo json_encode($response);
?>