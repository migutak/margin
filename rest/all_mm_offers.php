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
    $result = mysql_query("select offerid,orderidfk,fixedrate,Moneymarketorders.orderamount,daycount,totalinterest,tax,netinterest,bankcomment,offeredby,usernamefk
    ,ccy,orderdate,offerdate,orderid,mmto,mmfrom,recipient, custcomment,ordertypefk,tenuredays,mmtype,mmtypebank,currentstatus
    from offers_mm left join Moneymarketorders on offers_mm.orderindex = Moneymarketorders.orderindex where offeredby = '$bankid' and status = 'Open' ", $db);  
    
    //Create an array
    $json_response = array();
    
    while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
        $row_array['offerid'] = $row['offerid'];
        $row_array['orderidfk'] = $row['orderidfk'];
        $row_array['fixedrate'] = $row['fixedrate'];
        $row_array['orderamount'] = $row['orderamount'];
        $row_array['daycount'] = $row['daycount'];
        $row_array['totalinterest'] = $row['totalinterest'];
        $row_array['tax'] = $row['tax'];
        $row_array['netinterest'] = $row['netinterest'];
        $row_array['bankcomment'] = $row['bankcomment'];
        $row_array['offeredby'] = $row['offeredby'];
        $row_array['comment'] = $row['comment'];
        $row_array['usernamefk'] = $row['usernamefk'];
        $row_array['orderdate'] = $row['orderdate'];
        $row_array['ccy'] = $row['ccy'];
        $row_array['offerdate'] = $row['offerdate'];
        $row_array['orderid'] = $row['orderid'];
        $row_array['mmto'] = $row['mmto'];
        $row_array['mmfrom'] = $row['mmfrom'];
        $row_array['recipient'] = $row['recipient'];
        $row_array['custcomment'] = $row['custcomment'];
        $row_array['ordertypefk'] = $row['ordertypefk'];
        $row_array['tenuredays'] = $row['tenuredays'];
        $row_array['mmtype'] = $row['mmtype'];
        $row_array['mmtypebank'] = $row['mmtypebank'];
        $row_array['currentstatus'] = $row['currentstatus'];
        
        //push the values in the array
        array_push($json_response,$row_array);
    }
    echo json_encode($json_response);
    
    //Close the database connection
    mysql_close($db);
 
?>