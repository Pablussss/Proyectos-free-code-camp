$(document).ready(function(){
    //Global Variables
        let breakCtr = 5;
        let sessionCtr = 25;
        let tmp = '';
        let isPlay = false;
        let dispVal;
        let dispValMin = 0;
        let dispValSec = 0;
        let setInt_ID = 0;
        let isBreak = false;
    
    //Code
        $('#break-length').text(breakCtr);
        $('#session-length').text(sessionCtr);
        tmp = sessionCtr + ':' + '00';
        $('#time-left').text(tmp);
    
        $('#break-increment').click(function(){
            if(isPlay === false){
                if(breakCtr < 60){
                    breakCtr++;
                    $('#break-length').text(breakCtr);
                }
            }
        })
        $('#break-decrement').click(function(){
            if(isPlay === false){
                if(breakCtr > 1){
                    breakCtr--;
                    $('#break-length').text(breakCtr);
                }
            }
        })
        $('#session-increment').click(function(){
            if(isPlay === false){
                if(sessionCtr < 60) {
                    sessionCtr++;
                    $('#session-length').text(sessionCtr);
                }
                tmp = sessionCtr + ':' + '00';
                $('#time-left').text(tmp);
        }
        })
    
        $('#session-decrement').click(function(){
            if(isPlay === false){
                if(sessionCtr > 1){
                    sessionCtr--;
                    $('#session-length').text(sessionCtr);
                }
                tmp = sessionCtr + ':' + '00';
                $('#time-left').text(tmp);
            }
        })
        const updateDisplay = () => {
    //to implement the displaying updated time each second..
            let min = '';
            let sec = '';
    if(dispValSec < 10) {
        sec = '0' + dispValSec;
    } else sec = dispValSec;
    if(dispValMin < 10) {
        min = '0' + dispValMin;
    } else min = dispValMin;
    $('#time-left').text(min + ':' + sec);
        }
    
        const updateTimer = () => {
    //to decrement the relevant counts (i.e seconds or minutes count) and display the updated time
    if(isBreak === false){
            
            if(dispValMin >= 1 && dispValSec === 0){
                //to update and display timer
                dispValSec = 59;
                dispValMin--;
                updateDisplay();
            } else if(dispValMin >= 0 && dispValSec !== 0){
    //to update and display timer
                dispValSec--;
                updateDisplay();
            } else if(dispValMin === 0 && dispValSec === 0){
                isBreak = true;
                dispValMin = breakCtr;
                dispValSec = 0;
                $('#timer-label').text('Break');
                updateDisplay();
                document.getElementById('beep').play();
                document.getElementById('beep').muted = false;
            }
        } else if (isBreak === true){
                // countdown the break length...
                
                if(dispValMin >= 1 && dispValSec === 0){
                    //to update and display timer
                    dispValSec = 59;
                    dispValMin--;
                    updateDisplay();
                } else if(dispValMin >= 0 && dispValSec !== 0){
                //to update and display timer
                    dispValSec--;
                    updateDisplay();
                } else if(dispValMin === 0 && dispValSec === 0){
                    isBreak = false;
                    dispValMin = sessionCtr;
                    dispValSec = 0;
                    $('#timer-label').text('Session');
                    updateDisplay();
                    document.getElementById('beep').play();
                    document.getElementById('beep').muted = false;
                }
            }
    
        }
    
        $('#start_stop').click(function(){
            dispVal = $('#time-left').text().split(':');
            dispValMin = parseInt(dispVal[0]);
            dispValSec = parseInt(dispVal[1]);
    
            if(isPlay === false){
                //start the timer...
                isPlay = true;
                setInt_ID = setInterval(updateTimer, 1000);
            } else if(isPlay === true){
                //stop the timer...
                isPlay = false;
                clearInterval(setInt_ID);
            }
        })
    
        $('#reset').click(function(){
            breakCtr = 5;
            sessionCtr = 25;
            $('#break-length').text(breakCtr);
            $('#session-length').text(sessionCtr);
            clearInterval(setInt_ID);
            tmp = sessionCtr + ':' + '00';
            $('#time-left').text(tmp);
            $('#timer-label').text('Session');
            isPlay = false;
            isBreak = false;
            let clip = document.getElementById('beep');
            clip.pause();
            clip.currentTime = 0;
        })
    })