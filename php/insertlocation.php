<?php
include('connectdb.php');
$lat=$_GET['lat'];
$lon=$_GET['lon'];
$reg=$_GET['reg'];
$uid=$_COOKIE['uid'];
$result=mysqli_query($connect,"INSERT INTO `position`(uid,latitude,longitude,region) VALUES ($uid,$lat,$lon,$reg)")
or die("mysql error". mysqli_error());
msql_close($connect);
?>