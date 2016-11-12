function Shape(x, y, texte){
		this.x = x;
		this.y = y;
		this.size = 150;

		this.text = texte;
		this.placement = [];
		//this.vectors = [];
	}

/*//idata 为一个对象
	var idata = cxt.getImageData(0, 0, W, H);

	ImageData {data: Uint8ClampedArray[1885276], width: 733, height: 643}
		data:Uint8ClampedArray[1885276] //8位无符号整形数组
		height
		:643
		width:733

	var buffer32 = new Uint32Array(idata.data.buffer);
	/*
		将8位无符号整形数组，转换成32位的,范围为[471318]
	*/
Shape.prototype.getValue = function(){

		//draw the shape
		 context.textAlign = "center";
		 context.font =  this.size + "px arial";
		 context.fillText(this.text, this.x, this.y);

		 var idata = context.getImageData(0, 0, W, H);
		 var buffer32 = new Uint32Array(idata.data.buffer);

		 for(var j=0; j < H; j += gridY){
		 	for(var i=0 ; i < W; i += gridX){
		 		if(buffer32[j * W + i]){
		 			var particle = new Particle(i, j, type);
		 			this.placement.push(particle);
		 		}
		 	}
		 }

        context.clearRect(0, 0, W, H);

}

var canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
	W = canvas.width = window.innerWidth;
 	H = canvas.height = window.innerHeight;
	gridY = 7, gridX = 7;

	type = "ball";

   colors = [
  '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
  '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
  '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
  '#FF5722'
  ];

var message = document.getElementById('message'),
	gravity = document.getElementById('gra'),
	duration = document.getElementById('dur'),
	speed = document.getElementById('speed'),
	radius = document.getElementById('rad'),
	resolution = document.getElementById('res');

   graVal = parseFloat(gravity.value);
   durVal = parseFloat(duration.value);
   spdVal = parseFloat(speed.value);
   radVal = parseFloat(radius.value);
   resVal = parseFloat(resolution.value);

var word = new Shape(W/2, H/2, message.value);
	word.getValue();

function change(){
	  context.clearRect(0, 0, W, H);
	  gridX = parseFloat(resolution.value);
	  gridY = parseFloat(resolution.value);
	  word.placement = [];
	  word.text = message.value;
	  word.getValue();
}

function changeV() {
     graVal = parseFloat(gravity.value);
     durVal = parseFloat(duration.value);
     spdVal = parseFloat(speed.value);
     radVal = parseFloat(radius.value);
}


(function drawFrame(){
	window.requestAnimationFrame(drawFrame, canvas);
	context.clearRect(0, 0, W, H);

	for(var i=0; i< word.placement.length; i++){
		word.placement[i].update();
	}
}())

//resize
function resize(){
	W = canvas.width = window.innerWidth;
 	H = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize, false);


function Particle(x, y, type) {
  this.radius = 1.1;
  this.futurRadius = utils.randomInt(radVal, radVal+3); //[1.1,5.1]

  this.rebond = utils.randomInt(1, 5);
  this.x = x;
  this.y = y;

  this.dying = false;

  this.base = [x, y];

  this.vx = 0;
  this.vy = 0;
  this.type = type;
  this.friction = .99;
  this.gravity = graVal;
  this.color = colors[Math.floor(Math.random() * colors.length)];

  this.getSpeed = function() {
    return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
  };

  this.setSpeed = function(speed) {
    var heading = this.getHeading();
    this.vx = Math.cos(heading) * speed;
    this.vy = Math.sin(heading) * speed;
  };

  this.getHeading = function() {
    return Math.atan2(this.vy, this.vx);
  };

  this.setHeading = function(heading) {
    var speed = this.getSpeed();
    this.vx = Math.cos(heading) * speed;
    this.vy = Math.sin(heading) * speed;
  };

  this.update = function(heading) {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += graVal;

    this.vx *= this.friction;
    this.vy *= this.friction;

    if(this.radius < this.futurRadius && this.dying === false){
      this.radius += durVal;
    }else{
      this.dying = true;
    }

    if(this.dying === true){
      this.radius -= durVal;
    }

    if(type === "ball"){
      context.save();
      context.fillStyle = this.color;
      context.beginPath();
      context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
      context.closePath();
      context.fill();
      context.restore();
    }

    if(type === "rect"){
      context.save();
      context.fillStyle = this.color;
      context.beginPath();
      context.fillRect(this.x, this.y, this.futurRadius, this.futurRadius)
      context.closePath();
      context.fill();
      context.restore();
    }


    if (this.y < 0 || this.radius < 1) {
      this.x = this.base[0];
      this.y = this.base[1];
      this.dying = false;
      this.radius = 1.1;
      this.setSpeed(spdVal);
      this.futurRadius = utils.randomInt(radVal, radVal+3);
      this.setHeading(utils.randomInt(utils.degreesToRads(0), utils.degreesToRads(360)));
    }

  }

  this.setSpeed(utils.randomInt(.1, .5));
  this.setHeading(utils.randomInt(utils.degreesToRads(0), utils.degreesToRads(360)));

}
