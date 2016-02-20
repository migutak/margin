<?php
    require_once('connect.php');
    
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        
        $orderindex = $_GET['orderindex'];
        $orderidfk = $_GET['orderidfk'];
        $spot = $_GET['spot'];
        $magin = $_GET['magin'];
        $finalrate = $_GET['finalrate'];
        $settlementdate = $_GET['settlementdate'];
        $offeredby = $_GET['offeredby'];
        $settlementamountccy = $_GET['settlementamountccy'];
        $settlementamount = $_GET['settlementamount'];
        $settleamount = $_GET['settleamount'];
        $bankcomment = $_GET['bankcomment'];
        $bankuser = $_GET['bankuser'];
     
        // array for JSON response
        $response = array();
        
        $neworderQuery = "insert into `offers_forward`(`orderindex`,`orderidfk`,`spot`,`magin`,`finalrate`,`settlementdate`,`offeredby`,`settlementamountccy`,`settlementamount`,`bankcomment`,`bankuser`) 
            values (".$orderindex.",'".$orderidfk."','".$spot."','".$magin."',".$finalrate.",'".$settlementdate."','".$offeredby."','".$settlementamountccy."','".$settlementamount."','".$bankcomment."','".$bankuser."')";
        
        if($db->query($neworderQuery) === TRUE){
            $response["result"] = "Forward Offer Successfully Submitted";
        }
        else{
            $response["result"] = "Error: " . $neworderQuery . "<br>" . $db->error;
        }
        mysql_close($db);
        header('Content-type: text/plain');
        echo json_encode($response);
?>