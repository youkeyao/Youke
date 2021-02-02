<?php
//获取文件列表

//完整目录
$path = '../icloud' . $_POST["path"];

$file = array();
$dir = array();
if(!is_dir($path)){
    echo json_encode($file);
}
else{
    $data = scandir($path);
    foreach($data as $key){
        if($key == '.' || $key == "..")continue;
        //区分文件与目录
        if(is_dir($path . $key)){
            $dir[$key] = 'folder';
        }
        else{
            $file[$key] = pathinfo($key, PATHINFO_EXTENSION);
        }
    }
    asort($file);//按拓展名分类
    echo json_encode($dir + $file);//目录先显示
}

?>