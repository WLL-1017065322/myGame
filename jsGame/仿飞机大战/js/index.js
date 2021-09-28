
var jiandan = document.getElementById('jiandan');

var map =document.getElementById('map');

var gamestart =document.getElementById('gamestart');
var gameover =document.getElementById('gameover');
var score =document.getElementById('score');

window.onload=function(){
    gamestart.style.opacity=1;
    gameover.style.opacity=0;
    map.style.opacity=1;
    
}


jiandan.onclick = function(){
    gamestart.style.opacity=0;

}
