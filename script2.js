// Controls Setup
var widthInput = document.getElementById("width-input");
var width = document.getElementById("width-setting");
var heightInput = document.getElementById("height-input");
var height = document.getElementById("height-setting");
var minesNum = document.getElementById("mines-setting")
var minesInput = document.getElementById("mines-input");
width.innerHTML = widthInput.value; 
height.innerHTML = heightInput.value; 


widthInput.oninput = function() {
    width.innerHTML = this.value;
}

heightInput.oninput = function() {
    height.innerHTML = this.value;
}


class cell{
    constructor(row_index, col_index){
        this.col_index = col_index;
        this.row_index = row_index;
        this.cleared = false;
        this.bomb = false;
        this.flaged = false;
        this.adj_bomb_count = 0;
    }

    getAdjacentCount(){
        return this.adj_bomb_count;
    }

}

class playGround{
    constructor(row,column, mineNum){
        var playground = new Array(row);
        var mineInsert = mineNum;

        for (var i=0;i<row;i++){
            playground[i] = new Array(column);
        }

        for(var i=0;i<row;i++){
            for(var j=0;j<column;j++){
                playground[i][j] = new cell(i,j);
            }
        }
        while(mineInsert>0){
            var randRow = Math.floor(Math.random() * (row - 0) + 0);
            var randCol = Math.floor(Math.random() * (column - 0) + 0);
            if(playground[randRow][randCol].bomb != true){
                playground[randRow][randCol].bomb = true;
                for(var rowCheck=-1;rowCheck<=1;rowCheck++){
                    for(var colCheck=-1;colCheck<=1;colCheck++){
                        console.log('hello')
                        if(randRow+rowCheck>=0 && randRow+rowCheck<row && randCol+colCheck>=0 && randCol+colCheck<column){
                            playground[randRow+rowCheck][randCol+colCheck].adj_bomb_count++;
                        }
                    }
                }
                playground[randRow][randCol].adj_bomb_count=1000;
                // console.log('hello')
                mineInsert--;
            }
        }
        this.playground = playground;
    }

    getAdjacentCount(row,column){
        return this.playground[row][column].adj_bomb_count;
    }
}


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




function createTable(row, column, minesInput){
    var playground = new playGround(row, column, minesInput);
    var i,j,
        cells = [];
    for (i = 0; i < row; i++){
        cells.push(`<tr id="row-${i}">`);
        for(j = 0; j < column; j++)
            cells.push(`<td id="cell-${i}-${j}" 
                class="cell">${playground.getAdjacentCount(i,j)}</td>`);
        cells.push("</tr>");
    }

    $('#minefield').html(cells.join(""))
}


$('input[id="start-game"]').click(function() {
    if(minesInput.value > heightInput.value*widthInput.value-1){
        alert("Mission impossible")
    }else{
        minesNum.innerHTML=minesInput.value;
        timer.resetWatch();
        createTable(heightInput.value, widthInput.value, minesInput.value);
    }
});


