<?php

    //require_once('connect.php');
    
    $user = $_GET['username'];

    $servername = getenv('IP');
    $username = getenv('C9_USER');
    $password = "";
    $database = "maginiq";
    $dbport = 3306;
    
    //Create Database connection
    $db = mysql_connect("$servername","$username","");
    
    if (!$db) {
        die('Could not connect to db: ' . mysql_error());
    }
 
    //Select the Database
    mysql_select_db("$database",$db);
    
    //Replace * in the query with the column names.
    $result = mysql_query("select distinct orderid,usernamefk,ccy,orderamount,mmfrom,mmto,
    tenuredays,custcomment,ordertypefk,mmtype,nOffers from Moneymarketorders left outer join v_mmorders on Moneymarketorders.orderid=v_mmorders.orderidfk 
    where Moneymarketorders.currentstatus in ('N','OfferReceived') and usernamefk = '$user' ", $db);  
    
    //Create an array
    $json_response = array();
    
    while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
        //$row_array['orderindex'] = $row['orderindex'];
        $row_array['orderid'] = $row['orderid'];
        $row_array['usernamefk'] = $row['usernamefk'];
        $row_array['ccy'] = $row['ccy'];
        $row_array['orderamount'] = $row['orderamount'];
        $row_array['mmfrom'] = $row['mmfrom'];
        $row_array['mmto'] = $row['mmto'];
        $row_array['tenuredays'] = $row['tenuredays'];
        $row_array['custcomment'] = $row['custcomment'];
        $row_array['ordertypefk'] = $row['ordertypefk'];
        $row_array['nOffers'] = $row['nOffers'];
        $row_array['mmtype'] = $row['mmtype'];
        
        //push the values in the array
        array_push($json_response,$row_array);
    }
    echo json_encode($json_response);
    
    //Close the database connection
    mysql_close($db);
 
?>