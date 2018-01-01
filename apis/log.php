<?php
require_once('dbconfig.php');

if(file_get_contents('php://input')){
	$post_data = file_get_contents('php://input');
	$req = json_decode($post_data);
	$action = $req->action;
}
else if(isset($_POST) != "")
{	
		// var_dump($_POST);
	$req = $_POST;
	$action = $req['action'];
}
$con  = getDb();

// print_r($req);
// print_r($_FILES['profile']);
// return;
switch ($action) {
	case 'register':
	// var_dump($_FILES['profile']);

	$f = false;
	// $pname = ;
	$pname = substr($req['fname'],0,3).substr($req['phone'],6,10);
	// echo '\n '.$pname;
	$target_dir = "../images/";

	$filename = stripslashes($_FILES['profile']['name']);
	$extension = getExtension($filename);
	$extension = strtolower($extension);

	if ($extension != "jpg" && $extension != "jpeg"	&& $extension != "png"){
		exit(json_encode(array('status' => '0','Message' =>' Unknown Image extension ')));
	}


	$picName =  $pname.'.'.$extension;
	// echo $picName;
	$target_file = $target_dir . $picName;
	// echo $target_file;
	if(file_exists($target_file)){
		header('HTTP/1.1 409 File Already Exists');
		exit(json_encode(array('Message' => 'Image of same name already exists try with Another name of image yash')));
	}
	if(move_uploaded_file($_FILES["profile"]["tmp_name"], $target_file)){
		$f = true;
	}

	if($f){
		try {
			$sql = "INSERT INTO `users`(`f_Name`, `l_Name`, `e_Mail`, `age`, `phone`, `address`, `password`, `profile_Pic`) VALUES (?,?,?,?,?,?,?,?)";				
			$arg = array();
			array_push($arg, $req['fname']);		
			array_push($arg, $req['lname']);		
			array_push($arg, $req['mail']);		
			array_push($arg, $req['age']);		
			array_push($arg, $req['phone']);		
			array_push($arg, $req['address']);
			array_push($arg, $req['pass']);
			array_push($arg, $picName);		
			$qry = $con->prepare($sql);
			$qry->execute($arg);
			exit(json_encode(array('message' => 'Registration Successful')));
		}catch (Exception $e) {
			header('HTTP/1.1 520 Unknown Error');
			exit(json_encode(array('message' => $e->getMessage())));
		}
	}else{
		header('HTTP/1.1 422 Upload Error');
		exit(json_encode(array('status' => '0', 'message' => 'Error occures in uploading logo file')));
	}




// register ends
	break;

	case 'login': 
	$data = $req->data;
		// var_dump($data->uid);

	$sql = "SELECT `u_No`, `f_Name`, `e_Mail`, `password` FROM `users` WHERE `e_Mail` = ?";
	$qry = $con->prepare($sql);
	$qry->execute(array($data->uid));
	$res = $qry->fetchAll(PDO::FETCH_ASSOC);
	if($res){
		if($res[0]['password'] == $data->upass){
			$tok = '$'.$res[0]['u_No'].'$'.date('Y:m:d H:i:s');
			$tok  = base64_encode($tok);
			exit(json_encode(array('message' => "Logged in",'token' => $tok)));
		}else{
			header("HTTP/1.1 401 Unauthorised");
			exit(json_encode(array('message' => 'Unauthorised')));
		}
	}else{
		header("HTTP/1.1 401 No Such User Found");
		exit(json_encode(array('message' => 'No User Found')));
	}

	break;

	case 'profile':
	$head = getallheaders();

		// var_dump($head);

		// var_dump($head['Authorization']);
	$head = explode(',', $head['Authorization']);
		// var_dump($head);
		// $h = base64_decode($head[1]);
	$token = explode('$',(base64_decode(($head[1]))));

	if(!$token[1]){
		header("HTTP/1.1 401 Unauthorised");
		exit(json_encode(array('message' => "Unauthorised Access please login first")));
	}

	$sql = "SELECT `u_No`, `f_Name`, `l_Name`, `e_Mail`, `age`, `phone`, `address`, `profile_Pic` FROM `users` WHERE `u_No` = ?";
	$qry = $con->prepare($sql);
	$qry->execute(array($token[1]));
	$res = $qry->fetchAll(PDO::FETCH_ASSOC);
	if($res[0]){
		exit(json_encode(array('message' => $res)));
	}else{
		header('HTTP/1.1 404 No Data Found');
		exit(json_encode(array('message' => 'No Data found please login and try again')));
	}

	break;

	case 'updateUser':

	$f = false;
	// $pname = ;
	// $pname = substr($req['fname'],0,3).substr($req['phone'],6,10);
	// echo '\n '.$pname;
	$target_dir = "../images/";
	if($_FILES['profile']){

		$filename = stripslashes($_FILES['profile']['name']);
		$extension = getExtension($filename);
		$extension = strtolower($extension);

		if ($extension != "jpg" && $extension != "jpeg"	&& $extension != "png"){
			exit(json_encode(array('status' => '0','Message' =>' Unknown Image extension ')));
		}


		$picName =  $req['pro'];
		// echo $picName;
		$target_file = $target_dir . $picName;
		// echo $target_file;
		unlink($target_file);
		if(file_exists($target_file)){
			header('HTTP/1.1 409 File Already Exists');
			exit(json_encode(array('Message' => 'Image of same name already exists try with Another name of image yash')));
		}
		if(move_uploaded_file($_FILES["profile"]["tmp_name"], $target_file)){
			$f = true;
		}
	}else
	{
		$f = true;
	}
	if($f){
		print_r($req['lname']);
		try {
			$sql = "UPDATE `users` SET `f_Name`=?,`l_Name`=?,`e_Mail`=?,`age`=?,`phone`=?,`address`=? WHERE `u_No`=? ";				
			$arg = array();
			array_push($arg, $req['fname']);
			array_push($arg, $req['lname']);		
			array_push($arg, $req['mail']);		
			array_push($arg, intval($req['age']));		
			array_push($arg, $req['phone']);		
			array_push($arg, $req['address']);
			array_push($arg,$req['no']);
			// array_push($arg, $req['']);	

			$qry = $con->prepare($sql);
			// var_dump($qry);
			var_dump($arg);
			$qry->execute($arg);
			// exit(json_encode(array('message' => 'User Details Updated Successful')));
		}catch (Exception $e) {
			header('HTTP/1.1 520 Unknown Error');
			exit(json_encode(array('message' => $e->getMessage())));
		}
	}else{
		header('HTTP/1.1 422 Upload Error');
		exit(json_encode(array('status' => '0', 'message' => 'Error occures in uploading image file')));
	}

	break;

	case 'change':
		$data = $req->data;
		// print_r($data);
		$head = getallheaders();
		$head = explode(',', $head['Authorization']);
		$token = explode('$',(base64_decode(($head[1]))));
		// var_dump($token);
		if(!$token[1]){
			header("HTTP/1.1 401 Unauthorised");
			exit(json_encode(array('message' => "Unauthorised Access please login first")));
		}
		try{
			$sql = "UPDATE `users` SET `password` = ? WHERE `u_No` = ? AND `password` = ?";
			$pre = $con->prepare($sql);
			$res = $pre->execute(array($data->new,$token[1],$data->old));
			// var_dump($res);
			exit(json_encode(array('message' => 'Password Changed')));
		}catch(Exception $e){
			header('HTTP/1.1 522 Unknown Error');
			exit(json_encode(array('message' => $e->getMessage()))); 
		}
	break;

	case 'forgot':
	// print_r($req->data);
	$sql = "SELECT `u_No`, `f_Name` FROM `users` WHERE `e_Mail` = ?";
	$qry = $con->prepare($sql);
	$qry->execute(array($req->data));
	$res = $qry->fetchAll(PDO::FETCH_ASSOC);
	if($res){
		exit(json_encode(array('message' => "A recovery Code sended to your mail")));
	}else{
		header('HTTP/1.1 404 No Data Found');
		exit(json_encode(array('message' => 'No Data found please enter right mail id')));
	}


	break;

	default:
				# code...
	break;
}


function getExtension($str) {
	$i = strrpos($str,".");
	if (!$i) { return ""; } 
	$l = strlen($str) - $i;
	$ext = substr($str,$i+1,$l);
	return $ext;
}

?>