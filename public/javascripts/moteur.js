	//GAMEPAD
var haveEvents = 'GamepadEvent' in window;
var controla = {};
var rAF = window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.requestAnimationFrame;
var vmot =[];
var pmot =[];
var speed1 =90;
var speed2 =90;
var speed3 =90;
	function connecthandler(e) {
		addgamepad(e.gamepad);
	}
	
	function addgamepad(gamepad) {
		controla[gamepad.index] = gamepad; var d = document.createElement("div");
		console.log(gamepad.index);
		d.setAttribute("id", "controller" + gamepad.index);
		
		var t = document.createElement("h1");
		t.appendChild(document.createTextNode("gamepad: " + gamepad.id));
		d.appendChild(t);
		var b = document.createElement("div");
		b.className = "buttons";
		
		for (var i=0; i<gamepad.buttons.length; i++) {
			var e = document.createElement("span");
			e.className = "button";
			//e.id = "b" + i;
			e.innerHTML = i;
			b.appendChild(e);
		}
		
		d.appendChild(b);
		var a = document.createElement("div");
		a.className = "axes";
		
		for (var i=0; i<gamepad.axes.length; i++) {
			var e = document.createElement("progress");
			var l = document.createElement("span");
			e.className = "axis";
			e.id = "a" + i;
			e.setAttribute("max", "2");
			e.setAttribute("value", "1");
			e.innerHTML = i;
			l.className="nbaxe";
			l.innerHTML = "axe : " +i;
			a.appendChild(l);
			a.appendChild(e);
		}
		
		d.appendChild(a);
		document.getElementById("start").style.display = "none";
		document.body.appendChild(d);
		rAF(updateStatus);
	}

	function disconnecthandler(e) {
		removegamepad(e.gamepad);
	}	

	function removegamepad(gamepad) {
		var d = document.getElementById("controller" + gamepad.index);
		document.body.removeChild(d);
		delete controla[gamepad.index];
	}

	function updateStatus() {
		if (!haveEvents) {
			scangamepads();
		}
		
		for (j in controla) {
			var controller = controla[j];
			var d = document.getElementById("controller" + j);
			var buttons = d.getElementsByClassName("button");
			
				for (var i=0; i<controller.buttons.length; i++) {
				var b = buttons[i];
				var val = controller.buttons[i];
				var pressed = val == 1.0;
				if (typeof(val) == "object") {
					pressed = val.pressed;
					val = val.value;
				}
				var pct = Math.round(val * 100) + "%"
				b.style.backgroundSize = pct + " " + pct;
				if (pressed) {
					b.className = "button pressed";
				} else {
				b.className = "button";
				}
				}

				var axes = d.getElementsByClassName("axis");
				var valaxe = d.getElementsByClassName("nbaxe");
				
				for (var i=0; i<controller.axes.length; i++) {
				
                    // moteur droit et gauche
                    var test;
					var a = axes[i];
					var m=valaxe[i];
					a.innerHTML = i + ": " + controller.axes[i].toFixed(4);
					a.setAttribute("value", -controller.axes[i] + 0.4);
					m.innerHTML = 
					test = controller.axes[i];
       if (i === 0 ){
           pmot[i] = -(Math.round(controller.axes[i]*100))+48;
           //console.log("pmot" + i + pmot[i]);
       }
        if (i === 1 ) {
            pmot[i] = -(Math.round(controller.axes[i]*100))+50;
           //console.log("pmot" + i + pmot[i]);
        }
        if (i === 2 ) {
            pmot[i] = -(Math.round(controller.axes[i]*100))+51;
            //console.log("pmot" + i + pmot[i]);
        }           
        if (i === 3 ) {
            pmot[i] = -(Math.round(controller.axes[i]*100))+56;
            //console.log("pmot" + i + pmot[i]);
        }            
                    
// axe 0 = direction droite gauche moteurs latéraux
// axe 1 = acceleration et freinage moteurs latéraux
// axe 2 = rien
// axe 3 = acceleration et freinage moteur vertical                  
                     
                    
                    //if (i===1) {
					//	speed1=parseInt(m.innerHTML);
						//console.log(a.innerHTML);
						//console.log("test",test);
						//console.log(speed1);
						//socket.emit('moteur1', speed1);
				//	};
				}
        
        vmot[1] = pmot[1]-pmot[0]+90;
	vmot[2] = pmot[1] + pmot[0] -90;
	vmot[3] = pmot[3];            
//console.log ("VMOT1 =" + vmot[1]);
//console.log ("VMOT2 =" +vmot[2]);            
//console.log("VMOT3 =" + vmot[3]);

if (speed1 != parseInt(vmot[1]) ){
$('#moteurdroit').text('Puissance moteur droit : ' + (vmot[1]-90));
speed1 = parseInt(vmot[1]);
socket.emit('moteur1', speed1);
}
if (speed2 != parseInt(vmot[2])) {     
$('#moteurgauche').text('Puissance moteur gauche : ' + (vmot[2]-90));
speed2=parseInt(vmot[2]);            
socket.emit('moteur2', speed2);
}
if (speed3 != parseInt(vmot[3]) ){          
$('#moteurvertical').text('Puissance moteur vertical : ' + (vmot[3]-90));
speed3=parseInt(vmot[3]);
socket.emit('moteur3', speed3);
}			
}
		rAF(updateStatus);
	}

	function scangamepads() {
		var gamepads = navigator.getGamepads () ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
		for (var i = 0; i < gamepads.length; i++) {
			if (gamepads[i]) {
				if (!(gamepads[i].index in controla)) {
					addgamepad(gamepads[i]);
				} else {
				controla[gamepads[i].index] = gamepads[i];
				}
			}
		}
	}

	window.addEventListener("gamepadconnected", connecthandler);
	window.addEventListener("gamepaddisconnected", disconnecthandler);
	if (!haveEvents) {
		setInterval(scangamepads, 500);
	}
	//fin gamepad