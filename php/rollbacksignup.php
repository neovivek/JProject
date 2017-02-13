<?php
require('connectdb.php');
session_start();

$connection=mysqli_connect ('localhost', $username, $password);
if (!$connection) {
  die('Not connected : ' . mysql_error());
}

// Set the active MySQL database
$db_selected = mysqli_select_db($connection, $database);
if (!$db_selected) {
  die ('Can\'t use db : ' . mysql_error());
}
$a = $_REQUEST['username'];
$b = $_REQUEST['name'];
$d = $_REQUEST['pass'];
$e = $_REQUEST['email'];

$query = "DELETE FROM `markers` WHERE username='".$a."' AND email='".$e."' ";
$result = mysqli_query($connection, $query) or die();

mysqli_close($connection);
?>