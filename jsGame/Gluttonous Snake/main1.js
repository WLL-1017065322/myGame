// 画布

(function() {
  function CanvasBoard() {
    this.x = 20; //间距

    this.y = 20; //

    this.drawCanvas = function() {
      context.beginPath();

      context.strokeStyle = "#ddd";

      context.lineWidth = 1;

      for (var i = 0; i < board.width / this.x; i++) {
        context.moveTo(i * this.x + 0.5, 0);

        context.lineTo(i * this.x + 0.5, board.height);
      }

      for (var i = 0; i < board.height / this.y; i++) {
        context.moveTo(0, i * this.y + 0.5);

        context.lineTo(board.width, i * this.y + 0.5);
      }

      context.stroke();
    };
  }
  window.CanvasBoard = CanvasBoard;
})();

//自调用食物的函数
(function() {
  var elements = []; //用来存储食物
  function Food(x, y, width, height, color) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 20;
    this.height = height || 20;
    this.color = color || "green";
  }
  //为原型添加，初始化方法（在页面上显示这个食物）
  Food.prototype.init = function(map) {
    //先删除食物
    remove();
    //创建div
    var div = document.createElement("div");
    //append to map
    map.appendChild(div);
    //div style
    div.style.width = this.width + "px";
    div.style.height = this.height + "px";
    div.style.backgroundColor = this.color;
    //leave 文档流
    div.style.position = "absolute";
    //random x y
    this.x =
      parseInt(Math.random() * (map.offsetWidth / this.width)) * this.width;
    this.y =
      parseInt(Math.random() * (map.offsetHeight / this.height)) * this.height;
    div.style.left = this.x + "px";
    div.style.top = this.y + "px";

    //push element to array element
    elements.push(div);
  };

  //remove food

  function remove() {
    for (var i = 0; i < elements.length; i++) {
      var ele = elements[i];
      //remove this div
      ele.parentNode.removeChild(ele);
      //remove element's div
      elements.splice(i, 1);
    }
  }

  //Food 暴露给外部
  window.Food = Food;
})();

//自调用蛇的函数

(function() {
  var elements = [];

  function Snake(width, height, direction) {
    this.width = width || 20;
    this.height = height || 20;

    this.body = [
      { x: 3, y: 2, color: "red" }, //head
      { x: 2, y: 2, color: "orange" }, //body
      { x: 1, y: 2, color: "orange" } //body
    ];
    this.direction = direction || "right";
  }

  Snake.prototype.init = function(map) {
    remove();
    for (var i = 0; i < this.body.length; i++) {
      var obj = this.body[i];
      var div = document.createElement("div");
      map.appendChild(div);

      //div style
      div.style.position = "absolute";
      div.style.width = this.width + "px";
      div.style.height = this.height + "px";

      div.style.left = obj.x * this.width + "px";
      div.style.top = obj.y * this.height + "px";

      div.style.backgroundColor = obj.color;

      elements.push(div);
    }
  };
  Snake.prototype.move = function(food, map) {
    //change snake body's zuo biao
    var i = this.body.length - 1;
    for (; i > 0; i--) {
      this.body[i].x = this.body[i - 1].x;
      this.body[i].y = this.body[i - 1].y;
    }
    //change snake head's zuo biao
    switch (this.direction) {
      case "right":
        this.body[0].x += 1;
        break;
      case "left":
        this.body[0].x -= 1;
        break;
      case "top":
        this.body[0].y -= 1;
        break;
      case "bottom":
        this.body[0].y += 1;
        break;
    }

    //判断有没有吃到食物：小蛇头的坐标和食物一致
    var headX = this.body[0].x * this.width;
    var headY = this.body[0].y * this.height;

    //判断 小蛇头的坐标和食物一致
    if (headX == food.x && headY == food.y) {
      // 得分
      scoreNum++;
      console.log(scoreNum);
      score.innerHTML = scoreNum;

      //获取蛇尾
      var last = this.body[this.body.length - 1];
      this.body.push({
        x: last.x,
        y: last.y,
        color: last.color
      });
      //删除食物
      food.init(map);
    }
  };
  //remove snake
  function remove() {
    var i = elements.length - 1;
    for (; i >= 0; i--) {
      var ele = elements[i];
      ele.parentNode.removeChild(ele);
      elements.splice(i, 1);
    }
  }

  window.Snake = Snake;
})();

//自调用游戏对象

(function() {
  function Game(map) {
    this.food = new Food();
    this.snake = new Snake();
    this.map = map;
    that = this;
  }

  Game.prototype.init = function() {
    this.food.init(this.map);
    this.snake.init(this.map);

    // setInterval(function(){
    //     sn.init(document.querySelector(".map"))
    // sn.move(fd,document.querySelector(".map"))

    // },150)
    // setInterval(function() {
    //   that.snake.move(that.food, that.map);
    //   that.snake.init(that.map);
    // }, 150);
    this.runSnake(this.food, this.map);
    this.bindKey();
  };
  //snake move
  Game.prototype.runSnake = function(food, map) {
    var timeId = setInterval(
      function() {
        //move snake
        this.snake.move(food, map);
        //init snake
        this.snake.init(map);
        //max x
        var maxX = map.offsetWidth / this.snake.width;
        //max y
        var maxY = map.offsetHeight / this.snake.height;

        var headX = this.snake.body[0].x;
        var headY = this.snake.body[0].y;
        console.log(maxX,maxY,headX,headY,this.snake.width)

        // bug ：右 下：多一格 if (headX < 0 || headX > maxX - 1)

        //横坐标
        if (headX < 0 || headX > maxX - 1) {
          //撞墙了,停止定时器
          clearInterval(timeId);
          alert("游戏结束");
        }
        //纵坐标
        if (headY < 0 || headY >= maxY - 1) {
          //撞墙了,停止定时器
          clearInterval(timeId);
          alert("游戏结束");
        }
      }.bind(that),
      150
    ); //change this 指向
    return timeId;
  };
  //按键
  Game.prototype.bindKey = function() {
    document.addEventListener(
      "keydown",
      function(e) {
        switch (e.keyCode) {
          case 37:
            //解决蛇 可以直接回头的bug  19.5.6========================
            if (this.snake.direction !== "right") {
              this.snake.direction = "left";
            }
            break;
          case 38:
            if (this.snake.direction != "bottom") {
              this.snake.direction = "top";
            }

            break;
          case 39:
            if (this.snake.direction !== "left") {
              this.snake.direction = "right";
            }
            break;
          case 40:
            if (this.snake.direction != "top") {
              this.snake.direction = "bottom";
            }
            break;
        }
      }.bind(that),
      false
    );
  };

  window.Game = Game;
})();
