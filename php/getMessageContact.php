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
	$db_selected = mysqli_select_db($connection, 'openfire');
	if (!$db_selected) {
	  die ('Can\'t use db : ' . mysql_error());
	}
	$ClientId = $_SESSION['userid'].'@hp';
	$query = "SELECT DISTINCT `fromJID` 
		FROM `ofmessagearchive` 
		WHERE `toJID`='".$ClientId."' 
		ORDER BY 'sentDate' DESC
		LIMIT 5 ";
	$result = mysqli_query($connection, $query)
	or die('<li></li>');

	while($row = mysqli_fetch_array($result)){
		$id = $row['fromJID'];
		$id = explode('@', $id)[0];
		$query1 = "SELECT `name` FROM `ofuser` WHERE `username`='".$id."' ";
		$result1 = mysqli_query($connection, $query1)
		or die('<li></li>');
		$row1 = mysqli_fetch_array($result1);
		echo '<li id="'.$id.'-hp" class="user-respond"><div class="roster-contact user-respond-head"><div class="roster-name">'.$row1['name'].'</div></div></li>';
	}
	mysqli_close($connection);

}else{
	echo"Get off !!!";
}

?>