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
    $result = mysql_query("select offerid,orderidfk,nearspot,nearmargin,nearfinal,offers_swap.neardate,offeredby,offers_swap.fardate,offers_swap.nearbuyorderamountccy,offers_swap.nearbuyorderamount,offers_swap.nearsellorderamountccy,offers_swap.nearsellorderamount,usernamefk
    ,ccypair,orderdate,farfinal,buysell,buysellbank,currentstatus,recipient,ordertypefk,status,if(buysell='BUY' AND offers_swap.nearbuyorderamount>0,'REC',if(buysell='SELL' AND offers_swap.nearsellorderamount>0,'REC','PAY')) recbank,
    if(buysell='BUY' AND offers_swap.nearbuyorderamount>0,'PAY',if(buysell='SELL' AND offers_swap.nearsellorderamount>0,'PAY','REC')) paybank,offers_swap.farbuyorderamount,offers_swap.farbuyorderamountccy,offers_swap.farsellorderamountccy,offers_swap.farsellorderamount
    from offers_swap left join Swaporders on offers_swap.orderindex = Swaporders.orderindex where status = 'Accepted' and confirm = 'Pending' and offeredby = '$bankid' ", $db);  
    
    //Create an array
    $json_response = array();
    
    while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
        $row_array['offerid'] = $row['offerid'];
        $row_array['orderidfk'] = $row['orderidfk'];
        $row_array['nearspot'] = $row['nearspot'];
        $row_array['nearmargin'] = $row['nearmargin'];
        $row_array['nearfinal'] = $row['nearfinal'];
        $row_array['neardate'] = $row['neardate'];
        $row_array['offeredby'] = $row['offeredby'];
        $row_array['fardate'] = $row['fardate'];
        $row_array['nearbuyorderamountccy'] = $row['nearbuyorderamountccy'];
        $row_array['nearbuyorderamount'] = $row['nearbuyorderamount'];
        $row_array['nearsellorderamountccy'] = $row['nearsellorderamountccy'];
        $row_array['nearsellorderamount'] = $row['nearsellorderamount'];
        $row_array['comment'] = $row['comment'];
        $row_array['ccypair'] = $row['ccypair'];
        $row_array['farfinal'] = $row['farfinal'];
        $row_array['farbuyorderamount'] = $row['farbuyorderamount'];
        $row_array['farbuyorderamountccy'] = $row['farbuyorderamountccy'];
        $row_array['farsellorderamount'] = $row['farsellorderamount'];
        $row_array['farsellorderamountccy'] = $row['farsellorderamountccy'];
        $row_array['buysell'] = $row['buysell'];
        $row_array['buysellbank'] = $row['buysellbank'];
        $row_array['currentstatus'] = $row['currentstatus'];
        $row_array['recipient'] = $row['recipient'];
        $row_array['ordertypefk'] = $row['ordertypefk'];
        $row_array['usernamefk'] = $row['usernamefk'];
        $row_array['status'] = $row['status'];
        $row_array['recbank'] = $row['recbank'];
        $row_array['paybank'] = $row['paybank'];
        
        //push the values in the array
        array_push($json_response,$row_array);
    }
    echo json_encode($json_response);
    
    //Close the database connection
    mysql_close($db);
 
?>