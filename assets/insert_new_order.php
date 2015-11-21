<?php
    require_once('connect.php');
    
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        
        $orderid = $request->orderid;
        $usernamefk = $request->usernamefk;
        $ccypair = $request->ccypair;
        $buyorderamount = $request->buyorderamount;
        $sellorderamount = $request->sellorderamount;
        $buysellbank = $request->buysellbank;
        $buysell = $request->buysell;
        $currentstatus = $request->currentstatus;
        $recipient = $request->recipient;
        $settlementdate = $request->settlementdate;
        $custcomment = $request->custcomment;
        $ordertypefk = $request->ordertypefk;
     
        // array for JSON response
        $response = array();
        
            $neworderQuery = "insert into `custorders`(`orderid`,`usernamefk`,`ccypair`,`buyorderamount`,`sellorderamount`,`buysell`,`buysellbank`,`recipient`,`settlementdate`,`custcomment`,`ordertypefk`) values ('".$orderid."','".$usernamefk."','".$ccypair."','".$buyorderamount."','".$sellorderamount."','".$buysell."','".$buysellbank."','".$recipient."','".$settlementdate."','".$custcomment."','".$ordertypefk."')";
            //$insertResult = $db->query($neworderQuery);
            //$db->query($userInsert);
        
        if($db->query($neworderQuery) === TRUE){
        $response["result"] = "Order Successfully Created";
        }
        else{
            $response["result"] = "Error: " . $sqlInsert . "<br>" . $db->error;
        }
        
        header('Content-type: text/plain');
        echo json_encode($response);
?>