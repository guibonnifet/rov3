
var diff=0;
var timerID = 0;
function temps(){
 var encours = new Date();
   
    diff = encours-debut;
    diff = new Date(diff);
    heure = diff.getHours()-1;
    minute = diff.getMinutes();
    seconde = diff.getSeconds();
if (minute < 10){
		minute = "0" + minute
	}
	if (seconde < 10){
		seconde = "0" + seconde
}
	
    console.log(heure+ ":" + minute + ":" + seconde );
    tempsplonge = (heure+ ":" + minute + ":" + seconde );
        $('#pplonge').text('Durée de plongée :'+tempsplonge);
    timerID = setTimeout("temps()",1000);
    
}
