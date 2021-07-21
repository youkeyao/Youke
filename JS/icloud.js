let choose;//已选文件元素
let bt_upload;//上传按钮
let bt_download;//下载按钮
let bt_remove;//删除按钮
let bt_new;//新建目录按钮
let filelist;//文件显示框架
let path;//路径元素

window.onload = () => {
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
document.onmousedown = (e) => {
    //点击空白处清除选择
    let dom = document.elementFromPoint(e.clientX, e.clientY);
    if (dom.type != "submit") {
        cleanChoose();
    }
}

//点击上传按钮等同于点击input
function bt_input() {
    document.getElementById('input').click();
}
//文件上传
function upload(files) {
    //文件数据
    let obj = new XMLHttpRequest();
    //回调函数
    obj.onreadystatechange = () => { 
        if (obj.status == 200 && obj.readyState == 4) {
            let result = obj.responseText;
            console.log(obj);
            alert(result);
            document.getElementById('input').value = '';
            //隐藏进度条
            document.getElementById('progressBar').style.display = 'none';
            document.getElementById('barText').innerHTML = "";
            //上传后刷新文件列表
            refresh();
        }
    }
    //加载进度条
    obj.upload.onprogress = (evt) => {
        let per = Math.floor((evt.loaded / evt.total) * 100) + "%";
        document.getElementById('progressBar').style.display = 'inline-block';
        document.getElementById('barContent').style.width = per;
        document.getElementById('barText').innerHTML = per;
    }
    //等待回应
    obj.upload.onload = () => {
        document.getElementById('progressBar').style.display = 'none';
        document.getElementById('barText').innerHTML = "";
    }
    let fd = new FormData();
    for (let i = 0; i < files.length; i ++) {
        fd.append('file[]', files[i]);
    }
    fd.append('path', path.innerHTML);
    obj.open("post", "../php/upload.php"); 
    obj.send(fd);
}

//清除parent子节点
function cleanChild(parent) {
    if (!parent) return;
    let childs = parent.childNodes;
    for (let i = childs.length - 1; i >= 0; i --) {
        parent.removeChild(childs[i]);
    }
}

//刷新文件列表
function refresh() {
    bt_upload.style.display = 'inline-block';
    bt_new.style.display = 'inline-block';
    bt_download.style.display = 'none';
    bt_remove.style.display = 'none';
    cleanChild(filelist);
    choose = null;
    //获取文件列表
    let obj = new XMLHttpRequest();
    let fd = new FormData();
    fd.append('path', path.innerHTML);
    obj.open("post", "../php/refresh.php");
    obj.send(fd);
    obj.onreadystatechange = () => { 
        if (obj.status == 200 && obj.readyState == 4) {
            let result = JSON.parse(obj.responseText);
            //在页面中加入各个文件
            for (let key in result) {
                let bt = document.createElement('button');
                filelist.appendChild(bt);
                bt.innerHTML = key;
                //双击事件
                bt.ondblclick = () => {openFile(key);};
                //点击选择事件
                bt.onclick = () => {
                    //先清除选择再重新选择
                    cleanChoose();
                    choose = bt;
                    bt.classList.toggle("chosen");
                    //选择后按钮变为删除和下载按钮
                    bt_download.style.display = 'inline-block';
                    bt_remove.style.display = 'inline-block';
                    bt_upload.style.display = 'none';
                    bt_new.style.display = 'none';
                };
                //对于不同拓展名选择不同背景图片
                switch (result[key].toLowerCase()) {
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
                    case 'pdf': bt.style.backgroundImage = "url(../resources/pdf.png)";break;
                    default: bt.style.backgroundImage = "url(../resources/default.png)";break;
                }
            }
        } 
    }
}

//打开文件，若为目录进入下级，若为图片或视频在新窗口打开，其它则下载
function openFile(name) {
    let obj = new XMLHttpRequest();
    let fd = new FormData();
    let wholePath = path.innerHTML + name;
    fd.append('path', wholePath);
    obj.open("post", "../php/FileOrFolder.php");
    obj.send(fd);
    obj.onreadystatechange = () => {
        if (obj.status == 200 && obj.readyState == 4) {
            let result = obj.responseText;
            if (result == 'file') {
                window.open('../icloud' + wholePath);
            }
            else {
                path.innerHTML = wholePath + '/';
                refresh();
            }
        }
    }
}

//上级目录
function upfolder() {
    if (path.innerHTML == '/') return;
    path.innerHTML = path.innerHTML.substr(0, path.innerHTML.length - 1);
    path.innerHTML = path.innerHTML.substring(0, path.innerHTML.lastIndexOf('/') + 1);
    refresh();
}

//清除选择
function cleanChoose() {
    if (choose) choose.classList.toggle("chosen");
    choose = null;
    //清楚选择后按钮变为上传按钮和新建目录按钮
    bt_upload.style.display = 'inline-block';
    bt_new.style.display = 'inline-block';
    bt_download.style.display = 'none';
    bt_remove.style.display = 'none';
}

//下载文件，不能下载文件夹
function download(){
    let obj = new XMLHttpRequest();
    let fd = new FormData();
    let wholePath = path.innerHTML + choose.innerHTML;
    fd.append('path', wholePath);
    obj.open("post", "../php/FileOrFolder.php");
    obj.send(fd);
    obj.onreadystatechange = () => {
        if (obj.status == 200 && obj.readyState == 4) {
            let result = obj.responseText;
            if (result == 'file') {
                //利用a标签下载
                let a = document.createElement("a");
                a.download = choose.innerHTML;
                a.href = '../icloud' + wholePath;
                filelist.append(a);
                a.click();
                filelist.removeChild(a);
            }
            else {
                alert('You cannot download folder');
            }
        }
    }
}

//删除文件或目录
function remove() {
    let obj = new XMLHttpRequest();
    let fd = new FormData();
    let wholePath = path.innerHTML + choose.innerHTML;
    fd.append('path', wholePath);
    obj.open("post", "../php/remove.php");
    obj.send(fd);
    obj.onreadystatechange = () => {
        if (obj.status == 200 && obj.readyState == 4) {
            alert(obj.responseText);
            if (obj.responseText == "Remove Successfully") {
                refresh();
            }
            else {
                return;
            }
        }
    }
}

//新建目录
function newFolder() {
    //目录名称
    let name = prompt('');
    if (!name) {
        return;
    }
    let obj = new XMLHttpRequest();
    let fd = new FormData();
    let wholePath = path.innerHTML + name;
    fd.append('path', wholePath);
    obj.open("post", "../php/newFolder.php");
    obj.send(fd);
    obj.onreadystatechange = () => {
        if (obj.status == 200 && obj.readyState == 4) {
            alert(obj.responseText);
            if (obj.responseText == "Make Folder Successfully") {
                refresh();
            }
            else {
                return;
            }
        }
    }
}