<?php 
	require_once('connect.php');
	$postdata = file_get_contents("php://input");
    $request = json_decode($postdata);


    $orderid = $_GET['orderid'];
    $usernamefk = $_GET['usernamefk'];
    $ccypair = $_GET['ccypair'];
    $nearbuyorderamountccy = $_GET['nearbuyorderamountccy'];
    $neardate = $_GET['neardate'];
    $buysell = $_GET['buysell'];
    $buysellbank = $_GET['buysellbank'];
    $recipient = $_GET['recipient'];
    $fardate = $_GET['fardate'];
    $custcomment = $_GET['custcomment'];
    $ordertypefk = $_GET['ordertypefk'];
    $nearbuyorderamount = $_GET['nearbuyorderamount'];
    $nearsellorderamountccy = $_GET['nearsellorderamountccy'];
    $nearsellorderamount = $_GET['nearsellorderamount'];
    $farbuyorderamountccy = $_GET['farbuyorderamountccy'];
    $farbuyorderamount = $_GET['farbuyorderamount'];
    $farsellorderamountccy = $_GET['farsellorderamountccy'];
    $farsellorderamount = $_GET['farsellorderamount'];
    
    $neardate = $_GET['neardate'];
    $buysell = $_GET['buysell'];
    $buysellbank = $_GET['buysellbank'];
    $recipient = $_GET['recipient'];
    $fardate = $_GET['fardate'];

// array for JSON response
        $response = array();

		$addorder = "insert into Swaporders(orderid,usernamefk,ccypair,nearbuyorderamountccy,nearbuyorderamount,nearsellorderamountccy,nearsellorderamount,buysell,buysellbank,recipient,neardate,fardate,farbuyorderamountccy,farbuyorderamount,farsellorderamountccy,farsellorderamount,custcomment,ordertypefk,currentstatus) 
                                    values ('$orderid','$usernamefk','$ccypair','$nearbuyorderamountccy','$nearbuyorderamount','$nearsellorderamountccy','$nearsellorderamount','$buysell','$buysellbank','$recipient','$neardate','$fardate','$farbuyorderamountccy','$farbuyorderamount','$farsellorderamountccy','$farsellorderamount','$custcomment','$ordertypefk','N')";
           

        if($db->query($addorder) === TRUE){
        $response["result"] = "FxSwap Order Created";
        }
        else{
            $response["result"] = "Error: " . $addorder . "<br>" . $db->error;
        }
	
	//$db->close();
	header('Content-type: text/plain');
	echo json_encode($response);
?>