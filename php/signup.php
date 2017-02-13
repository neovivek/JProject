<?php

if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
	require('connectdb.php');
	session_start();
	if(!(isset($_REQUEST['t']))){
		die();
	}
	header('Content-type: text/xml');

	$connection=mysqli_connect ('localhost', $username, $password);
	if (!$connection) {
	  die('<error content="Not connected : ' . mysql_error(). '"></error>');
	}

	// Set the active MySQL database
	$db_selected = mysqli_select_db($connection, $database);
	if (!$db_selected) {
	  die ('<error content="Can\'t use db : ' . mysql_error() . '"></error>');
	}

	if($_REQUEST['t'] == 1){

		if(empty($_SESSION['captcha_code']) || strcasecmp($_SESSION['captcha_code'], $_REQUEST['captcha_code']) != 0){  
		    echo ("<error content='The Validation code does not match!'></error>");
		    die();
		}

		$query = "SELECT * FROM markers WHERE username='".$_REQUEST['username']."'";
		$result =mysqli_query($connection, $query) or die('<error content="Can\'t find username :' .mysql_error() .'"></error>');
		if(mysqli_num_rows($result) > 0){
			echo('<error content="Change the Username as it is already choosen"></error>');
			die();
		}

		$query = "SELECT * FROM markers WHERE email='".$_REQUEST['email']."'";
		$result =mysqli_query($connection, $query) or die('Can\'t find email id :' .mysql_error());
		if(mysqli_num_rows($result) > 0){
			echo('<error content="Change the Email as it is already used" ></error>');
			die();
		}

		$query = "SELECT * FROM markers WHERE mobile='".$_REQUEST['number']."'";
		$result =mysqli_query($connection, $query) or die('Can\'t find mobile :' .mysql_error());
		if(mysqli_num_rows($result) > 0){
			echo('<error content="Change the Mobile number as it is already used"></error>');
			die();
		}
		$a = $_REQUEST['username'];
		$b = $_REQUEST['name'];
		$d = $_REQUEST['pass'];
		$e = $_REQUEST['number'];
		$f = $_REQUEST['email'];

		$result = mysqli_query($connection, 'INSERT INTO `markers`( `username`, `name`, `password`, `xmpppass`, `email`, `mobile`, `signupLevel`) VALUES ("'.$a.'", "'.$b.'", "'.$d.'", "'.$d.'", "'.$f.'", "'.$e.'", "1" )');
		if(!$result){
			echo ('<error content="Can\'t Process Your Signup .Please try again after some time ."></error>');
			die(mysql_error());
		}

		$query = "SELECT * FROM markers WHERE username='".$_REQUEST['username']."'";
		$result = mysqli_query($connection, $query) or die('<error content="Can\'t find username :' .mysql_error() . '"></error>');

		echo '<users>';
		$res = mysqli_fetch_array($result);
		echo '<user id="'. $res['id'] .'" ></user></users>';
		
		$_SESSION["username"] = $res["username"];
		$_SESSION["number"] = $res['mobile'];
		$_SESSION["userid"] = $res["id"];
		$_SESSION["xmpppass"] = $res["xmpppass"];
		$_SESSION["resval"] = -1;
		$_SESSION["name"] = $res["name"];
		$_SESSION["mail"] = $res["email"];
	}elseif ($_REQUEST['t'] == 2) {
		if(!(isset($_SESSION['userid']))){
			die('<error content="User Invalid" ></error>');
		}
		$query = " UPDATE `markers` SET `address`='".$_REQUEST['city']."', `gender`='".$_REQUEST['gender']."', `signupLevel`='2' WHERE `id`='".$_SESSION['userid']."' ";
		$result = mysqli_query($connection, $query) or die('<error content="Can\'t connect at this moment"></error>');
		echo "<users><user id='".$_SESSION['userid']."' ></user></users>";

	}elseif($_REQUEST['t'] == 3){
		if(!(isset($_SESSION['userid']))){
			die('<error content="User Invalid" ></error>');
		}
		$query1 = "UPDATE `markers` SET signupLevel='3' WHERE id='".$_SESSION['userid']."' ";
		$result1 = mysqli_query($connection, $query1) or die("<error content='Can\'t Perform Operation'></error>");
		echo "<users><user id='".$_SESSION['userid']."' ></user></users>";
	}elseif($_REQUEST['t'] == 4){
		if(!(isset($_SESSION['userid']))){
			die('<error content="User Invalid" ></error>');
		}
		$intrest = $_REQUEST['checked'];
		$query1 = "UPDATE `markers` SET signupLevel='4', intrest='".$intrest."' WHERE id='".$_SESSION['userid']."' ";
		$result1 = mysqli_query($connection, $query1) or die("<error content='Can\'t Perform Operation'></error>");
		echo "<users><user id='".$_SESSION['userid']."' ></user></users>";
	}elseif ($_REQUEST['t'] == 5) {
		if(!(isset($_SESSION['userid']))){
			die('<error content="User Invalid"></error>');
		}
		$status = str_replace("+", " ", $_REQUEST['s']);
		$status = str_replace("'", "\'", $status);
		$query1 = "UPDATE `markers` SET signupLevel='5', about='".$status."' WHERE id='".$_SESSION['userid']."' ";
		$result1 = mysqli_query($connection, $query1) or die("<error content='Can\'t Perform Operation'></error>");
		echo "<users><user id='".$_SESSION['userid']."' ></user></users>";
	}

	mysqli_close($connection);
}else{
	echo "You don't have access to this data. Go to <a href='/'>home page.</a>";
}
?>