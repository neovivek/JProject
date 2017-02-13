<?php

if(!(empty($_SERVER['HTTP_X_REQUESTED_WITH'])) and strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'){
	session_start();
	require('connectdb.php');
	if(!(isset($_SESSION['userid']))){
		header("Location: /");
		die();
	}
	$connection=mysqli_connect ('localhost', $username, $password);
	if (!$connection) {
	  die('Not connected : ' . mysql_error());
	}

	// Set the active MySQL database
	$db_selected = mysqli_select_db($connection, 'openfire');
	if (!$db_selected) {
	  die ('Can\'t use db : ' . mysql_error());
	}
	$query = "SELECT name FROM `ofuser` WHERE `username`='".mysqli_escape_string($connection, $_REQUEST['n'])."' ";
	$result = mysqli_query($connection, $query)
	or die();
	$namearray = mysqli_fetch_array($result);
	echo $namearray['name'];
}else{
	echo"Get off !!!";
}

?>