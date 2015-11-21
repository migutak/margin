<?php
    require_once('connect.php');
    
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        
        $offerid = $request->id;
        $reason = $request->reason;
     
        // array for JSON response
        $response = array();
        
            $deleteQuery = "Update offers set confirm = 'Rejected', rejectreason = '$reason' where offerid = $offerid ";

        
        if($db->query($deleteQuery) === TRUE){
        $response["result"] = "Deal Confirmed ";
        }
        else{
            $response["result"] = "Error: " . $sqlInsert . "<br>" . $db->error;
        }
        
        header('Content-type: text/plain');
        echo json_encode($response);
?>