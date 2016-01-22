<?php
    require_once('connect.php');
    
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        
        $orderindex = $_GET['orderindex'];
     
        // array for JSON response
        $response = array();
        
        $updateQ = "update Moneymarketorders set currentstatus = 'OfferReceived' where orderindex = $orderindex";

        
        if($db->query($updateQ) === TRUE){
            $response["result"] = "Order Updated - Received";
        }
        else{
            $response["result"] = "Error: " . $updateQ . "<br>" . $db->error;
        }
        
        header('Content-type: text/plain');
        echo json_encode($response);
?>