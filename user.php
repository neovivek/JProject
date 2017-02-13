<?php

session_start();
if(!isset($_SESSION['userid'])){
    header('Location: /');
}

require('./php/connectdb.php');
$connection = mysqli_connect ('localhost', $username, $password);
if (!$connection) {
  die('Not connected : ' . mysql_error());
}

$db_selected = mysqli_select_db($connection, 'openfire') or die ('Can\'t use db : ' . mysql_error());
$root = $_SESSION['userid'];
$id = $_REQUEST['id'];
$query = "SELECT * FROM ofRoster WHERE username ='".$root."' AND jid='".$id."@jprojectadmin' ";
$result = mysqli_query($connection, $query) or die ('Couldn\'t select. Report bug');
if(mysqli_num_rows($result) == 0 and $root != $id){
  header('Location: /pro.php?id='.$root);
}
$friends = mysqli_query($connection, "SELECT * FROM ofRoster WHERE username='".$root."' ") or die('Couldn\'t select. Report Bug.');

// Set the active MySQL database
$db_selected = mysqli_select_db($connection, $database) or die ('Can\'t use db : ' . mysql_error());

$query = "SELECT * FROM markers WHERE id = '".$id."' ";
$result = mysqli_query($connection, $query) or die('Couldn\'t select. Report bug');
$row = mysqli_fetch_array($result);

if($row['gender'] == 1){ $g = 'Male';}
else { $g = 'Female';}

?>
<link rel="stylesheet" type="text/css" href="/css/profile.css">
<div class="container-profile">
  <div class="jumbotron profile-head">
    <div class="back-cover"></div>
    <div class="front-cover">
      <div class="profile-pic" style="background-image:url(<?php echo $row['pictureLocation'];?>);"></div>
      <div class="credits">
        <div class="name">
          <?php echo $row['name']; ?>
        </div>
        <div class="username">
          <?php echo $row['username']; ?>
        </div>
      </div>
    </div>
  </div>
  <div class="jumbotron profile-body">
    <h4>Your Basic Information</h4>
    <div class="form-horizontal">
      <div class="form-group">
        <div class="col-xs-2 control-label"><label>Email</label></div>
        <div class="col-xs-9" id="email-hold">
          <div class="form-control-static text-primary">
            <?php echo $row['email'] ?>
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="col-xs-2 control-label"><label>About</label></div>
        <div class="col-xs-9" id="about-hold">
          <div class="form-control-static text-primary">
            <?php echo $row['about'] ?>
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="col-xs-2 control-label"><label>Home City</label></div>
        <div class="col-xs-9" id="city-hold">
          <div class="form-control-static text-primary">
            <?php echo $row['address'] ?>
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="col-xs-2 control-label"><label>Gender</label></div>
        <div class="col-xs-9" id="gender-hold">
          <div class="form-control-static text-primary">
            <?php echo $g ?>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="jumbotron profile-foot">
    <h4>Your Friends</h4>
    <div class="form-horizontal">
      <div class="form-group">
      <?php
      while($row = mysqli_fetch_array($friends)){
        $row1 = explode('@', $row['jid']);
        $query = "SELECT * FROM markers WHERE id='".$row1[0]."'";
        $result = mysqli_query($connection, $query) or die('Report Bug.');
        $res = mysqli_fetch_array($result);
        echo "<div class='col-sm-6'>
          
        </div>";
      }
      ?>
      </div>
    </div>
  </div>
</div>