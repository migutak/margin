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
    $result = mysql_query("select username,name,email,createdate,usertype from tblusers where usertype = 'BANK' ", $db);  
    
    //Create an array
    $json_response = array();
    
    while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
        $row_array['username'] = $row['username'];
        $row_array['name'] = $row['name'];
        $row_array['email'] = $row['email'];
        $row_array['createdate'] = $row['createdate'];
        $row_array['usertype'] = $row['usertype'];
        
        
        //push the values in the array
        array_push($json_response,$row_array);
    }
    echo json_encode($json_response);
    
    //Close the database connection
    mysql_close($db);
 
?>