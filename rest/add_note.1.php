<?php
    require_once('connect.php');
    
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        
        $orderid = $request->orderid;
        $owner = $request->owner;
        $comment = $request->comment;
     
        // array for JSON response
        $response = array();
        
        $noteQuery = "insert into hisnotes(orderid,owner,commentmade) values('$orderid','$owner','$comment')";

        
        if($db->query($noteQuery) === TRUE){
        $response["result"] = "Note Inserted";
        }
        else{
            $response["result"] = "Error: " . $sqlInsert . "<br>" . $db->error;
        }
        
        header('Content-type: text/plain');
        echo json_encode($response);
?>