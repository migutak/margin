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
    $result = mysql_query("select offerid,orderidfk,fixedrate,daycount,totalinterest,tax,netinterest,offeredby,offerdate,status,usernamefk
    ,orderdate,mmfrom,mmto,mmtype,mmtypebank,Moneymarketorders.orderamount,orderdate,ccy,bankcomment,tenuredays,recipient,custcomment,ordertypefk,currentstatus,bankuser 
    from offers_mm left join Moneymarketorders on offers_mm.orderindex = Moneymarketorders.orderindex where status = 'Accepted' and confirm = 'Pending' and offeredby = '$bankid' ", $db);  
    
    //Create an array
    $json_response = array();
    
    while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
        $row_array['offerid'] = $row['offerid'];
        $row_array['orderidfk'] = $row['orderidfk'];
        $row_array['fixedrate'] = $row['fixedrate'];
        $row_array['daycount'] = $row['daycount'];
        $row_array['totalinterest'] = $row['totalinterest'];
        $row_array['tax'] = $row['tax'];
        $row_array['netinterest'] = $row['netinterest'];
        $row_array['offeredby'] = $row['offeredby'];
        $row_array['status'] = $row['status'];
        $row_array['usernamefk'] = $row['usernamefk'];
        $row_array['orderdate'] = $row['orderdate'];
        $row_array['mmfrom'] = $row['mmfrom'];
        $row_array['mmto'] = $row['mmto'];
        $row_array['mmtype'] = $row['mmtype'];
        $row_array['mmtypebank'] = $row['mmtypebank'];
        $row_array['orderdate'] = $row['orderdate'];
        $row_array['orderamount'] = $row['orderamount'];
        $row_array['ccy'] = $row['ccy'];
        $row_array['tenuredays'] = $row['tenuredays'];
        $row_array['ordertypefk'] = $row['ordertypefk'];
        $row_array['limitnum'] = $row['limitnum'];
        $row_array['limit_num'] = $row['limit_num'];
        $row_array['currentstatus'] = $row['currentstatus'];
        $row_array['recipient'] = $row['recipient'];
        $row_array['custcomment'] = $row['custcomment'];
        $row_array['bankcomment'] = $row['bankcomment'];
        $row_array['usernamefk'] = $row['usernamefk'];
        $row_array['bankuser'] = $row['bankuser'];
        
        //push the values in the array
        array_push($json_response,$row_array);
    }
    echo json_encode($json_response);
    
    //Close the database connection
    mysql_close($db);
 
?>