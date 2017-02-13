<?php

if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) and strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'){
	require("connectdb.php");
	header("Content-type: text/xml");
	$latitude = $_REQUEST["latitude"];
	$longitude = $_REQUEST["longitude"];

	session_start();
	if(isset($_SESSION['userid']))
	{
		$userid = $_SESSION["userid"];
		$connection=mysqli_connect('localhost', $username, $password);
		if (!$connection) {
		  die('<error content="Not connected : ' . mysql_error() . '"></error>');
		}

		// Set the active MySQL database
		$db_selected = mysqli_select_db($connection, $database);
		if (!$db_selected) {
		  die ('<error content="Can\'t use db : ' . mysql_error() . '"></error>');
		}

		$result = mysqli_query( $connection,"UPDATE markers SET lat='".$latitude."', lng='".$longitude."' WHERE id='".$userid."' " )
		or die('<error content="Invalid query: ' . mysql_error() . '"></error>');

		require('./map.php');
		mysqli_close($connection);
	}
}else{
	echo ("You don't have permission to access this piece of information. Go to <a href='/'>home page</a>.");
}
?>