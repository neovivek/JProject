<?php
	session_start();
	include("/phptextClass.php");	
	
	/*create class object*/
	$phptextObj = new phptextClass();	
	/*phptext function to genrate image with text*/
	$phptextObj->phpcaptcha('#345','#777',180,60,10,25);
 ?>