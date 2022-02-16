<?php
//删除文件或目录

//完整路径
$path = '../icloud' . $_POST["path"];

if (is_dir($path)) {
    if (removeDir($path)) {
        echo 'Remove Successfully';
    }
    else {
        echo 'Error';
    }
}
else{
    if (unlink($path)) {
        echo 'Remove Successfully';
    }
    else {
        echo 'Error';
    }
}

//删除目录
function removeDir($root) {
    $result = true;
    $filelist = scandir($root);
    //删除目录下所有文件
    foreach ($filelist as $file) {
        if ($file == '.' || $file == '..') continue;
        $next = $root . '/' . $file;
        if (!is_dir($next)) {
            $result = $result && unlink($next);
        }
        else {
            //递归删除
            $result = $result && removeDir($next);
        }
    }
    //删除根目录
    return $result && rmdir($root);
}

?>