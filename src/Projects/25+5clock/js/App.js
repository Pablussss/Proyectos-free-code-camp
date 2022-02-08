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
        breakLength ++;
        $('#break-length').text(breakLength);
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
        sessionLength ++;
        let restante = formatoHora(sessionLength, 0)
        $('#session-length').text(sessionLength);
        $('#time-left').text(restante);
    })

    // Start / Stop session
    
    $('#start_stop').click(sessionStarted);

    function sessionStarted () {
        $("#timer-label").html("Session")
        tiempoTotal = calcSegundos();
        if (!isPlaying) {
            console.log("Running")
            isPlaying = true
            temporizador();
        }
        else if (isPlaying) {
            console.log("Stopped")
            isPlaying = false
            pararTemporizador()
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
        temporizador_1 = setInterval(actualizarContador, 100);
    }
    function pararTemporizador () {
        clearInterval(temporizador_1);
    }


    // Actualiza el time-left
    function actualizarContador () {
        if (!breakPlaying) {
            if (tiempoTotal === 0){
                playSound()
                pararTemporizador();
                breakContador();
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
            if (tiempoTotal === 0){
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
        $('#break-length').text(breakLength);
        $('#session-length').text(sessionLength);
        $('#time-left').text(formatoHora(sessionLength, 0))
        isPlaying = false;
    }
       
    }
    function contador () {
        // convertir formato con momentjs
        tiempoTotal --;
        let restante = formatoHora(minutosRestantes, segundosRestantes)
        $('#time-left').text(restante);
    }

    function breakContador () {
        $("#timer-label").html("Break")
        let restante = formatoHora(breakLength, 0)
        $("#time-left").text(restante);
        console.log("Break Running")
        breakPlaying = true;
        tiempoTotal = calcSegundos()
        temporizador();     
    }

    function formatoHora (m, s) {
        let hora = m + ":" + s;
        let restante = moment(hora, "mm:ss")
        let resultado = restante.format("mm:ss")
        return resultado;
    }

    function playSound (){
        const sound = new Audio($("#beep"));
        sound.play()
    }

    function stopSound () {
        $("beep").stop();
    }

        
})