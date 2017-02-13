<?php
if(!(empty($_SERVER['HTTP_X_REQUESTED_WITH'])) and strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'){
	session_start();
	if(isset($_SESSION['userid'])){
		$id = $_SESSION['userid'];
		require ('connectdb.php');
		header('Content-type: text/xml');
		$connection=mysqli_connect ('localhost', $username, $password);
		if (!$connection) {
		  die('<data><error content="Not connected : ' . mysql_error() . '"></error></data>');
		}

		// Set the active MySQL database
		$db_selected = mysqli_select_db($connection, $database) or die ('<data><error content="Can\'t use db : ' . mysql_error() . '"></error></data>');

		if(isset($_REQUEST['name'])){
			$query = "UPDATE markers SET name ='".$_REQUEST['name']."' where id ='".$_SESSION['userid']."' ";
			$result = mysqli_query($connection, $query) or die ('<data><error content="could not complete the process" ></error></data>');
			echo('<data><success></success></data>');

		}else if(isset($_REQUEST['email'])){
			$query = "SELECT * FROM markers WHERE email='".$_REQUEST['email']."'";
			$result =mysqli_query($connection, $query) or die('<data><error conten="Can\'t find email id :' .mysql_error() . '"></error></data>');
			if(mysqli_num_rows($result) > 0){
				echo('<data><error content="Change the Email as it is already used"></error></data>');
				die();
			}
			$query = "UPDATE markers SET email ='".$_REQUEST['email']."' where id ='".$_SESSION['userid']."' ";
			$result = mysqli_query($connection, $query) or die ('<data><error content="could not complete the process"></error></data>');
			echo('<data><success></success></data>');

		}else if(isset($_REQUEST['uname'])){

			$query = "SELECT * FROM markers WHERE username='".$_REQUEST['uname']."'";
			$result =mysqli_query($connection, $query) or die('<data><error content="Can\'t find email id :' .mysql_error() . '"></error></data>');
			if(mysqli_num_rows($result) > 0){
				echo('<data><erro content="Change the Username as it is already taken" ></error></data>');
				die();
			}
			$query = "UPDATE markers SET username ='".$_REQUEST['uname']."' where id ='".$_SESSION['userid']."' ";
			$result = mysqli_query($connection, $query) or die ('<data><error content="could not complete the process"></error></data>');
			echo('<data><success></success></data>');

		}else if(isset($_REQUEST['passold']) && isset($_REQUEST['passnew']) && isset($_REQUEST['passnewv'])){

			$query = "SELECT * FROM markers WHERE id='".$_SESSION['userid']."'";
			$result =mysqli_query($connection, $query) or die('<data><error content="Can\'t find email id :' .mysql_error() . '"></error></data>');
			$res = mysqli_fetch_array($result);
			if($res['password'] != $_REQUEST['passold']){
				echo('<data><error content="Password is incorrect."></error></data>');
				die();
			}
			$query = "UPDATE markers SET password ='".$_REQUEST['passnew']."' where id ='".$_SESSION['userid']."' ";
			$result = mysqli_query($connection, $query) or die ('<data><error content="could not complete the process"></error></data>');
			echo('<data><success></success></data>');

		}else{
			echo("<data><error content='There is some error pls report a bug!!'></error></data>");
		}
		mysqli_close($connection);
	}else{
		echo("<data><error content='rocket'></error></data>");
	}
}else{
	echo "You don't have permission for accessing this data. Go to <a href='/'>home page</a>.";
}
?>