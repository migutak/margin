<?php

    //require_once('connect.php');
    
    $orderid = $_GET['id'];

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
    $result = mysql_query("select offerid,orderidfk,spotrate,magin,offeredrate,settlementdate,offeredby,reqamount,ccysettleamount,settleamount,createdate,comment from offers where orderidfk = '$orderid'", $db);  
    
    //Create an array
    $json_response = array();
    
    while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
        $row_array['offerid'] = $row['offerid'];
        $row_array['orderidfk'] = $row['orderidfk'];
        $row_array['spotrate'] = $row['spotrate'];
        $row_array['magin'] = $row['magin'];
        $row_array['offeredrate'] = $row['offeredrate'];
        $row_array['settlementdate'] = $row['settlementdate'];
        $row_array['offeredby'] = $row['offeredby'];
        $row_array['reqamount'] = $row['reqamount'];
        $row_array['ccysettleamount'] = $row['ccysettleamount'];
        $row_array['settleamount'] = $row['settleamount'];
        $row_array['createdate'] = $row['createdate'];
        $row_array['comment'] = $row['comment'];
        
        //push the values in the array
        array_push($json_response,$row_array);
    }
    echo json_encode($json_response);
    
    //Close the database connection
    mysql_close($db);
 
?>