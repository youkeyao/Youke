<?php
//上传文件

//完整目录
$path = '../icloud' . $_POST["path"];

$flag = 2;

for ($i = 0; $i < count($_FILES["file"]["name"]); $i ++) {
    if ($_FILES["file"]["error"][$i] > 0) {
        $flag = 2;
        break;
    }
    else{    
        if (file_exists($path . $_FILES["file"]["name"][$i])) {
            if ($_FILES["file"]["name"][$i]) {
                $flag = 1;
                break;
            }
        }
        else {
            if (move_uploaded_file($_FILES["file"]["tmp_name"][$i], $path . $_FILES["file"]["name"][$i])) {
                $flag = 0;
            }
            else {
                $flag = 2;
                break;
            }
        }
    }
}

if ($flag == 0) {
    echo 'Upload Successfully';
}
else if ($flag == 1) {
    echo 'Exist File';
}
else {
    echo 'Error';
}

?>