<?php
//上传文件

//完整目录
$path = '../icloud' . $_POST["path"];

if ($_FILES["file"]["error"] > 0){
    echo 'Error';
}
else{    
    if (file_exists($path . $_FILES["file"]["name"])){
        if($_FILES["file"]["name"]){
            echo 'Exist File';
        }
    }
    else{
        if(move_uploaded_file($_FILES["file"]["tmp_name"], $path . $_FILES["file"]["name"])){
            echo 'Upload Successfully';
        }
        else{
            echo 'Error';
        }
    }
}

?>