<?php

$distance = 20;

if(isset($_REQUEST['query']) and !(empty($_REQUEST['query'])))
  $searchQuery = explode('-', $_REQUEST['query']);
else{
  $searchQuery = array();
  $query = "SELECT * FROM `socialtags`";
  $result = mysqli_query($connection, $query)
  or die("<div class='page-header'><h3> Something went worng. Please reload the page. </h3></div>");
  while($row = mysqli_fetch_array($result)){
    array_push($searchQuery, $row['tagName']);
  }
}

function destination($lat, $lon, $bearing, $distance){
  $radius = 6378.137;
  $rlat = deg2rad($lat);
  $rlon = deg2rad($lon);
  $rbearing = deg2rad($bearing);
  $rAngDist = $distance / $radius;

  $rlatB = asin(sin($rlat) * cos($rAngDist) + cos($rlat) * sin($rAngDist) *cos($rbearing));

  $rlonB = $rlon + atan2(sin($rbearing)*sin($rAngDist)*cos($rlat) ,cos($rAngDist) - sin($rlat)*sin($rlatB) );

  return array("lat" => rad2deg($rlatB), "lon" => rad2deg($rlonB));
}

function bound($lat, $lon, $distance){
  return array("N"=>destination($lat, $lon, 0, $distance),"E"=>destination($lat, $lon, 90, $distance),"S"=>destination($lat, $lon, 180, $distance),"W"=>destination($lat, $lon, 270, $distance));
}

function distance($latA, $lonA, $latB, $lonB){
  $radius = 6378.137;
  $rlatA = deg2rad($latA);
  $rlatB = deg2rad($latB);
  $rHalfDeltaLat = deg2rad(($latB - $latA) / 2);
  $rHalfDeltaLon = deg2rad(($lonB - $lonA) / 2);

  return 2 * $radius * asin(sqrt(pow(sin($rHalfDeltaLat), 2) + cos($rlatA) * cos($rlatB) * pow(sin($rHalfDeltaLon), 2)));
}

function parseToXML($htmlStr)
{
$xmlStr=str_replace('<','&lt;',$htmlStr);
$xmlStr=str_replace('>','&gt;',$xmlStr);
$xmlStr=str_replace('"','&quot;',$xmlStr);
$xmlStr=str_replace("'",'&#39;',$xmlStr);
$xmlStr=str_replace("&",'&amp;',$xmlStr);
return $xmlStr;
}

$b = bound($latitude, $longitude, $distance);

// Select all the rows in the markers table
$query = "SELECT * FROM `markers` WHERE `lat` BETWEEN '".$b["S"]["lat"]."' AND '".$b["N"]["lat"]."' AND lng BETWEEN '".$b["W"]["lon"]."' AND '".$b["E"]["lon"]."'";
$result = mysqli_query($connection,$query) or die('<error content="Fail"></error>');
if (!$result) {
  die('<error content="Invalid query: ' . mysql_error() . '"></error>');
}
// Start XML file, echo parent node
echo '<markers>';
// Iterate through the rows, printing XML nodes for each
while ($row = mysqli_fetch_assoc($result)){
  $flag = 0;
  $user_intrest = explode('-', $row['intrest']);
  foreach ($user_intrest as $value) {
    if(in_array($value, $searchQuery)){
      $flag = 1;
      break;
    }
  }
  if($flag == 0) continue;
  // ADD TO XML DOCUMENT NODE
  $dist = distance($latitude, $longitude, $row['lat'], $row['lng']);
  if($dist <= $distance){
    echo '<marker ';
    echo 'name="' . parseToXML($row['username']) . '" ';
    echo 'address="' . parseToXML($row['address']) . '" ';
    echo 'lat="' . $row['lat'] . '" ';
    echo 'lng="' . $row['lng'] . '" ';
    if($row['gender'] == 1){
      echo 'gender="male" ';  
    }else{
      echo 'gender="female" ';
    }
    echo 'about="' .$row['about']. '" ';
    echo 'userid="' .$row['id']. '" ';
    echo 'intrest="' .$row['intrest']. '" ';
    echo '></marker>';
  }
}
$res = $_SESSION["resval"];
$res++;
$_SESSION["resval"] = $res;
echo '<user id="'.$_SESSION['userid'].'" password="'.$_SESSION['xmpppass'].'" myname="'.$_SESSION['username'].'" resource="'.$res.'" name="'.$_SESSION["name"].'" mobile="'.$_SESSION['number'].'" mail="'.$_SESSION['mail'].'" />';
// End XML file
echo '</markers>';

?>