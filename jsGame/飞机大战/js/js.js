/**
 * 飞机大战js
 * @authors 水泡泡 (xiuyer@qq.com)
 * @date    2017-12-28 16:46:28
 * @version v1.0
 */

//兼容IE
window.requestAnimationFrame = window.requestAnimationFrame || function(m){
    return setTimeout(m, 13);
};
window.cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout;

//全局变量
var oWrap = document.getElementById('wrap'),
    oMap  = document.getElementById('map'),
    oFireBox = document.getElementById('fireBox'),
    aFire = oFireBox.children,
    oLevel = document.getElementById('level'),
    oSore = document.getElementById('score'),
    oGameover = document.getElementById('gameover'),
    countsWin = 0,
    wrapOffT = oWrap.offsetTop,
    wrapOffL = oWrap.offsetLeft,
    score = 0;

exe();
//启动游戏
function exe(){
    var aP = oLevel.getElementsByTagName('p'),
        oOverbtn = oGameover.getElementsByTagName('input')[0];
    for (var i = 0; i < aP.length; i++) {
        (function(i){
            aP[i].onclick = function(ev){
                ev = ev || window.event;
                startGame(i,{
                    x:ev.clientX - oWrap.offsetLeft,
                    y:ev.clientY - oWrap.offsetTop
                });
            }
        })(i)
    }
    oOverbtn.onclick = function (){
        oLevel.className = '';
        oGameover.className = 'hide';
        oMap.innerHTML = '<div id="fireBox"></div>';
        oFireBox = document.getElementById('fireBox');
        aFire = oFireBox.children;
        score = 0;
        oSore.innerHTML = 0;
    }
}

window.onresize = function(){
    wrapOffT = oWrap.offsetTop;
    wrapOffL = oWrap.offsetLeft;
}

/**
 * @method startGame 开始新的游戏
 * @param  {number} level 难度等级 0,1,2,3四个级别
 * @param  {json} pos   游戏开始时鼠标的位置,在此位置创建飞机
 */
function startGame(level,pos){
    oLevel.className = 'hide';
    oSore.className = '';
    oMap.style.background = 'url(images/bg_'+(level+1)+'.jpg)';
    var p = plane(level,pos);
    enemy(level,p);
    moveBg(p);
}


/**
 * @method plane 生成我军
 * @param  {number} level 难度等级 0,1,2,3四个级别
 * @param  {json} pos   游戏开始时鼠标的位置,在此位置创建飞机
 * @return {object} 我军飞机对象
 */
function plane(level,pos){
    var oImg = new Image();
    oImg.width = 70;
    oImg.height = 70;
    oImg.src = 'images/plane_0.png';
    oImg.className = 'plane';
    var left = pos.x - oImg.width/2,
        top = pos.y -oImg.height/2;
    oImg.style.left = left + 'px';
    oImg.style.top = top + 'px';
    oMap.appendChild(oImg);

    //给document加鼠标移动事件,使我军飞机跟随鼠标移动
    document.onmousemove = function(ev){
        ev = ev||window.event;
        left = ev.clientX - wrapOffL - oImg.width/2;
        top = ev.clientY - wrapOffT -oImg.height/2;
        left = Math.min(left,oMap.clientWidth-oImg.width/2);
        left = Math.max(-oImg.width/2,left);
        top = Math.min(top,oMap.clientHeight-oImg.height/2);
        top = Math.max(0,top);
        oImg.style.left = left + 'px';
        oImg.style.top = top + 'px';
    }
    fire(level,oImg);
    return oImg;
}

/**
 * @method fire 生成我军子弹
 * @param  {number} level 难度等级
 * @param  {object} obj   我军飞机对象
 * @param {number} x 子弹的水平坐标,默认在飞机正前方,发射两颗子弹的时候需要另外给位置
 * @param {number} y 子弹的水平坐标,默认在飞机正前方,发射两颗子弹的时候需要另外给位置
 * @param {boolean} flag 是否发射双弹
 */
function fire(level,obj,x,y,flag){
    var oFire = new Image();
    oFire.width = 30;
    oFire.height = 30;
    oFire.src = 'images/fire.png';
    oFire.className = 'fire';
    x = x || obj.offsetLeft + obj.width/2 - oFire.width/2;
    y = y || obj.offsetTop - oFire.height + 8;
    oFire.style.left = x + 'px';
    oFire.style.top = y + 'px';
    oFireBox.appendChild(oFire);

    var speed = [4,6,8,12][level];
    function move(){
        if(oFire.parentNode){
            var top = oFire.offsetTop;
            top -= speed;
            oFire.style.top = top + 'px';
            if(top <= -oFire.height){
                oFireBox.removeChild(oFire);
            }else{
                requestAnimationFrame(move);
            }
        }
    }
    setTimeout(move,30);
    var t = [350,250,150,50][level];
    if(obj.parentNode && !flag){
        if(score%100 > 20 || score <25)
            setTimeout(fire,t,level,obj);
        else{
            var y_ = obj.offsetTop - oFire.height + 18;
            setTimeout(fire,t,level,obj,obj.offsetLeft,y_);
            setTimeout(fire,t,level,obj,obj.offsetLeft + obj.width - oFire.width,y_,true);
        }
    }

}

/**
 * @method enemy 生成敌军
 * @param  {number} level 难度等级
 * @param  {object} obj   我军飞机对象
 */
function enemy(level,obj){
    countsWin++;
    var oEnemy = new Image(),
        index = countsWin%50?0:1;
    oEnemy.width = [54,130][index];
    oEnemy.height = [40,100][index];
    oEnemy.src = 'images/'+['enemy_small','enemy_big'][index]+'.png';
    oEnemy.className = 'enemy';
    oEnemy.style.top = -oEnemy.height + 'px';
    oEnemy.style.left = oMap.clientWidth*Math.random() - oEnemy.width/2 +'px';
    oMap.appendChild(oEnemy);

    var speed = [3,4,6,8][level] +(Math.random()*3|0)-1;
    if(index){
        speed--;
        oEnemy.hp = [5,10,10,20][level];
    }
    function move(){
        var top = oEnemy.offsetTop;
        top += speed;
        oEnemy.style.top = top + 'px';
        for (var i = 0 , length = aFire.length; i < length; i++) {
            if(impact(aFire[i],oEnemy)){
                oFireBox.removeChild(aFire[i]);
                if(oEnemy.hp && oEnemy.hp>0){
                    oEnemy.hp--;
                    requestAnimationFrame(move);
                    return;
                }
                boom({x:oEnemy.offsetLeft,y:oEnemy.offsetTop},oEnemy.width,oEnemy.height,index?2:0);
                if(oEnemy.hp)
                    score += 50;
                else
                    score += 5;
                oMap.removeChild(oEnemy);
                oSore.innerHTML = score;
                return;
            }
        }
        if(obj.parentNode && impact(oEnemy,obj)){
            boom({x:oEnemy.offsetLeft,y:oEnemy.offsetTop},oEnemy.width,oEnemy.height,index?2:0);
            boom({x:obj.offsetLeft,y:obj.offsetTop},obj.width,obj.height,1);
            oMap.removeChild(oEnemy);
            oMap.removeChild(obj);
            gameOver();
            return;
        }
        if(top>=oMap.clientHeight){
            oMap.removeChild(oEnemy);
            return;
        }
        requestAnimationFrame(move);
    }
    setTimeout(move, 30);
    if(obj.parentNode)
        setTimeout(enemy,[400,280,180,80][level],level,obj);
}

/**
 * @method impact 检测两个对象是否碰撞
 * @param  {object} obj1 被检测对象1
 * @param  {object} obj2 被检测对象2
 * @return {boolean}  true为碰撞,false为没有碰撞
 */
function impact(obj1,obj2){
    var T1 = obj1.offsetTop,
        B1 = T1 + obj1.clientHeight,
        L1 = obj1.offsetLeft,
        R1 = L1 + obj1.clientHeight,
        T2 = obj2.offsetTop,
        B2 = T2 + obj2.clientHeight,
        L2 = obj2.offsetLeft,
        R2 = L2 + obj2.clientHeight;

    return !(B2<T1||T2>B1||R2<L1||L2>R1);
}

/**
 * @method boom 产生爆炸云
 * @param  {json} pos 爆炸对象的坐标值
 * @param  {number} i   用于区分爆炸对象,0表示敌机小飞机,1表示我军飞机,2表示敌机大飞机
 */
function boom(pos,w,h,i){
    var oBoom = new Image();
    oBoom.src = 'images/'+['boom_small','plane_0','boom_big'][i]+'.png';
    oBoom.className = 'boom'+i;
    oBoom.width = w;
    oBoom.height = h;
    oBoom.style.top = pos.y + 'px';
    oBoom.style.left = pos.x + 'px';
    oBoom.id = Math.random()*10000|0;
    oMap.appendChild(oBoom);
    setTimeout(function(){
        oMap.removeChild(oBoom);
    },[1000,2500,1000][i]);
}

/**
 * @method gameOver 结束游戏
 */
function gameOver(){
    var aSpan = oGameover.getElementsByTagName('span');
    oGameover.className = '';
    oSore.className = 'hide';
    aSpan[0].innerHTML = score;
    if(score<500)
        aSpan[1].innerHTML = '飞行小兵';
    else if(score<1000)
        aSpan[1].innerHTML = '初级飞行员';
    else if(score<2000)
        aSpan[1].innerHTML = '中级飞行员';
    else if(score<4000)
        aSpan[1].innerHTML = '高级飞行员';
    else if(score<8000)
        aSpan[1].innerHTML = '终极飞行员';
    else if(score<15000)
        aSpan[1].innerHTML = '飞行无敌战士';
    else if(score<30000)
        aSpan[1].innerHTML = '飞行无敌战神';
    else if(score<50000)
        aSpan[1].innerHTML = '飞神';
    else
        aSpan[1].innerHTML = '天下无敌';
}

/**
 * @method moveBg 背景移动,造成我方飞机在飞行的感觉
 * @param  {object} obj 我方飞机
 */
function moveBg(obj){
    var bgY = 0;
    ~function m(){
        bgY +=2;
        oMap.style.backgroundPosition = '0px '+ bgY +'px';
        obj.parentNode && requestAnimationFrame(m);
    }();
}
