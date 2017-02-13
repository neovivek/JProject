<?php

require('connectdb.php');

// Opens a connection to a MySQL server
$connection=mysqli_connect ('localhost', $username, $password);
if (!$connection) {
  die('Not connected : ' . mysql_error());
}

// Set the active MySQL database
$db_selected = mysqli_select_db($connection, $database) or die ('Can\'t use db : ' . mysql_error());

$mobile = $_REQUEST["name"];
$password = $_REQUEST["pass"];

//$password=sha1($password);

session_start();
if($mobile!="" and $password!=""){
	$query = " SELECT * FROM `markers` WHERE mobile = '".$mobile."' ";
	$uid = mysqli_query($connection, $query) or die("Couldn't Select id ".mysql_error());
	$res = mysqli_fetch_array($uid);
	if ($res['password'] == $password){
		$_SESSION["username"] = $res["username"];
		$_SESSION["number"] = $mobile;
		$_SESSION["userid"] = $res["id"];
		$_SESSION["xmpppass"] = $res["xmpppass"];
		$_SESSION["resval"] = -1;
		$_SESSION["name"] = $res["name"];
		$_SESSION["mail"] = $res["email"];
		if(isset($_SESSION['failedLogin']))
			unset($_SESSION['failedLogin']);
		if($res['signupLevel'] > 4)
			header("Location: /home.php");
		else
			header("Location: /signupengine.php");
	}else{
		$_SESSION["failedLogin"] = 1;
		if(array_count_values($res) == 0)
			header("Location: /loginattempt.php?t=1");
		else
			header("Location: /loginattempt.php?t=2&u=".$mobile);
	}
}else{
	header("Location: /");
}

mysqli_close($connection);
?>