<?php

echo "<users>";
if(!(isset($_FILES["image"]["name"])) || $_FILES["image"]["name"] == '') {
    die("<error content='No data' /> </users>");
}

session_start();
if(isset($_SESSION['userid']) ){
    $USER = $_SESSION['userid'];
}else die('<error content="User Invalid" /></users> ');

$check = getimagesize($_FILES["image"]["tmp_name"]);
if($check == false) {
    echo "<error content='File is not an image.'/> </users>";
    die();
}
$imagecount = 1;

$path = dirname(dirname( __FILE__ ));
$slash = '/';
define( 'BASE_DIR', $path . $slash . 'user' . $slash );

$target_dir = BASE_DIR . $_SESSION['username'] . $USER . $slash;
if(!(file_exists(BASE_DIR))){
	mkdir(BASE_DIR, '0755');
}
if(!(file_exists($target_dir))){
	mkdir($target_dir, '0755');
}

$target_file = $target_dir . basename($_FILES["image"]["name"]);
$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);

if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "JPG" && $imageFileType != "PNG" && $imageFileType != "JPEG" ) {
    echo "<error content='Sorry, only JPG, JPEG & PNG files are allowed.'/></users>";
    die();
}
$fileuniquename = "0001";
$target_file = $target_dir . $USER . $fileuniquename . ".png";

$image = imagecreatefromstring(file_get_contents($_FILES['image']['tmp_name']));
$exif = exif_read_data($_FILES['image']['tmp_name']);
if(!empty($exif['Orientation'])) {
    switch($exif['Orientation']) {
        case 8:
            $image = imagerotate($image,90,0);
            break;
        case 3:
            $image = imagerotate($image,180,0);
            break;
        case 6:
            $image = imagerotate($image,-90,0);
            break;
    }
}
imagejpeg($image, $_FILES['image']['tmp_name'], 90);

if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
	echo "<user image='".$slash."user".$slash.$_SESSION['username'].$USER.$slash.$USER.$fileuniquename.".png' width='".getimagesize($target_file)[0]."' height='".getimagesize($target_file)[1]."' type='".$imageFileType."' />";
	echo "</users>";
}else
	echo "<error content='Can't upload file'/></users> ";

?>