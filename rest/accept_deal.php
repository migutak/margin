<?php
    require_once('connect.php');
    
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        
        $offerid = $request->id;
     
        // array for JSON response
        $response = array();
        
            $updateQuery = "update offers set confirm = 'Confirmed' where offerid = $offerid ";

        
        if($db->query($updateQuery) === TRUE){
        $response["result"] = "Deal Confirmed ";
        }
        else{
            $response["result"] = "Error: " . $updateQuery . "<br>" . $db->error;
        }
        
        header('Content-type: text/plain');
        echo json_encode($response);
?>