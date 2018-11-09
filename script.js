// Sliders Setup
var widthSlider = document.getElementById("width-bar");
var width = document.getElementById("width-setting");
var heightSlider = document.getElementById("height-bar");
var height = document.getElementById("height-setting");
width.innerHTML = widthSlider.value; 
height.innerHTML = heightSlider.value; 
createTable("minefield",widthSlider.value,heightSlider.value)

widthSlider.oninput = function() {
    width.innerHTML = this.value;
    createTable("minefield",heightSlider.value,this.value)
}
heightSlider.oninput = function() {
    height.innerHTML = this.value;
    createTable("minefield",this.value,widthSlider.value)
}

function createTable(minefield, rows, cols) {
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
}

//Set up timer
class Stopwatch {
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

//Test timer
let stopwatch = new Stopwatch(
    document.querySelector('.stopwatch'));

$( ".cell" ).click(function() {
	$(this).css('backgroundColor', '#999');
	stopwatch.start();
});
