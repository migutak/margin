<?php

    //require_once('connect.php');
    
    $offerid = $_GET['id'];

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
    $result = mysql_query("select offerid,orderidfk,nearspot,nearmargin,nearfinal,Swaporders.neardate,offeredby,offers_swap.nearbuyorderamountccy,offers_swap.nearbuyorderamount,offers_swap.nearsellorderamountccy,offers_swap.nearsellorderamount,createdate,usernamefk
    ,ccypair,orderdate,farspot,farmargin,farfinal,buysell,offers_swap.farbuyorderamount,offers_swap.farbuyorderamountccy,offers_swap.farsellorderamountccy,offers_swap.farsellorderamount,recipient,comment,custcomment,ordertypefk,Swaporders.fardate,
    if(buysell='BUY' AND offers_swap.nearbuyorderamount>0,'REC',if(buysell='SELL' AND offers_swap.nearsellorderamount>0,'REC','PAY')) recbank,
    if(buysell='BUY' AND offers_swap.nearbuyorderamount>0,'PAY',if(buysell='SELL' AND offers_swap.nearsellorderamount>0,'PAY','REC')) paybank
    from offers_swap left outer join Swaporders on offers_swap.orderidfk = Swaporders.orderid where offerid = $offerid ", $db);  
    
    //Create an array
    $json_response = array();
    
    while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
        $row_array['offerid'] = $row['offerid'];
        $row_array['orderidfk'] = $row['orderidfk'];
        $row_array['spotrate'] = $row['spotrate'];
        $row_array['neardate'] = $row['neardate'];
        $row_array['nearfinal'] = $row['nearfinal'];
        $row_array['farfinal'] = $row['farfinal'];
        $row_array['offeredby'] = $row['offeredby'];
        $row_array['fardate'] = $row['fardate'];
        $row_array['createdate'] = $row['createdate'];
        $row_array['ccypair'] = $row['ccypair'];
        $row_array['nearsellorderamountccy'] = $row['nearsellorderamountccy'];
        $row_array['nearsellorderamount'] = $row['nearsellorderamount'];
        $row_array['nearbuyorderamountccy'] = $row['nearbuyorderamountccy'];
        $row_array['nearbuyorderamount'] = $row['nearbuyorderamount'];
        $row_array['farsellorderamountccy'] = $row['farsellorderamountccy'];
        $row_array['farsellorderamount'] = $row['farsellorderamount'];
        $row_array['farbuyorderamountccy'] = $row['farbuyorderamountccy'];
        $row_array['farbuyorderamount'] = $row['farbuyorderamount'];
        $row_array['offeredrate'] = $row['offeredrate'];
        $row_array['buysell'] = $row['buysell'];
        $row_array['buysellbank'] = $row['buysellbank'];
        $row_array['comment'] = $row['comment'];
        $row_array['ordertypefk'] = $row['ordertypefk'];
        $row_array['usernamefk'] = $row['usernamefk'];
        $row_array['recbank'] = $row['recbank'];
        $row_array['paybank'] = $row['paybank'];
        
        //push the values in the array
        array_push($json_response,$row_array);
    }
    echo json_encode($json_response);
    
    //Close the database connection
    mysql_close($db);
 
?>