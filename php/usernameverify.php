<?php
require('connectdb.php');

$connection = mysqli_connect('localhost', $username, $password) 
or die('Can\'t connect to the network');

$db = mysqli_select_db($connection, $database)
or die('Can\'t connect to the network');

header("Content-type: text/xml");
echo "<user>";

if(!(isset($_POST['username']))){
	echo "<error> Data not available </error></user>";
	die();
}

$query = "SELECT * FROM markers WHERE username='".$_POST['username']."' ";
$result = mysqli_query($connection, $query) or die("<error>Mysql error </error></user>");
if(mysqli_num_rows( $result ) > 0){
	echo "<error>Username not available</error>";
}else{
	echo "<success>Username available</success>";
}

echo "</user>";
mysqli_close($connection);
?>