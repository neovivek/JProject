<?php
require('connectdb.php');
session_start();
date_default_timezone_set("asia/kolkata");

if(!(isset($_SESSION['userid']))){
	header("Location: /");
	die();
}
$connection=mysqli_connect ('localhost', $username, $password);
if (!$connection) {
  die('Not connected : ' . mysql_error());
}

// Set the active MySQL database
$db_selected = mysqli_select_db($connection, $database);
if (!$db_selected) {
  die ('Can\'t use db : ' . mysql_error());
}

if(!(isset($_POST['ImageFileName'])) or !(isset($_POST['t'])) or !(isset($_POST['refresh']))){
	header("Location: /signupengine.php");
	die();
}
$filepath = $_POST['ImageFileName'];
$t = $_POST['t'];
$refreshTag = $_POST['refresh'];

if($t == 3 and $refreshTag == 1){
	$query = "UPDATE `markers` SET pictureLocation='".str_replace('\\', '/', $filepath)."', signupLevel='3' WHERE id='".$_SESSION['userid']."' ";
	$result = mysqli_query($connection, $query) or die("Can't Perform Operation");

	$query = "INSERT INTO `imagedata`(`path`, `userid`, `dateOfCreation`, `visibility`) VALUES ('".str_replace('\\', '/', $filepath)."', '".$_SESSION['userid']."', '".date("Y-m-d H:i:s")."', '1') ";
	$result = mysqli_query($connection, $query);
	if(!($result)){
		echo ("Can't Update image in database. Please try again.");
		$query1 = "UPDATE `markers` SET pictureLocation='', signupLevel='2' WHERE id='".$_SESSION['userid']."' ";
		$result1 = mysqli_query($connection, $query1) or die("Can't Perform Operation");
	}
}
header("Location: /signupengine.php");

mysqli_close($connection);
?>