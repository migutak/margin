<?php 
	require_once('connect.php');
	$postdata = file_get_contents("php://input");
    $request = json_decode($postdata);


    $orderid = $_GET['orderid'];
    $usernamefk = $_GET['usernamefk'];
    $ccypair = $_GET['ccypair'];
    $buyorderamount = $_GET['buyorderamount'];
    $sellorderamount = $_GET['sellorderamount'];
    $buysell = $_GET['buysell'];
    $buysellbank = $_GET['buysellbank'];
    $recipient = $_GET['recipient'];
    $settlementdate = $_GET['settlementdate'];
    $custcomment = $_GET['custcomment'];
    $ordertypefk = $_GET['ordertypefk'];

// array for JSON response
        $response = array();

		$addorder = "insert into custorders(orderid,usernamefk,ccypair,buyorderamount,sellorderamount,buysell,buysellbank,recipient,settlementdate,custcomment,ordertypefk) 
            values ('$orderid','$usernamefk','$ccypair','$buyorderamount','$sellorderamount','$buysell','$buysellbank','$recipient','$settlementdate','$custcomment','$ordertypefk')";
           

        if($db->query($addorder) === TRUE){
        $response["result"] = "Order Created and sent";
        }
        else{
            $response["result"] = "Error: " . $addorder . "<br>" . $db->error;
        }
	
	//$db->close();
	header('Content-type: text/plain');
	echo json_encode($response);
?>