<?php
require('connectdb.php');

$to = $_GET['to'];

// Opens a connection to a MySQL server
$connection=mysqli_connect ('localhost', $username, $password);
if (!$connection) {
  die('Not connected : ' . mysql_error());
}

// Set the active MySQL database
$db_selected = mysqli_select_db($connection, $database);
if (!$db_selected) {
  die ('Can\'t use db : ' . mysql_error());
}

$query = "SELECT * FROM markers WHERE email='".$to."' ";
$result =mysqli_query($connection, $query) or die('Can\'t find email id :' .mysql_error());
if(mysqli_num_rows($result) === 0){
	echo('error');
	die('No row found');
}
$password = random();

$subject = "Mail for Password Recovery";
$body = "<html>
<body>
	<div>
		<p><strong>Hello</strong> , <br>Thanks for using our services.<br> Your new password is <strong>". $password ."</strong></p>
		<p> Please <strong>Log In </strong>to our jproject.in and change the password under Options &gt; Settings</p>
	</div>
</body>
</html>";
$type = 'html';
$charset = 'utf-8';

$mail     = 'J-Project <no-reply@'.str_replace('www.', '', $_SERVER['SERVER_NAME']).'>';
$uniqid   = md5(uniqid(time()));
$headers  = 'From: '.$mail."\n";
$headers .= 'Reply-to: '.$mail."\n";
$headers .= 'Return-Path: '.$mail."\n";
$headers .= 'Message-ID: <'.$uniqid.'@'.$_SERVER['SERVER_NAME'].">\n";
$headers .= 'MIME-Version: 1.0'."\n";
$headers .= 'Date: '.gmdate('D, d M Y H:i:s', time())."\n";
$headers .= 'X-Priority: 3'."\n";
$headers .= 'X-MSMail-Priority: Normal'."\n";
$headers .= 'Content-Type: multipart/mixed;boundary="----------'.$uniqid.'"'."\n\n";
$headers .= '------------'.$uniqid."\n";
$headers .= 'Content-type: text/'.$type.';charset='.$charset.''."\n";
$headers .= 'Content-transfer-encoding: 7bit';

if(!mail($to, $subject, $body, $headers)){
	echo ("error");
	die('mail error');
}else{
	$query = "UPDATE markers SET password ='". $password ."' WHERE email = '".$to."'";
	$result = mysqli_query($connection, $query);
	if(!$result){
		echo('error');
		die('Can\'t update password :' .mysql_error());
	}
	echo('success');
}

mysqli_close($connection);

/*for random string*/
function random($characters=8,$letters = '23456789bcdfghjkmnpqrstvwxyz'){
	$str='';
	for ($i=0; $i<$characters; $i++) { 
		$str .= substr($letters, mt_rand(0, strlen($letters)-1), 1);
	}
	return $str;
}	
?>