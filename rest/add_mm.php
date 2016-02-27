<?php 
	require_once('connect.php');
	$postdata = file_get_contents("php://input");
    $request = json_decode($postdata);


    $orderid = $_GET['orderid'];
    $usernamefk = $_GET['usernamefk'];
    $ccy = $_GET['ccy'];
    $orderamount = $_GET['orderamount'];
    $mmfrom = $_GET['mmfrom'];
    $mmto = $_GET['mmto'];
    $tenure = $_GET['tenure'];
    $recipient = $_GET['recipient'];
    $settlementdate = $_GET['settlementdate'];
    $custcomment = $_GET['custcomment'];
    $ordertypefk = $_GET['ordertypefk'];
    $mmtype = $_GET['mmtype'];
    $mmtypebank = $_GET['mmtypebank'];
    $custname = $_GET['custname'];

// array for JSON response
        $response = array();

		$addorder = "insert into Moneymarketorders(orderid,usernamefk,ccy,orderamount,mmfrom,mmto,tenuredays,recipient,custcomment,ordertypefk,mmtype,mmtypebank,custname) 
            values ('$orderid','$usernamefk','$ccy','$orderamount','$mmfrom','$mmto','$tenure','$recipient','$custcomment','$ordertypefk','$mmtype','$mmtypebank','$custname')";
           

        if($db->query($addorder) === TRUE){
        $response["result"] = "Money Market Order Created and sent";
        }
        else{
            $response["result"] = "Error: " . $addorder . "<br>" . $db->error;
        }
	
	//$db->close();
	header('Content-type: text/plain');
	echo json_encode($response);
?>