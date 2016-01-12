<?php
    require_once('connect.php');
    
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        
        //$orderid = $request->orderid;
        //$offerid = $request->offerid;
        
        $orderid = $_GET['orderid'];
        $offerid = $_GET['offerid'];

     
        // array for JSON response
        $response = array();
        
        $updateOffersQuery = "update offers_swap set status = 'Accepted' where offerid = $offerid "; 
        $updateOrdersQuery = "update Swaporders set currentstatus = 'Taken' where orderid = '$orderid' "; 
        
        //$db->query($updateOffersQuery);
        
        if($db->query($updateOrdersQuery) === TRUE){
            $db->query($updateOffersQuery);
            $response["result"] = "Fxswap Offer Successfully Accepted";
        }
        else{
            $response["result"] = "Error: " . $sqlInsert . "<br>" . $db->error;
        }
        
        header('Content-type: text/plain');
        echo json_encode($response);
?>