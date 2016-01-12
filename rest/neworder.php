<?php
  require_once('connect.php');
  $response = array();
  
    $orderid = $_POST['orderid'];
    $usernamefk = $_POST['usernamefk'];
    $ccypair = $_POST['ccypair'];
    $buyorderamount = $_POST['buyorderamount'];
    $sellorderamount = $_POST['sellorderamount'];
    $buysell = $_POST['buysell'];
    $buysellbank = $_POST['buysellbank'];
    $recipient = $_POST['recipient'];
    $settlementdate = $_POST['settlementdate'];
    $custcomment = $_POST['custcomment'];
    $ordertypefk = $_POST['ordertypefk'];
    
  //$insert = "insert into TABLE_NAME values('$name','$last_name')";// Do Your Insert Query
  $addorder = "insert into custorders(orderid,usernamefk,ccypair,buyorderamount,sellorderamount,buysell,buysellbank,recipient,settlementdate,custcomment,ordertypefk) 
            values ('$orderid','$usernamefk','$ccypair','$buyorderamount','$sellorderamount','$buysell','$buysellbank','$recipient','$settlementdate','$custcomment','$ordertypefk')";
            
        if($db->query($addorder) === TRUE){
            $response["result"] = "Order Sent Successfully";
        }
        else{
            $response["result"] = "Error: " . $addorder . "<br>" . $db->error;
        }
	
	//$db->close();
	header('Content-type: text/plain');
	echo json_encode($response);
?>
