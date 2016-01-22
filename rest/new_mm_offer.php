<?php
    require_once('connect.php');
    
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        
        $orderindex = $_GET['orderindex'];
        $orderidfk = $_GET['orderidfk'];
        $fixedrate = $_GET['fixedrate'];
        $orderamount = $_GET['orderamount'];
        $daycount = $_GET['daycount'];
        $totalinterest = $_GET['totalinterest'];
        $tax = $_GET['tax'];
        $netinterest = $_GET['netinterest'];
        $bankcomment = $_GET['bankcomment'];
        $offeredby = $_GET['offeredby'];
     
        // array for JSON response
        $response = array();
        
        $neworderQuery = "insert into `offers_mm`(`orderindex`,`orderidfk`,`fixedrate`,`orderamount`,`daycount`,`totalinterest`,`tax`,`netinterest`,`bankcomment`,`offeredby`) 
            values (".$orderindex.",'".$orderidfk."','".$fixedrate."','".$orderamount."','".$daycount."','".$totalinterest."','".$tax."','".$netinterest."','".$bankcomment."','".$offeredby."')";
        
        if($db->query($neworderQuery) === TRUE){
            $response["result"] = "MM Offers Successfully Made";
        }
        else{
            $response["result"] = "Error: " . $neworderQuery . "<br>" . $db->error;
        }
        mysql_close($db);
        header('Content-type: text/plain');
        echo json_encode($response);
?>