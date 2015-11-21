<?php
    require_once('connect.php');
    
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        
        $offerid = $request->offerid;
        $spotrate = $request->spotrate;
        $magin = $request->magin;
        $offeredrate = $request->offeredrate;
        $settlementdate = $request->settlementdate;
        $offeredby = $request->offeredby;
        $settleamount = $request->settleamount;
     
        // array for JSON response
        $response = array();
        
        $editofferQuery = "update `offers` set `spotrate` = $spotrate,`magin` = $magin,`offeredrate` = $offeredrate,`settlementdate` = '$settlementdate',`settleamount` = $settleamount where `offerid` = $offerid"; 
            
        
        if($db->query($editofferQuery) === TRUE){
            $response["result"] = "Offers Ammended";
        }
        else{
            $response["result"] = "Error: " . $sqlInsert . "<br>" . $db->error;
        }
        
        header('Content-type: text/plain');
        echo json_encode($response);
?>