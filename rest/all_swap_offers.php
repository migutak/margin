<?php

    //require_once('connect.php');
    
    $bankid = $_GET['id'];

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
    $result = mysql_query("select offerid,orderidfk,spotrate,magin,offeredrate,custorders.settlementdate,offeredby,reqamount,settleamount,createdate,usernamefk
    ,ccypair,orderdate,buyorderamount+sellorderamount orderamount,buysell,buysellbank,if(buysell='BUY',-3,if(buysell='SELL' && buyorderamount>0,3,3)) limitnum,currentstatus,
    recipient,comment, custcomment,ordertypefk,status, if(buysell='SELL' && sellorderamount>0,buyorderamount+sellorderamount,if(buysell='BUY' && sellorderamount>0,buyorderamount+sellorderamount,settleamount)) buy_orderamount,
    if(buysell='SELL' && sellorderamount>0,settleamount,if(buysell='BUY' && sellorderamount>0,settleamount,buyorderamount+sellorderamount)) sell_orderamount
    from offers left join custorders on offers.orderindex = custorders.orderindex where offeredby = '$bankid' and status = 'Open' ", $db);  
    
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
        $row_array['settleamount'] = $row['settleamount'];
        $row_array['createdate'] = $row['createdate'];
        $row_array['comment'] = $row['comment'];
        $row_array['ccypair'] = $row['ccypair'];
        $row_array['orderdate'] = $row['orderdate'];
        $row_array['orderamount'] = $row['orderamount'];
        $row_array['offeredrate'] = $row['offeredrate'];
        $row_array['buysell'] = $row['buysell'];
        $row_array['buysellbank'] = $row['buysellbank'];
        $row_array['limitnum'] = $row['limitnum'];
        $row_array['currentstatus'] = $row['currentstatus'];
        $row_array['recipient'] = $row['recipient'];
        $row_array['custcomment'] = $row['custcomment'];
        $row_array['ordertypefk'] = $row['ordertypefk'];
        $row_array['usernamefk'] = $row['usernamefk'];
        $row_array['status'] = $row['status'];
        $row_array['buy_orderamount'] = $row['buy_orderamount'];
        $row_array['sell_orderamount'] = $row['sell_orderamount'];
        
        //push the values in the array
        array_push($json_response,$row_array);
    }
    echo json_encode($json_response);
    
    //Close the database connection
    mysql_close($db);
 
?>