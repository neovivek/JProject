<?php
    session_start();
    if(!isset($_SESSION['userid'])){
        header('Location: /');
    }else{
    	header("Location: /user.php?id=".$_REQUEST['id']);
    }
?>