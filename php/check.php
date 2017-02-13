<?php
$jid = $_REQUEST['jid'];	
session_start();
header("Content-type: text/xml");
if(isset($_SESSION['userid']) and $_SESSION['userid'] === $jid){
	echo('<user><success content="user is logged in"></success></user>');
}
?>