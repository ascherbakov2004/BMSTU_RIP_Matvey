window.onload = function() {
    let a = ''
    let b = ''
    let expressionResult = ''
    let selectedOperation = null


    // окно вывода результата
    outputElement = document.getElementById("result")


    // СПИСОК ОБЪЕКТОВ КНОПОК ЦИФЕРБЛАТА (ID КОТОРЫХ НАЧИНАЕТСЯ С BTN_DIGIT_)
    digitButtons = document.querySelectorAll('[id ^= "btn_digit_"]')


    function updateDisplay() {
        if (!selectedOperation) {
            outputElement.innerHTML = a || '0'
        } else {
            outputElement.innerHTML = `${a} ${selectedOperation} ${b}`
        }
    }


    function onDigitButtonClicked(digit) {
        if (!selectedOperation) {
            if ((digit != '.') || (digit == '.' && !a.includes(digit))) {
                a += digit
            }
        } else {
            if ((digit != '.') || (digit == '.' && !b.includes(digit))) {
                b += digit
            }
        }
        updateDisplay()
    }


    // устанавка колбек-функций на кнопки циферблата по событию нажатия
    digitButtons.forEach(button => {
        button.onclick = function() {
            const digitValue = button.innerHTML
            onDigitButtonClicked(digitValue)
        }
    });


    // установка колбек-функций для кнопок операций
    document.getElementById("btn_op_mult").onclick = function() {
        if (a === '') return
        selectedOperation = '×'
        updateDisplay()
    }
    document.getElementById("btn_op_plus").onclick = function() {
        if (a === '') return
        selectedOperation = '+'
        updateDisplay()
    }
    document.getElementById("btn_op_minus").onclick = function() {
        if (a === '') return
        selectedOperation = '-'
        updateDisplay()
    }
    document.getElementById("btn_op_div").onclick = function() {
        if (a === '') return
        selectedOperation = '÷'
        updateDisplay()
    }


    document.getElementById("btn_op_percent").onclick = function() {
        if (a === '') return
        selectedOperation = '%'
        updateDisplay()
    }


    // кнопка очищения
    document.getElementById("btn_op_clear").onclick = function() {
        a = ''
        b = ''
        selectedOperation = ''
        expressionResult = ''
        outputElement.innerHTML = '0'
    }


    // КНОПКА УДАЛЕНИЯ ПОСЛЕДНЕГО СИМВОЛА
    document.getElementById("btn_op_backspace").onclick = function() {
        if (!selectedOperation) {
            a = a.slice(0, -1)
            outputElement.innerHTML = a || '0'
        } else {
            if (b === '') {
                selectedOperation = null
                outputElement.innerHTML = a || '0'
            } else {
                b = b.slice(0, -1)
                outputElement.innerHTML = b || '0'
            }
        }
    }


    // кнопка расчёта результата
    document.getElementById("btn_op_equal").onclick = function() {
        if (a === '' || !selectedOperation)
            return
       
        // ОБРАБОТКА ОПЕРАЦИИ ПРОЦЕНТА
        if (selectedOperation === '%') {
            if (b === '') {
                expressionResult = (+a) / 100
            } else {
                expressionResult = (+a) * (+b) / 100
            }
        } else {
            if (b === '') return
           
            // Обработка других операций
            switch(selectedOperation) {
                case '×':
                    expressionResult = (+a) * (+b)
                    break;
                case '+':
                    expressionResult = (+a) + (+b)
                    break;
                case '-':
                    expressionResult = (+a) - (+b)
                    break;
                case '÷':
                    expressionResult = (+a) / (+b)
                    break;
            }
        }
       
        a = expressionResult.toString()
        b = ''
        selectedOperation = null


        outputElement.innerHTML = a
    }
     const toggleBtn = document.getElementById("theme-toggle");
    toggleBtn.onclick = function () {
        document.body.classList.toggle("dark");
    }
    
            // Квадратный корень
    document.getElementById("btn_op_sqrt").onclick = function () {
        if (!selectedOperation && a !== '') {
            a = Math.sqrt(+a).toString();
            outputElement.innerHTML = a;
        } else if (b !== '') {
            b = Math.sqrt(+b).toString();
            updateDisplay();
        }
    };

    // Смена знака
    document.getElementById("btn_op_negate").onclick = function () {
        if (!selectedOperation && a !== '') {
            a = (-a).toString();
            outputElement.innerHTML = a;
        } else if (b !== '') {
            b = (-b).toString();
            updateDisplay();
        }
    };

    // Возведение в квадрат
    document.getElementById("btn_op_pow2").onclick = function () {
        if (!selectedOperation && a !== '') {
            a = Math.pow(+a, 2).toString();
            outputElement.innerHTML = a;
        } else if (b !== '') {
            b = Math.pow(+b, 2).toString();
            updateDisplay();
        }
    };

    // Факториал
    document.getElementById("btn_op_fact").onclick = function () {
        function factorial(n) {
            if (n < 0) return NaN;
            if (n === 0 || n === 1) return 1;
            let result = 1;
            for (let i = 2; i <= n; i++) result *= i;
            return result;
        }

        if (!selectedOperation && a !== '') {
            a = factorial(+a).toString();
            outputElement.innerHTML = a;
        } else if (b !== '') {
            b = factorial(+b).toString();
            updateDisplay();
        }
    };
};
