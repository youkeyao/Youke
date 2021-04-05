var tomove;//一张图片宽度
var imglist;//图片列表
var num = 0;//图片数量
var switchTime = 0.5;//切换时间
var current = 1;//当前图片序号
var stop = null;//图片移动
var auto;//自动切换
var interval = 6000;//自动切换间隔

window.onload = function(){
    imglist = document.getElementById('imglist');
    tomove = getComputedStyle(document.querySelector('.imgshow')).width.slice(0, -2);
    num = (imglist.childNodes.length - 1) / 2;
    imglist.style.left = - tomove + 'px';
    imglist.style.width = (num + 2) * 100 + '%';
    //首尾连接
    var head = imglist.childNodes[1].cloneNode(true);
    var rear = imglist.childNodes[2 * num - 1].cloneNode(true);
    imglist.insertBefore(rear, imglist.childNodes[0]);
    imglist.appendChild(head);
    //调整宽度
    for(var i=0; i<imglist.childNodes.length; i++){
        if(imglist.childNodes[i].style){
            imglist.childNodes[i].style.width = 100 / (num + 2) + '%';
        }
    }
    start();
}

//向右
function moveRight(){
    if(stop){
        return;
    }
    //循环
    if(current == num + 1){
        var current_left = parseFloat(getComputedStyle(imglist).left);
        imglist.style.left = num * tomove + current_left + 'px';
        imglist.style.transition = 'left 0s';
        current = 1;
    }
    current ++;
    tomove = getComputedStyle(document.querySelector('.imgshow')).width.slice(0, -2);
    imglist.style.left = - current * tomove + 'px';
    imglist.style.transition = 'left ' + switchTime + 's';
}
//向左
function moveLeft(){
    if(stop){
        return;
    }
    //循环
    if(current == 0){
        var current_left = parseFloat(getComputedStyle(imglist).left);
        imglist.style.left = - num * tomove + current_left + 'px';
        current = num;
        imglist.style.transition = 'left 0s';
    }
    current --;
    tomove = getComputedStyle(document.querySelector('.imgshow')).width.slice(0, -2);
    imglist.style.left = - current * tomove + 'px';
    imglist.style.transition = 'left ' + switchTime + 's';
}

//停止自动切换
function pause(){
    clearInterval(auto);
}
//开始自动切换
function start(){
    auto = setInterval('moveRight()', interval);
}