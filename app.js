// déclarations des modules nodejs

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var five = require('johnny-five');
var fs = require('fs');
var when = require('when');
var poll = require('when/poll');
var routes = require('./routes');
var videoprocess = require('child_process');
 
//config = require('../config'),
var GoPro = require('gopro_hero_api/libs/gopro');

// création de la gopro
//var cam = new camera('10.5.5.9', 'baptiste');

// routes
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname ,'./viewsejs'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname + '/public', 'favicon.ico')));
//app.use(express.methodOverride());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(app.router);
// emplacement des fichiers statics
app.use(express.static(path.join(__dirname + '/public')));

//app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
//app.use(function(req, res, next) {
  //var err = new Error('Not Found');
 // err.status = 404;
 // next(err);
//});

// error handlers

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
 // app.use(express.errorHandler());
  //};

app.get('/', function (req, res, next) {
    res.render("pilot.ejs");
});
app.get('/setjoystick', function (req, res, next) {
    res.render("setjoystick.ejs");
});
app.get('/config', function (req, res, next) {
    res.render("config.ejs");
});
app.get('/gopro', function (req, res, next) {
    res.render("gopro.ejs");
});

// production error handler
// no stacktraces leaked to user

//app.use(function(err, req, res, next) {
 // res.status(err.status || 500);
 // res.render('error', {
  //  message: err.message,
 //   error: {}
//  });
//});
//webcam_on = videoprocess.exec('mjpg_streamer -i "/usr/local/lib/input_uvc.so -f 25 -r 800x600" -o "/usr/local/lib/output_http.so -p 8085"');
//var camo = new GoPro('baptiste', '10.5.5.9');
//cam.ready().then(function () {

        //camo.status().then(function (status) {
         //   console.log(status);
      //  }).catch(function (error) {
       //     console.log(error.message);
      //  });

   // }).catch(function (error) {
    //    console.log(error.message);
   // });











// déclaration de l'arduino mega

var board = new five.Board();

board.on("ready", function() {
    
// création des moteurs et mise a l'arrët des moteurs
var servo1 = new five.Servo(10);
servo1.to(90);
var servo2 = new five.Servo(11);
servo2.to(90);
var servo3 = new five.Servo(12);
servo3.to(90);
    
// création des leds  
var led1 = new five.Led(8);    
var led2 = new five.Led(9);    

// création des batterie
var bat1 = new five.Sensor("A0");    
var bat2 = new five.Sensor("A1");    
var bat3 = new five.Sensor("A2");   
var gyro = new five.Gyro({
    controller: "MPU6050"
  });    
// Loading the file index.html displayed to the client

var server = http.createServer(app);//,function() {
 //fs.readFile('./index033.html', 'utf-8', function(error, content) {
   //    res.writeHead(200, {"Content-Type": "text/html"});
  //    res.end(content);
   //   });
//    console.log("ok");
//});


// Loading socket.io

var io = require('socket.io').listen(server);
    

//video
var argsvideo = [
'-i ',
'"/usr/local/lib/input_uvc.so -f 25 -r 800x600"',
'-o ',
'"/usr/local/lib/output_http.so -p 8085"'
];


argsk ='-i "/usr/local/lib/input_uvc.so -f 15 -r 800x600" -o "/usr/local/lib/output_http.so -p 8085"';
console.log(argsvideo);
console.log(argsk);


    
//connection reussie
io.sockets.on('connection', function (socket, username) {


// commandes des moteurs
   
	socket.on('moteur1', function (speed1) {
		console.log('mot1 : ' + speed1);
		servo1.to(speed1);
		});
    
    socket.on('moteur2', function (speed2) {
		//console.log('mot2 : ' + speed2);
		servo2.to(speed2);
		});
	
    socket.on('moteur3', function (speed3) {
		//console.log('mot3 : ' + speed3);
		servo3.to(speed3);
		});	
		
	socket.on('moteurstop', function () {
		speed=90;
		servo1.to(speed);
		servo2.to(speed);
		servo3.to(speed);
		console.log(speed);
		});



// commandes de la gopro
    socket.on('gopro', function (data) {
		if (data =="on") {
              console.log('goproo132n');
		
		cam.power(true);
		}

        else if (data == "off") {
                console.log('goprooff');
                cam.powerOff();
        }
        else if (data == "start") {
                console.log('goprovideostart');
                cam.startCapture();
        }
        else if (data =="stop") {
                console.log('goprovideostop');
		        cam.stopCapture();
        }
        });	
    socket.on('gopromode', function (data) {
		if (data =="video") {
              console.log('goprovideo');
		      //cam en mode video
        }
        else if (data == "photo") {
                console.log('goprophoto');
                //cam en mode photo
        }
    });
// commandes de la camera usb


// commandes des lumières

    socket.on('leddroite',function(etatleddroite){
        //led1(etatleddroite);
        console.log("led droite ", etatleddroite);
    });
    socket.on('ledgauche',function(etatledgauche){
        //led2(etatledgauche);
        console.log("led gauche ", etatledgauche);
    });
    
// envoie les données de gyro  et compass
      
   var rollexp=0;
var pitchexp=0; 
    
   gyro.on('change', function() {
	console.log('gyro');
	rollexp=this.x;
console.log(rollexp);
	pitchexp=this.pitch;
	yawexp=this.yaw;
   
	socket.emit('mouv', rollexp, pitchexp);
	console.log("x :" + rollexp.angle+ " y:"+ pitchexp.angle + "z :" + yawexp.angle);
	
	
}); 
    
    
// envoie les données des batteries
    
    
   
    
    
//read(callback(error, value)) Register a handler to be called whenever the board reports the value (digital or analog) of this pin.

setInterval(function(){  

    //bat1.on("change",function() {
        //console.log("bat1 : " + bat1.value);
        var valbat1 = bat1.value*5/1024*2;
        socket.emit('bat1', valbat1);
        //mettre a jour avec jquery
   //});
    //bat2.on("change",function() {
        //console.log("bat2 : " + bat2.value);
        var valbat2 = bat2.value;
        socket.emit('bat2', valbat2);
        //mettre a jour avec jquery
   //});
    //bat3.on("change",function() {
        //console.log("bat3 : " + bat3.value);
        var valbat3 = bat3.value;
        socket.emit('bat3', valbat3);
        //mettre a jour avec jquery
   //});
    
}, 10000);   
    
//  IMU
 
    
 //setInterval(function(){  

      //popo
    
//}, 100);      
    
    
    
    
 
});

server.listen(3000);});




//module.exports = app;
