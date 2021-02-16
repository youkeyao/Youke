var choose;//已选文件名称
var bt_upload;//上传按钮
var bt_download;//下载按钮
var bt_remove;//删除按钮
var bt_new;//新建目录按钮
var filelist;//文件显示框架
var path;//路径元素

window.onload = function(){
    choose = null;
    //获取各元素
    bt_upload = document.getElementById('upload');
    bt_download = document.getElementById('download');
    bt_remove = document.getElementById('remove');
    bt_new = document.getElementById('new');
    filelist = document.getElementById('filelist');
    path = document.getElementById('path');
    refresh();
}
document.onmousedown = function(e){
    //点击空白处清除选择
    var dom = document.elementFromPoint(e.clientX, e.clientY);
    if(dom.type != "submit"){
        cleanChoose();
    }
}

//点击上传按钮等同于点击input
function bt_input(){
    document.getElementById('input').click();
}
//文件上传
function upload(files){
    //文件数据
    var file = files[0];
    var obj = new XMLHttpRequest();
    //回调函数
    obj.onreadystatechange = function(){ 
        if (obj.status == 200 && obj.readyState == 4){
            var result = obj.responseText;
            console.log(obj);
            alert(result);
            document.getElementById('input').value = '';
            //隐藏进度条
            document.getElementById('progressBar').style.display = 'none';
            document.getElementById('barText').innerHTML = "";
            //上传成功刷新文件列表
            if(result == "Upload Successfully"){
                refresh();
            }
            else{
                return;
            }
        }
    }
    //加载进度条
    obj.upload.onprogress = function(evt){
        var per = Math.floor((evt.loaded / evt.total) * 100) + "%";
        document.getElementById('progressBar').style.display = 'inline-block';
        document.getElementById('barContent').style.width = per;
        document.getElementById('barText').innerHTML = per;
    }
    //等待回应
    obj.upload.onload = function(evt){
        document.getElementById('progressBar').style.display = 'none';
        document.getElementById('barText').innerHTML = "";
    }
    var fd = new FormData();
    fd.append('file', file);
    fd.append('path', path.innerHTML);
    obj.open("post", "../php/upload.php"); 
    obj.send(fd);
}

//清楚parent子节点
function cleanChild(parent){
    if(!parent)return;
    var child = parent.childNodes;
    for (var i = child.length - 1; i >= 0; i--){
        parent.removeChild(child[i]);
    }
}

//刷新文件列表
function refresh(){
    bt_upload.style.display = 'inline-block';
    bt_new.style.display = 'inline-block';
    bt_download.style.display = 'none';
    bt_remove.style.display = 'none';
    cleanChild(filelist);
    choose = null;
    //获取文件列表
    var obj = new XMLHttpRequest();
    var fd = new FormData();
    fd.append('path', path.innerHTML);
    obj.open("post", "../php/refresh.php");
    obj.send(fd);
    obj.onreadystatechange = function(){ 
        if (obj.status == 200 && obj.readyState == 4){
            var result = JSON.parse(obj.responseText);
            //在页面中加入各个文件
            for(var key in result){
                var bt = document.createElement('button');
                filelist.appendChild(bt);
                bt.innerHTML = key;
                //双击事件
                bt.ondblclick = function(val){return function(){openFile(val);}}(key);
                //点击选择事件
                bt.onclick = function(val){return function(){
                    //先清除选择再重新选择
                    var child = Array.prototype.slice.call(filelist.childNodes,0);
                    var i = child.indexOf(val);
                    cleanChoose();
                    val = filelist.childNodes[i];
                    choose = val.innerHTML;
                    val.style.backgroundColor = 'rgb(160, 180, 160)';
                    //选择后按钮变为删除和下载按钮
                    bt_download.style.display = 'inline-block';
                    bt_remove.style.display = 'inline-block';
                    bt_upload.style.display = 'none';
                    bt_new.style.display = 'none';
                }}(bt);
                //对于不同拓展名选择不同背景图片
                switch(result[key]){
                    case 'folder': bt.style.backgroundImage = "url(../resources/folder.png)";break;
                    case 'mp3': 
                    case 'wma': bt.style.backgroundImage = "url(../resources/audio.png)";break;
                    case 'rar':
                    case 'zip': bt.style.backgroundImage = "url(../resources/compress.png)";break;
                    case 'bmp':
                    case 'jpg':
                    case 'png': bt.style.backgroundImage = "url(../resources/img.png)";break;
                    case 'avi':
                    case 'mov':
                    case 'wmv':
                    case 'flv':
                    case 'mpeg':
                    case 'mp4': bt.style.backgroundImage = "url(../resources/video.png)";break;
                    case 'doc':
                    case 'docx': bt.style.backgroundImage = "url(../resources/doc.png)";break;
                    case 'ppt':
                    case 'pptx': bt.style.backgroundImage = "url(../resources/ppt.png)";break;
                    case 'xls':
                    case 'xlsx': bt.style.backgroundImage = "url(../resources/xlsx.png)";break;
                    default: bt.style.backgroundImage = "url(../resources/default.png)";break;
                }
            }
        } 
    }
}

//打开文件，若为目录进入下级，若为图片或视频在新窗口打开，其它则下载
function openFile(name){
    var obj = new XMLHttpRequest();
    var fd = new FormData();
    var wholePath = path.innerHTML + name;
    fd.append('path', wholePath);
    obj.open("post", "../php/FileOrFolder.php");
    obj.send(fd);
    obj.onreadystatechange = function(){
        if (obj.status == 200 && obj.readyState == 4) {
            var result = obj.responseText;
            if(result == 'file'){
                window.open('../icloud' + wholePath);
            }
            else{
                path.innerHTML = wholePath + '/';
                refresh();
            }
        }
    }
}

//上级目录
function upfolder(){
    if(path.innerHTML == '/')return;
    path.innerHTML = path.innerHTML.substr(0, path.innerHTML.length-1);
    path.innerHTML = path.innerHTML.substring(0, path.innerHTML.lastIndexOf('/')+1);
    refresh();
}

//清除选择
function cleanChoose(){
    choose = null;
    var child = filelist.childNodes;
    //将之前选择的文件按钮删除后重新加入
    for (var i = child.length - 1; i >= 0; i--){
        if(child[i].style.backgroundColor == 'rgb(160, 180, 160)'){
            var name = child[i].innerHTML;
            var imgurl = child[i].style['background-image'];
            filelist.removeChild(child[i]);
            //重新加入
            var bt = document.createElement('button');
            bt.innerHTML = name;
            bt.style.backgroundImage = imgurl;
            bt.ondblclick = function(val){return function(){openFile(val);}}(name);
            bt.onclick = function(val){return function(){
                var child = Array.prototype.slice.call(filelist.childNodes,0);
                var i = child.indexOf(val);
                cleanChoose();
                val = filelist.childNodes[i];
                choose = val.innerHTML;
                val.style.backgroundColor = 'rgb(160, 180, 160)';
                bt_upload.style.display = 'none';
                bt_new.style.display = 'none';
                bt_download.style.display = 'inline-block';
                bt_remove.style.display = 'inline-block';
            }}(bt);
            if(i == child.length){
                filelist.appendChild(bt);
            }
            else{
                filelist.insertBefore(bt, child[i]);
            }
        }
    }
    //清楚选择后按钮变为上传按钮和新建目录按钮
    bt_upload.style.display = 'inline-block';
    bt_new.style.display = 'inline-block';
    bt_download.style.display = 'none';
    bt_remove.style.display = 'none';
}

//下载文件，不能下载文件夹
function download(){
    var obj = new XMLHttpRequest();
    var fd = new FormData();
    var wholePath = path.innerHTML + choose;
    fd.append('path', wholePath);
    obj.open("post", "../php/FileOrFolder.php");
    obj.send(fd);
    obj.onreadystatechange = function(){
        if (obj.status == 200 && obj.readyState == 4){
            var result = obj.responseText;
            if(result == 'file'){
                //利用a标签下载
                var a = document.createElement("a");
                a.download = choose;
                a.href = '../icloud' + wholePath;
                filelist.append(a);
                a.click();
                filelist.removeChild(a);
            }
            else{
                alert('You cannot download folder');
            }
        }
    }
}

//删除文件或目录
function remove(){
    var obj = new XMLHttpRequest();
    var fd = new FormData();
    var wholePath = path.innerHTML + choose;
    fd.append('path', wholePath);
    obj.open("post", "../php/remove.php");
    obj.send(fd);
    obj.onreadystatechange = function(){
        if (obj.status == 200 && obj.readyState == 4){
            alert(obj.responseText);
            if(obj.responseText == "Remove Successfully"){
                refresh();
            }
            else{
                return;
            }
        }
    }
}

//新建目录
function newFolder(){
    //目录名称
    var name = prompt('');
    if(!name){
        return;
    }
    var obj = new XMLHttpRequest();
    var fd = new FormData();
    var wholePath = path.innerHTML + name;
    fd.append('path', wholePath);
    obj.open("post", "../php/newFolder.php");
    obj.send(fd);
    obj.onreadystatechange = function(){
        if (obj.status == 200 && obj.readyState == 4){
            alert(obj.responseText);
            if(obj.responseText == "Make Folder Successfully"){
                refresh();
            }
            else{
                return;
            }
        }
    }
}