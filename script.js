// Controls Setup
var widthInput = document.getElementById("width-input");
var width = document.getElementById("width-setting");
var heightInput = document.getElementById("height-input");
var height = document.getElementById("height-setting");
var minesInput = document.getElementById("mines-input");
width.innerHTML = widthInput.value; 
height.innerHTML = heightInput.value; 
createTable("minefield",heightInput.value, widthInput.value, minesInput.value)


widthInput.oninput = function() {
    width.innerHTML = this.value;
}

heightInput.oninput = function() {
    height.innerHTML = this.value;
}

$('input[id="start-game"]').click(function() {
	if(minesInput.value > heightInput.value*widthInput.value-1){
		alert("Mission impossible")
	}else{
		// console.log(minesInput.value)
		timer.resetWatch();
		createTable("minefield", heightInput.value, widthInput.value, minesInput.value);
	}
});


function gamePlay(){
	$( ".cell" ).click(function() {
		// $(this).css('backgroundColor', 'black');
		this.innerHTML=this.attributes[1].value;
		$(this).css({'backgroundColor':'black', "color":"white"});
    	timer.start();  	
	});
	$( ".bomb" ).click(function() {
		this.innerHTML='b';
		$(this).css({'backgroundColor':'red', "color":"white"});
	});
}

function createTable(minefield, rows, cols, minesInput) {
    var i,j,
        cells = [];
    for (i = 0; i < rows; i++){
        cells.push("<tr>");
        for(j = 0; j < cols; j++)
            cells.push("<td></td>");
        cells.push("</tr>");
    }
    $("#" + minefield).html(cells.join(""));
    $( "td" ).addClass( "cell" );
    $(".cell").attr("data-adjacent-bombs", 0);
    assignMines(rows,cols,minesInput);
    gamePlay();
}

function assignMines(rows, cols, minesInput){
	var cell = document.getElementsByClassName('cell');
		rowNum = parseInt(rows);
		colNum = parseInt(cols);
		size = rowNum*colNum;
		i = minesInput;
	while(i>0){
		random = Math.floor(Math.random() * (size - 0) + 0);
		if($(cell[random]).hasClass('bomb')){
			continue;
		}else{
			$(cell[random]).addClass('bomb');
			if(random+colNum<size){
				cell[random+colNum].attributes[1].value = parseInt(cell[random+colNum].attributes[1].value)+1;
				// cell[random+colNum].innerHTML = cell[random+colNum].attributes[1].value;
			}
			if(random-colNum>=0){
				cell[random-colNum].attributes[1].value = parseInt(cell[random-colNum].attributes[1].value)+1;
				// cell[random-colNum].innerHTML = cell[random-colNum].attributes[1].value;
			}
			if((random+1)%colNum!=0){
				cell[random+1].attributes[1].value = parseInt(cell[random+1].attributes[1].value)+1;
				// cell[random+1].innerHTML = cell[random+1].attributes[1].value;
			}
			if(random-1>=0 && random%colNum!=0){
				cell[random-1].attributes[1].value = parseInt(cell[random-1].attributes[1].value)+1;
				// cell[random-1].innerHTML = cell[random-1].attributes[1].value;
			}
			if((random+colNum+1)<size && (random+colNum+1)%colNum!=0){
				cell[random+colNum+1].attributes[1].value = parseInt(cell[random+colNum+1].attributes[1].value)+1;
				// cell[random+colNum+1].innerHTML = cell[random+colNum+1].attributes[1].value;
			}
			if((random+colNum-1)<size && (random+colNum)%colNum!=0){
				cell[random+colNum-1].attributes[1].value = parseInt(cell[random+colNum-1].attributes[1].value)+1;
				// cell[random+colNum-1].innerHTML = cell[random+colNum-1].attributes[1].value;
			}
			if((random-colNum+1)>=0 && (random-colNum+1)%colNum!=0){
				cell[random-colNum+1].attributes[1].value = parseInt(cell[random-colNum+1].attributes[1].value)+1;
				// cell[random-colNum+1].innerHTML = cell[random-colNum+1].attributes[1].value;
			}
			if((random-colNum-1)>=0 && (random-colNum)%colNum!=0){
				cell[random-colNum-1].attributes[1].value = parseInt(cell[random-colNum-1].attributes[1].value)+1;
				// cell[random-colNum-1].innerHTML = cell[random-colNum-1].attributes[1].value;
			}
		}

		i--
	}

	for(var j = 0;j<minesInput;j++){
		document.getElementsByClassName('bomb')[j].attributes[1].value = 1000;
		// document.getElementsByClassName('bomb')[j].innerHTML = document.getElementsByClassName('bomb')[j].attributes[1].value;
	}
}

//Set up timer
class Timer {
    constructor(display, results) {
        this.running = false;
        this.display = display;
        this.results = results;
        this.reset();
        this.print(this.times);
    }

    
    reset() {
        this.times = [ 0, 0, 0 ];
    }

    resetWatch(){
    	this.times = [0,0,0]
    	this.running = false;
    	this.time = null;
    	this.print(this.times);
    }
    
    start() {
        if (!this.time) this.time = performance.now();
        if (!this.running) {
            this.running = true;
            requestAnimationFrame(this.step.bind(this));
        }
    }
 
    stop() {
        this.running = false;
        this.time = null;
    }

    
    step(timestamp) {
        if (!this.running) return;
        this.calculate(timestamp);
        this.time = timestamp;
        this.print();
        requestAnimationFrame(this.step.bind(this));
    }
    
    calculate(timestamp) {
        var diff = timestamp - this.time;
        // Hundredths of a second are 100 ms
        this.times[2] += diff / 10;
        // Seconds are 100 hundredths of a second
        if (this.times[2] >= 100) {
            this.times[1] += 1;
            this.times[2] -= 100;
        }
        // Minutes are 60 seconds
        if (this.times[1] >= 60) {
            this.times[0] += 1;
            this.times[1] -= 60;
        }
    }
    
    print() {
        this.display.innerText = this.format(this.times);
    }
    
    format(times) {
        return `\
        ${pad0(times[0], 2)}:\
        ${pad0(times[1], 2)}`;
    }
}

function pad0(value, count) {
    var result = value.toString();
    for (; result.length < count; --count)
        result = '0' + result;
    return result;
}

let timer = new Timer(
    document.querySelector('.timer'));

// $(document).ready(function() {
// 	$( ".cell" ).click(function() {
// 		this.innerHTML=this.attributes[1].value;
// 		$(this).css({'backgroundColor':'black', "color":"white"});
// 		timer.start();
// 	});

// 	$( ".bomb" ).click(function() {
// 		this.innerHTML=this.attributes[1].value;
// 		$(this).css({'backgroundColor':'red', "color":"white"});
// 	});
// });