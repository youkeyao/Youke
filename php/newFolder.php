<?php
//新建目录

//完整路径
$path = '../icloud' . $_POST["path"];

if(pathinfo($path, PATHINFO_EXTENSION) || file_exists($path)){//已存在或不是目录
    echo 'Error';
}
else{
    $result = mkdir($path, 0777);
    $result = $result && chmod($path, 0777);//读写权限
    if($result){
        echo 'Make Folder Successfully';
    }
    else{
        echo 'Error';
    }
}

?>