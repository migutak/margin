<?php 
	#Include the connect.php file
	include ('connect.php');
// Connect to the database
// connection String
//$mysqli = new mysqli($hostname, $username, $password, $database);
/* check connection */
if (mysqli_connect_errno())
	{
	printf("Connect failed: %s\n", mysqli_connect_error());
	exit();
	}
// get data and store in a json array
$pagenum = $_GET['pagenum'];
$pagesize = $_GET['pagesize'];
$start = $pagenum * $pagesize;

$query = "SELECT SQL_CALC_FOUND_ROWS offerid, orderidfk, spotrate, settlementdate, offeredby, ccysettleamount FROM offers LIMIT ?,?";
$result = $db->prepare($query);
$result->bind_param('ii', $start, $pagesize);
$result->execute();

/* bind result variables */
$result->bind_result($offerid, $orderidfk, $spotrate, $settlementdate, $offeredby, $ccysettleamount);
/* fetch values */
while ($result->fetch())
	{
	$customers[] = array(
		'CompanyName' => $offerid,
		'ContactName' => $orderidfk,
		'ContactTitle' => $spotrate,
		'Address' => $settlementdate,
		'City' => $offeredby,
		'Country' => $ccysettleamount
	);
	}
$result = $db->prepare("SELECT FOUND_ROWS()");
$result->execute();
$result->bind_result($total_rows);
$result->fetch();
$data[] = array(
	'TotalRows' => $total_rows,
	'Rows' => $customers
);
echo json_encode($data);
/* close statement */
$result->close();
/* close connection */
$db->close();
?>