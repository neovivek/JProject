<?php

$to = "admin@jproject.in";
$submail = $_GET['to'];
$sub = $_GET['sub'];
$b = $_GET['b'];

$subject = "Mail from User about=> ".$sub;
$body = "<html>
<body>
	<div>
		<h4>".$submail."</h4>
		<p>User query:<br>".$b."</p>
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

header('Content-type: text/xml');
if(!mail($to, $subject, $body, $headers)){
	die('<error content="mail error"></error>');
}else{
	echo('<success></success>');
}

?>