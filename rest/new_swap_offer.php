<?php
    require_once('connect.php');
    
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        
        $orderindex = $_GET['orderindex'];
        $orderidfk = $_GET['orderidfk'];
        $nearspotrate = $_GET['nearspotrate'];
        $nearmargin = $_GET['nearmargin'];
        $nearfinal = $_GET['nearfinal'];
        $nearbuyorderamountccy = $_GET['nearbuyorderamountccy'];
        $nearbuyorderamount = $_GET['nearbuyorderamount'];
        $nearsellorderamountccy = $_GET['nearsellorderamountccy'];
        $nearsellorderamount = $_GET['nearsellorderamount'];
        $neardate = $_GET['neardate'];
        $farspot = $_GET['farspot'];
        $farmargin = $_GET['farmargin'];
        $farfinal = $_GET['farfinal'];
        $farbuyorderamountccy = $_GET['farbuyorderamountccy'];
        $farbuyorderamount = $_GET['farbuyorderamount'];
        $farsellorderamountccy = $_GET['farsellorderamountccy'];
        $farsellorderamount = $_GET['farsellorderamount'];
        $fardate = $_GET['fardate'];
        $comment = $_GET['comment'];
        $offeredby = $_GET['offeredby'];
        // array for JSON response 
        $response = array();
        
        $neworderQuery = "insert into `offers_swap`(`orderindex`,`orderidfk`,`nearspot`,`nearmargin`,`nearfinal`,`nearbuyorderamountccy`,`nearbuyorderamount`,`nearsellorderamountccy`,`nearsellorderamount`,`neardate`,`farspot`,`farmargin`,`farfinal`,`farbuyorderamountccy`,`farbuyorderamount`,`farsellorderamountccy`,`farsellorderamount`,`fardate`,`comment`,`offeredby`) 
            values (".$orderindex.",'".$orderidfk."','".$nearspotrate."','".$nearmargin."',".$nearfinal.",'".$nearbuyorderamountccy."','".$nearbuyorderamount."','".$nearsellorderamountccy."','".$nearsellorderamount."','".$neardate."','".$farspot."','".$farmargin."','".$farfinal."','".$farbuyorderamountccy."','".$farbuyorderamount."','".$farsellorderamountccy."','".$farsellorderamount."','".$fardate."','".$comment."','".$offeredby."')";
        
        if($db->query($neworderQuery) === TRUE){
            $response["result"] = "Fx Swap Offers Successfully Made";
        }
        else{
            $response["result"] = "Error: " . $neworderQuery . "<br>" . $db->error;
        }
        mysql_close($db);
        header('Content-type: text/plain');
        echo json_encode($response);
?>