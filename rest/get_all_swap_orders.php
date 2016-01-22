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
    $result = mysql_query("select distinct orderid,usernamefk,ccypair,nearbuyorderamountccy,nearbuyorderamount,farbuyorderamountccy,farbuyorderamount,buysell,buysellbank,nearsellorderamountccy,nearsellorderamount,
    farsellorderamountccy,farsellorderamount,if(buysell='BUY',3,-3) limitnum,neardate,fardate,custcomment,ordertypefk,nOffers from Swaporders left outer join v_swaporders on Swaporders.orderid=v_swaporders.orderidfk 
    where Swaporders.currentstatus in ('N','OfferReceived') and usernamefk = '$user' ", $db);  
    
    //Create an array
    $json_response = array();
    
    while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
        //$row_array['orderindex'] = $row['orderindex'];
        $row_array['orderid'] = $row['orderid'];
        $row_array['usernamefk'] = $row['usernamefk'];
        $row_array['ccypair'] = $row['ccypair'];
        $row_array['neardate'] = $row['neardate'];
        $row_array['nearbuyorderamountccy'] = $row['nearbuyorderamountccy'];
        $row_array['nearbuyorderamount'] = $row['nearbuyorderamount'];
        $row_array['nearsellorderamountccy'] = $row['nearsellorderamountccy'];
        $row_array['nearsellorderamount'] = $row['nearsellorderamount'];
        $row_array['farbuyorderamountccy'] = $row['farbuyorderamountccy'];
        $row_array['farbuyorderamount'] = $row['farbuyorderamount'];
        $row_array['farsellorderamountccy'] = $row['farsellorderamountccy'];
        $row_array['farsellorderamount'] = $row['farsellorderamount'];
        $row_array['buysell'] = $row['buysell'];
        $row_array['buysellbank'] = $row['buysellbank'];
        $row_array['limitnum'] = $row['limitnum'];
        $row_array['fardate'] = $row['fardate'];
        //$row_array['currentstatus'] = $row['currentstatus'];
        //$row_array['recipient'] = $row['recipient'];
        $row_array['settlementdate'] = $row['settlementdate'];
        $row_array['custcomment'] = $row['custcomment'];
        $row_array['ordertypefk'] = $row['ordertypefk'];
        $row_array['nOffers'] = $row['nOffers'];
        
        //push the values in the array
        array_push($json_response,$row_array);
    }
    echo json_encode($json_response);
    
    //Close the database connection
    mysql_close($db);
 
?>