<?php

if (isset($_FILES['myfile'])) 
{

    $sFileName  = $_FILES['myfile']['name'];
    $sFileType  = $_FILES['myfile']['type'];
    $sTmpName   = $_FILES['myfile']['tmp_name'];
    $uploadFile = $_POST['uploadDir'] . "/" . $sFileName;

    if (file_exists($uploadFile))
    {
    	$return_array = array("status" => "error", "file_name" => $sFileName, "message" => "File already exists!");
		echo json_encode($return_array);
		exit;
    }

    if (!move_uploaded_file($_FILES["myfile"]["tmp_name"], $uploadFile)) {
        $return_array = array("status" => "error", "file_name" => $sFileName, "message" => "Error uploading file!");
		echo json_encode($return_array);
		exit;
    }
    else {
        $return_array = array("status"=>"success", "file_name" => $sFileName );
		echo json_encode($return_array);
		exit;
    }

}

else {
	$return_array = array("status"=>"error", "message" => "No File!" );
	echo json_encode($return_array);
	exit;
}
?>