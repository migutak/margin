<?php
    $servername = getenv('IP');
    $username = getenv('C9_USER');
    $password = "";
    $database = "maginiq";
    $dbport = 3306;
    

    $con=mysql_connect("$servername", "$username", "$password")or die("cannot connect"); 
    mysql_select_db("$database")or die("cannot select DB");
    $sql = "select orderindex,orderid,usernamefk,ccypair,orderdate,orderamount,buysell,buysellbank,currentstatus,recipient,settlementdate,custcomment,ordertype
                from custorders where currentstatus = 'N'"; //replace emp_info with your table name 
    $result = mysql_query($sql);
    $json = array();
    if(mysql_num_rows($result)){
    while($row=mysql_fetch_row($result)){
        $json['orders'][]=$row;
    }
    }
    mysql_close($database);
    echo json_encode($json); 
// please refer to our PHP JSON encode function tutorial for learning json_encode function in detail 
?>