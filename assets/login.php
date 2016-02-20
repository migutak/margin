<?php
    require_once('connect.php');
    
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    
    $user = $request->username;
    $pass = $request->password;
 
    // array for JSON response
    $response = array();
    
        $firstQuery = "select * from `tblusers` where `username` = '$user' and password = '$pass' LIMIT 1";
        $firstResult = $db->query($firstQuery);
        $useravailable = $firstResult->fetch_assoc();
    
    if($useravailable){
        $response["result"] = "YES";
        $response["usertype"] = $useravailable['usertype'];
        $response["domain"] = $useravailable['domain'];
    }
    else{
        $response["result"] = "NO";
        
    }
    
    header('Content-type: text/plain');
    // echo JSON
    echo json_encode($response);
        
?>