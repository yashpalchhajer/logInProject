<?php
define('HOST', 'localhost');
define('PORT', '3306');
define('DB','MiniProject');
define('USER', 'root');
define('PASS','');


function getDb()
{

	try{
	$conn = new PDO('mysql:host='.HOST.':'.PORT.';dbname='.DB,USER,PASS);
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}catch(Exception $e){
	header('HTTP/1.1 404 Data base error');
	exit(json_encode(array('message' => $e->getMessage())));
	}
	return $conn;
}
// $con = getDb();
// print_r($con);

?>