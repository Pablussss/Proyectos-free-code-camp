let keys = document.querySelectorAll(".padButton");
let operators = ["+", "-", "*", "/"]
let decimalAdded = false;


for(let i=0;i<keys.length;i++){
    keys[i].onclick = function(e) {
        let input = document.querySelector('.dis');
        let inputVal = input.innerHTML;
        let btnVal = this.innerHTML;
        
        if (decimalAdded === false && btnVal != 0 && inputVal[0] == 0){
            
            input.innerHTML = "";
        }
        if (decimalAdded === false && btnVal == 0 && inputVal[0] == 0){
            // No hacer nada
        }
        else {
            // Boton AC
            if (btnVal == 'AC') {
                input.innerHTML = 0;
                decimalAdded = false;
            }
            // Boton =
            else if(btnVal == '='){
                let equation = inputVal;
                let lastEq = equation[equation.length - 1];
                let firstEq = equation[0];
                

                if (firstEq == 0) {
                    let newEq = equation.slice(1)
                    equation = newEq;
                    
                }

                if (operators.indexOf(lastEq) > 1 || lastEq == '.'){
                    equation = equation.replace(/.$/, '');
                }

                if (equation){
                    input.innerHTML = eval(equation);
                }

                

                decimalAdded = false;
            }
            // Operators
            else if(operators.indexOf(btnVal) > -1) {
                let lastChar = inputVal[inputVal.length - 1]
                let lastChar2 = inputVal[inputVal.length - 2]
                let operators2 = ["+", "*", "/"]
                
                // Doble signo
                if (operators.indexOf(lastChar) > -1 && inputVal.length > 1){
                    // cualquier signo que no sea el "-"
                    if (operators2.indexOf(btnVal) > -1 && lastChar != "-"){
                        let newVal = inputVal.replace(lastChar, btnVal)
                        input.innerHTML = newVal
                    }
                    // tocamos el "-"
                    else if (operators2.indexOf(lastChar) > -1 && lastChar != "-"){
                        input.innerHTML += btnVal;
                    }
                }

                // Cambiar signo estando el - al final
                if (lastChar == "-" && operators2.indexOf(lastChar2) > -1){
                    // cambiar dos ultimos por el btnVal
                    let newVal = inputVal.replace(lastChar2, btnVal).replace(lastChar, "");
                    input.innerHTML = newVal;
                }
                

                // No esta vacio
                if (inputVal != '' && operators.indexOf(lastChar) == -1) {
                    input.innerHTML +=btnVal;
                }
                // Vacio con "-" (numero negativo)
                else if (inputVal === '' && btnVal === "-") {
                    input.innerHTML +=btnVal;
                }
               
            
                decimalAdded = false;
            }
            // Punto
            else if(btnVal == '.') {
                if (!decimalAdded) {
                    input.innerHTML += btnVal;
                    decimalAdded = true;
                }
            }
                // Numeros 
            else {
                input.innerHTML += btnVal;

            }
        }
         e.preventDefault();
    }
   
}


