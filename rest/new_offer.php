<?php
    require_once('connect.php');
    
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        
        $orderindex = $_GET['orderindex'];
        $orderidfk = $_GET['orderidfk'];
        $spotrate = $_GET['spotrate'];
        $magin = $_GET['magin'];
        $offeredrate = $_GET['offeredrate'];
        $settlementdate = $_GET['settlementdate'];
        $offeredby = $_GET['offeredby'];
        $reqamount = $_GET['reqamount'];
        $ccysettleamount = $_GET['ccysettleamount'];
        $settleamount = $_GET['settleamount'];
        $comment = $_GET['comment'];
     
        // array for JSON response
        $response = array();
        
        $neworderQuery = "insert into `offers`(`orderindex`,`orderidfk`,`spotrate`,`magin`,`offeredrate`,`settlementdate`,`offeredby`,`reqamount`,`ccysettleamount`,`settleamount`,`comment`) 
            values (".$orderindex.",'".$orderidfk."','".$spotrate."','".$magin."',".$offeredrate.",'".$settlementdate."','".$offeredby."','".$reqamount."','".$ccysettleamount."','".$settleamount."','".$comment."')";
        
        if($db->query($neworderQuery) === TRUE){
            $response["result"] = "Offers Successfully Made";
        }
        else{
            $response["result"] = "Error: " . $neworderQuery . "<br>" . $db->error;
        }
        mysql_close($db);
        header('Content-type: text/plain');
        echo json_encode($response);
?>