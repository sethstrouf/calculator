const displayer = {
    screen : document.querySelector("#screen"),

    updateScreen : function(message) {
        if(receiver.hasDot===true)
             message = Number(message).toFixed(2);
        if(message.toString().length > 9) {
            this.screen.style.fontSize = "2.5rem";
            this.screen.style.color = "red";
            this.screen.style.justifyContent = "center";
            message = "ERROR: ANSWER TOO LONG";
            this.screen.textContent = message;
            processor.clear();
        } else {        
        this.screen.textContent = message;
        }
    },

    turnOnBorder: function(id) {
        let button = document.getElementById(id);
        button.style.boxShadow = "0px 0px 5px 5px #0083b3";
    },

    turnOffBorders: function() {
        document.getElementById("add").style.boxShadow = "0px 0px 3px 1px #000000";
        document.getElementById("subtract").style.boxShadow = "0px 0px 3px 1px #000000";
        document.getElementById("multiply").style.boxShadow = "0px 0px 3px 1px #000000";
        document.getElementById("divide").style.boxShadow = "0px 0px 3px 1px #000000";
    }
}

const receiver = {
    hasDot : false,
    isFirstInput : true,
    isSecondInput : false,
    keys : document.querySelectorAll(".key"),

    getInput : function() {
        this.keys.forEach(key => {
            key.addEventListener("click", function() {
                let message = processor.processInput(key.textContent);
                //this style reset is so I can have a red error message when answer is too long
                displayer.screen.style.fontSize = "8rem";
                displayer.screen.style.color = "black";
                displayer.screen.style.justifyContent = "flex-end";
                displayer.updateScreen(message);
            });
        });
    },
}

const processor = {
    inputArray : [], 
    answer : 0,
    toAdd : false,
    toSub : false,
    toMult : false,
    toDiv : false,
    firstNum : true,

    turnOffBools : function() {
        toAdd = false;
        toSub = false;
        toMult =  false;
        toDiv = false;
    },

    processInput : function(symbol) {
        if(symbol==="+") {
            return this.add();
        } else if(symbol==="-") {
            return this.subtract();
        } else if(symbol==="*") {
            return this.multiply();
        } else if(symbol==="÷") {
            return this.divide();
        } else if(symbol==="=") { 
            return this.equals();
        } else if(symbol==="Clear") {
            message = this.clear();
        } else if (symbol==="⬅") {
            message = this.backspace(symbol);
        } else if(!isNaN(symbol) || symbol===".") {
            message = this.updateArrays(symbol);
        }
            return message;
    },

    updateArrays : function(symbol, r) {
        if(receiver.isFirstInput===true && this.inputArray.length<9) {
            if(symbol==="." && receiver.hasDot===false) {
                this.inputArray.push(symbol);
                receiver.hasDot = true;
                message = this.inputArray.join("");
            } else if (symbol>=0 && symbol <=9) {
                this.inputArray.push(symbol);
                message = this.inputArray.join("");
            }
        } else if(receiver.isSecondInput===true && this.inputArray.length<9) {
            if(symbol==="." && receiver.hasDot===false) {
                this.secondArray.push(symbol);
                receiver.hasDot = true;
                message = this.secondArray.join("");
            } else if (symbol>=0 && symbol <=9) {
                this.secondArray.push(symbol);
                message = this.secondArray.join("");
            }
        }
        return message;
    },

    clear : function() {
        displayer.turnOffBorders();
        this.inputArray = [];
        this.answer = 0;
        receiver.hasDot = false;
        this.firstNum = true;
        this.turnOffBools();

        return "";
    },

    backspace : function () {
        if(this.inputArray[this.inputArray.length-1]===".")
            receiver.hasDot = false;
        this.inputArray.pop();
        return this.inputArray.join("");
    },

    add : function() {
        displayer.turnOffBorders();
        displayer.turnOnBorder("add");
        receiver.hasDot = false;
        this.turnOffBools();
        this.toAdd = true;

        this.answer += Number(this.inputArray.join(""));
        this.inputArray = [];
        return this.answer;
    },

    subtract : function () {
        displayer.turnOffBorders();
        displayer.turnOnBorder("subtract");
        receiver.hasDot = false;
        this.turnOffBools();
        this.toSub = true;

        if(this.firstNum===true) {
            this.firstNum = false;
            this.answer = Number(this.inputArray.join(""));
        } else {
        this.answer -= Number(this.inputArray.join(""));
        }
        this.inputArray = [];
        return this.answer;
    },

    multiply : function () {
        displayer.turnOffBorders();
        displayer.turnOnBorder("multiply");
        receiver.hasDot = false;
        this.turnOffBools();
        this.toMult = true;

        if(this.firstNum === true) {
            this.answer = 1;
            this.firstNum = false;
        }
        this.answer *= Number(this.inputArray.join(""));
        this.inputArray = [];
        return this.answer;
    },

    divide : function() {
        displayer.turnOffBorders();
        displayer.turnOnBorder("divide");
        receiver.hasDot = false;
        this.turnOffBools();
        this.toDiv = true;

        if(this.firstNum === true) {
            this.answer = 1;
            this.answer = Number(this.inputArray.join("")) / this.answer;
            this.firstNum = false;
            this.inputArray = [];
            return this.answer;
        }

        if(Number(this.inputArray.join("")) === 0)
            return "Can't ÷ 0!";

        this.answer /= Number(this.inputArray.join(""));
        this.inputArray = [];
        return this.answer;
    },

    equals : function () {
        displayer.turnOffBorders();

        if(this.toAdd===true) {
            this.answer += Number(this.inputArray.join(""));
            this.inputArray = [];
            this.toAdd = false;
        }
        if(this.toSub===true) {
            this.answer -= Number(this.inputArray.join(""));
            this.inputArray = [];
            this.toSub = false;
        }
        if(this.toMult===true) {
            this.answer *= Number(this.inputArray.join(""));
            this.inputArray = [1];
            this.toMult = false;
        }
        if(this.toDiv===true) {
            if(Number(this.inputArray.join("")) === 0)
                return "Can't ÷ 0!";
            this.answer /= Number(this.inputArray.join(""));
            this.inputArray = [1];
            this.toDiv = false;
        }

        return this.answer;
    },
}

receiver.getInput();