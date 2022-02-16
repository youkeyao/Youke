<?php
//判断文件或目录

//完整路径
$path = '../icloud' . $_POST["path"];

if (is_dir($path)) {
    echo 'dir';
}
else {
    echo 'file';
}

?>