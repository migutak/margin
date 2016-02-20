<?php

    //require_once('connect.php');
    
    $bankid = $_GET['bankid'];

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
    $result = mysql_query("select orderindex, orderid,usernamefk,ccypair,orderdate,buyorderamountccy,buyorderamount,sellorderamountccy,sellorderamount,settlementdate,buysell,buysellbank,currentstatus,
    custcomment,ordertypefk from Forwardorders where Forwardorders.currentstatus = 'N' and recipient = '$bankid'", $db);  
    
    //Create an array
    $json_response = array();
    
    while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
        $row_array['orderindex'] = $row['orderindex'];
        $row_array['orderid'] = $row['orderid'];
        $row_array['usernamefk'] = $row['usernamefk'];
        $row_array['ccypair'] = $row['ccypair'];
        $row_array['orderdate'] = $row['orderdate'];
        $row_array['buyorderamountccy'] = $row['buyorderamountccy'];
        $row_array['buyorderamount'] = $row['buyorderamount'];
        $row_array['sellorderamountccy'] = $row['sellorderamountccy'];
        $row_array['sellorderamount'] = $row['sellorderamount'];
        $row_array['buysell'] = $row['buysell'];
        $row_array['buysellbank'] = $row['buysellbank'];
        $row_array['currentstatus'] = $row['currentstatus'];
        $row_array['settlementdate'] = $row['settlementdate'];
        $row_array['custcomment'] = $row['custcomment'];
        $row_array['ordertypefk'] = $row['ordertypefk'];
        
        //push the values in the array
        array_push($json_response,$row_array);
    }
    echo json_encode($json_response);
    
    //Close the database connection
    mysql_close($db);
 
?>