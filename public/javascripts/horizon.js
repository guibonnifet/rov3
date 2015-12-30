        
socket.on('mouv', function(rollexp,pitchexp) {
    attitude.setRoll(rollexp);
    attitude.setPitch(pitchexp);
    $('#groll').text('gyro roll : '+ rollexp.angle);
    $('#gpitch').text('gyro pitch : '+ pitchexp.angle);
    console.log('roll' + rollexp.angle);
    console.log('pitch' + pitchexp.angle);
    });
   