
//GAMEPAD
	
	var haveEvents = 'GamepadEvent' in window;
	var controla = {};
	var rAF = window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.requestAnimationFrame;
var maxaxe=[-10,-10,-10,-10];
var minaxe=[0,0,0,0];
	function connecthandler(e) {
		addgamepad(e.gamepad);
	}
	
	function addgamepad(gamepad) {
		controla[gamepad.index] = gamepad; 
        var d = document.createElement("div");
        //var x = document.createElement("div");
        //x.setAttribute("id","minmaxaxe");
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
		//document.getElementById("start").style.display = "none";
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
				var maxi=0,mini=0;
           
            
				for (var i=0; i<controller.axes.length; i++) {
				    var test;
                    var test2;
               
					var a = axes[i];
					var m=valaxe[i];
					
                    if (controller.axes[i] > maxaxe[i]) { 
                        maxaxe[i]=controller.axes[i].toFixed(4);
                        
                        console.log ("maxmin",i,maxaxe[i],minaxe[i]);
                    }
                    if (controller.axes[i] < minaxe[i]) { 
                        minaxe[i]=controller.axes[i].toFixed(4);
                        
                        console.log ("maxmin",i,maxaxe[i],minaxe[i]);
                    }
                    //(x.appendChild(minaxe[0], " " , maxaxe[0]);
                   var ecart = maxaxe[1]-minaxe[1];
                    var valeur1 = Math.round(((controller.axes[1]-minaxe[1])*180)/(maxaxe[1]-minaxe[1]));
                    document.getElementById("p0").innerHTML = ("0," + minaxe[0] + ", " + maxaxe[0]);
                    document.getElementById("p1").innerHTML = ("1," + minaxe[1] + ", " + maxaxe[1]+ ", " + ecart + ", "+valeur1);
                    document.getElementById("p2").innerHTML = ("2," + minaxe[2] + ", " + maxaxe[2]);
                    document.getElementById("p3").innerHTML = ("3," + minaxe[3] + ", " + maxaxe[3]);
                    a.innerHTML = i + ": " + controller.axes[i].toFixed(4);
                    
					a.setAttribute("value", -controller.axes[i] + 0.4);
					m.innerHTML = -(Math.round(controller.axes[i]*100))+50;
					test = controller.axes[i];
					if (i===1) {
						speed1=parseInt(m.innerHTML);
						console.log(a.innerHTML);
						console.log("test",test);
                        console.log("test2",test2);
						console.log(speed1);
						//socket.emit('moteur1', speed1);
					};
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