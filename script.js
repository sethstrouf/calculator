const displayer = {
    screen : document.querySelector("#screen"),

    /* Limit decimal place to two digits, display error, or content */
    updateScreen : function(output) {
        if(receiver.hasDot===true)
             output = Number(output).toFixed(2);

        if(output.toString().length > 9) {
            this.screen.style.fontSize = "2.5rem";
            this.screen.style.color = "red";
            this.screen.style.justifyContent = "center";
            /* Otherwise this won't print because the string is longer than 9 */
            if (output !== "Can't ÷ 0!")
                output = "ERROR: ANSWER TOO LONG";
            this.screen.textContent = output;
            processor.clear();
        } else {        
            /* styles so it doesn't stay red after error */
            displayer.screen.style.fontSize = "8rem";
            displayer.screen.style.color = "black";
            displayer.screen.style.justifyContent = "flex-end";
            this.screen.textContent = output;
        }
    },

    /* Turn on blue border when button is pressed */
    turnOnBorder: function(id) {
        let button = document.getElementById(id);
        button.style.boxShadow = "0px 0px 5px 5px #0083b3";
    },

    /* Turn off blue border when not active */
    turnOffBorders: function() {
        document.getElementById("add").style.boxShadow = "0px 0px 3px 1px #000000";
        document.getElementById("subtract").style.boxShadow = "0px 0px 3px 1px #000000";
        document.getElementById("multiply").style.boxShadow = "0px 0px 3px 1px #000000";
        document.getElementById("divide").style.boxShadow = "0px 0px 3px 1px #000000";
    }
}

const receiver = {
    hasDot : false,
    keys : document.querySelectorAll(".key"),

    getInput : function() {
        this.keys.forEach(key => {
            key.addEventListener("click", function() {
                let output = processor.processInput(key.textContent);
                displayer.updateScreen(output);
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
            if (symbol==="+")
                return this.add();
            if(symbol==="-")
                return this.subtract();
            if(symbol==="*")
                return this.multiply();
            if(symbol==="÷")
                return this.divide();
            if (symbol==="⬅")
                return this.backspace();
            if(symbol==="=") 
                    return this.equals();
            if(symbol==="Clear")
                return this.clear();
        
        if(!isNaN(symbol) || symbol===".") {
            return this.updateArrays(symbol);
        } 
    },

    updateArrays : function(symbol, r) {
        /* Make sure there's still room on calc screen */
        if(this.inputArray.length<9) {
            /* Add dot to array if there isn't already one */
            if(symbol==="." && receiver.hasDot===false) {
                this.inputArray.push(symbol);
                receiver.hasDot = true;
                message = this.inputArray.join("");
            } else if (symbol>=0 && symbol <=9) {
                this.inputArray.push(symbol);
                message = this.inputArray.join("");
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

        return "0";
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


        if(this.firstNum === true)
            this.firstNum = false;
        
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

        if(this.firstNum === true) {
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

        if(this.firstNum === true && this.inputArray.length !== 0) {
            this.answer = 1;
            this.firstNum = false;
        }

        if(this.inputArray.length === 0 && this.answer !== 0) {
            this.inputArray.push(1)
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

        if(this.inputArray.length === 0 && this.answer !== 0) {
            this.inputArray.push(1)
        }

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
            this.inputArray = [];
            this.toMult = false;
        }
        if(this.toDiv===true) {
            if(Number(this.inputArray.join("")) === 0) {
                return "Can't ÷ 0!";
            }
            this.answer /= Number(this.inputArray.join(""));
            this.inputArray = [];
            this.toDiv = false;
        }

        return this.answer;
    },
}

displayer.updateScreen(0)
receiver.getInput();