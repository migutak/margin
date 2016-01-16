<?php 
	require_once('connect.php');
	$postdata = file_get_contents("php://input");
    $request = json_decode($postdata);


    $orderid = $_GET['orderid'];
    $forwardid = $_GET['forwardid'];
    $usernamefk = $_GET['usernamefk'];
    $ccypair = $_GET['ccypair'];
    $buyorderamountccy = $_GET['buyorderamountccy'];
    $buyorderamount = $_GET['buyorderamount'];
    $sellorderamountccy = $_GET['sellorderamountccy'];
    $sellorderamount = $_GET['sellorderamount'];
    $settlementdate = $_GET['settlementdate'];
    $buysell = $_GET['buysell'];
    $buysellbank = $_GET['buysellbank'];
    $recipient = $_GET['recipient'];
    $custcomment = $_GET['custcomment'];
    $ordertypefk = $_GET['ordertypefk'];


// array for JSON response
        $response = array();

		$addorder = "insert into Forwardorders(orderid,forwardid,usernamefk,ccypair,buyorderamountccy,buyorderamount,sellorderamountccy,sellorderamount,settlementdate,buysell,buysellbank,recipient,custcomment,ordertypefk) 
                                    values ('$orderid','$forwardid','$usernamefk','$ccypair','$buyorderamountccy','$buyorderamount','$sellorderamountccy','$sellorderamount','$settlementdate','$buysell','$buysellbank','$recipient','$custcomment','$ordertypefk')";
           

        if($db->query($addorder) === TRUE){
        $response["result"] = "FxForward Order Created";
        }
        else{
            $response["result"] = "Error: " . $addorder . "<br>" . $db->error;
        }
	
	//$db->close();
	header('Content-type: text/plain');
	echo json_encode($response);
?>