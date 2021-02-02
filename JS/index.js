var tomove;//一张图片宽度
var imglist;//图片列表
var num = 3;//图片数量
var speed = 10;//切换速度
var current;//当前图片序号
var i;//切换时计数
var stop;//图片移动
var auto;//自动切换
var interval = 6000;//自动切换间隔

window.onload = function(){
    imglist = document.getElementById('imglist');
    tomove = document.defaultView.getComputedStyle(imglist.childNodes[1]).width.slice(0, -2);
    imglist.style.left = '0px';
    current = 0;
    stop = null;
    start();
}

//向右，如果正在移动则不响应
function moveRight(){
    if(stop){
        return;
    }
    //循环
    if(current == num){
        imglist.style.left = '0px';
        current = 0;
    }
    i = 0;
    stop = setInterval(function(){
        i += speed;
        if(i >= tomove){
            i = -current * tomove - tomove;
            imglist.style.left = i + 'px';
            current += 1;
            clearInterval(stop);
            stop = null;
            return;
        }
        imglist.style.left = -current * tomove - i + 'px';
    }, '10');
}
//向左，如果正在移动则不响应
function moveLeft(){
    if(stop){
        return;
    }
    //循环
    if(current == 0){
        imglist.style.left = -tomove*num + 'px';
        current = num;
    }
    i = 0;
    stop = setInterval(function(){
        i += speed;
        if(i >= tomove){
            i = tomove - current*tomove;
            imglist.style.left = i + 'px';
            current -= 1;
            clearInterval(stop);
            stop = null;
            return;
        }
        imglist.style.left = -current * tomove + i + 'px';
    }, '10');
}

//停止自动切换
function pause(){
    clearInterval(auto);
}
//开始自动切换
function start(){
    auto = setInterval('moveRight()', interval);
}