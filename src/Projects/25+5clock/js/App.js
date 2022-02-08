$(document).ready(function(){
    // Variables
    let breakLength = 5;
    let sessionLength = 25;
    let timeLeft = "25:00";
    let isPlaying = false;
    let temporizador_1;
    let minutosRestantes;
    let segundosRestantes;
    let tiempoTotal;
    let breakPlaying = false;

    // Click en reset
    $('#reset').click(function reset () {
        breakLength = 5;
        sessionLength = 25;
        timeLeft = "25:00"
        $('#break-length').text(breakLength);
        $('#session-length').text(sessionLength);
        $('#time-left').text(timeLeft)
        $("#timer-label").html("Session")
        isPlaying = false;
        pararTemporizador();
        stopSound();
    })
    

    // Break decrement / increment 
    $('#break-decrement').click(function(){
        if(breakLength > 1){
            breakLength --;
            $('#break-length').text(breakLength);
        }
    })
    $('#break-increment').click(function(){
        if (breakLength < 59) {
            breakLength ++;
            let restante = formatoHora(breakLength, 0)
            $('#break-length').text(breakLength);
            $('#time-left').text(restante);
        }
        else if(breakLength === 59){
            breakLength ++;
            $('#break-length').text(breakLength);
            $('#time-left').text("60:00");
        }
    })

    // Session decrement / increment 
    $('#session-decrement').click(function(){
        if(sessionLength > 1){
            sessionLength --;
            let restante = formatoHora(sessionLength, 0)
            $('#session-length').text(sessionLength);
            $('#time-left').text(restante);
        }
    })
    $('#session-increment').click(function(){
        if (sessionLength < 59) {
            sessionLength ++;
            let restante = formatoHora(sessionLength, 0)
            $('#session-length').text(sessionLength);
            $('#time-left').text(restante);
        }
        else if(sessionLength === 59){
            sessionLength ++;
            $('#session-length').text(sessionLength);
            $('#time-left').text("60:00");
        }
    })

    // Start / Stop session / break
    $('#start_stop').click(function () {
        if (breakPlaying) {
            breakStarted ()
        }
        else if (!breakPlaying){
            sessionStarted ()
        }
        
    });
    // Session
    function sessionStarted () {
        $("#timer-label").html("Session")
        tiempoTotal = calcSegundos();
        
        if (!isPlaying) {
            console.log("Session Running")
            isPlaying = true
            temporizador();
        }
        else if (isPlaying) {
            console.log("Session Stopped")
            isPlaying = false
            pararTemporizador()
        }
    }
    // Break
    function breakStarted () {
        breakPlaying = true;
        $("#timer-label").html("Break")
        tiempoTotal = calcSegundos()

        if (!isPlaying){
            console.log("Break Running")
            isPlaying = true
            temporizador();
        }
        else if (isPlaying){
            console.log("Break Stopped")
            isPlaying = false;
            pararTemporizador();
        }
    }

    // Calcular tiempo en segundosRestantes
    function calcSegundos () {
        dispVal = $('#time-left').text().split(":")
        minutosRestantes = parseInt(dispVal[0])
        segundosRestantes = parseInt(dispVal[1])
        tiempoTotal = (minutosRestantes * 60) + segundosRestantes
        return tiempoTotal;
    }


    // Temporizador y parar temporizador
    function temporizador () {
        temporizador_1 = setInterval(actualizarContador, 1000);
        isPlaying = true;
    }
    function pararTemporizador () {
        clearInterval(temporizador_1);
        isPlaying = false;
    }


    // Actualiza el time-left
    function actualizarContador () {
        if (!breakPlaying) {
            console.log("tiempo Session " + tiempoTotal)
            if (tiempoTotal === 0){
                playSound()
                pararTemporizador();
                $("#time-left").text(formatoHora(breakLength, 0));
                breakStarted();
            }
            else if (segundosRestantes === 0){
                minutosRestantes --;
                segundosRestantes = 59;
                contador()
            }
            else {
                segundosRestantes --;
                contador();
            }
        }
        else if(breakPlaying){
            console.log("tiempo Break " + tiempoTotal)
            if (tiempoTotal === 0){
                playSound()
                breakPlaying = false;
                pararTemporizador();
                bucleSesion()
                sessionStarted()
            }
            else if (segundosRestantes === 0){
                minutosRestantes --;
                segundosRestantes = 59;
                contador()
            }
            else {
                segundosRestantes --;
                contador();
            }
        }

    function bucleSesion () {
        if (!breakPlaying){
            $('#time-left').text(formatoHora(sessionLength, 0))
        }
        else if(breakPlaying){
            $('#time-left').text(formatoHora(breakLength, 0))
        }
    }
       
    }
    function contador () {
        // convertir formato con momentjs
        tiempoTotal --;
        let restante = formatoHora(minutosRestantes, segundosRestantes)
        $('#time-left').text(restante);
    }

    function formatoHora (m, s) {
        let hora = m + ":" + s;
        let restante = moment(hora, "mm:ss")
        let resultado = restante.format("mm:ss")
        return resultado;
    }

    function playSound (){
        let clip = document.getElementById("beep")
        clip.play();
        clip.muted = false;
    }

    function stopSound () {
        let clip = document.getElementById("beep")
        clip.pause();
        clip.currentTime = 0;
    }
       
})