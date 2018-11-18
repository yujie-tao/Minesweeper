// Controls Setup
$(function(){
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

    var playground = createTable(heightInput.value, widthInput.value, minesInput.value);
    var rows = heightInput.value;
    var columns = widthInput.value;

    $('input[id="start-game"]').click(function() {
        if(minesInput.value > heightInput.value*widthInput.value-1){
            alert("Mission impossible")
        }else{
            minesNum.innerHTML=minesInput.value;
            timer.resetWatch();
            playground = createTable(heightInput.value, widthInput.value, minesInput.value);
            rows = heightInput.value;
            columns = widthInput.value;
            gamePlay();
        }
    });

    function createTable(row, column, minesInput){
        var playground = new PlayGround(row, column, minesInput);
        var i,j,
            cells = [];
        for (i = 0; i < row; i++){
            cells.push(`<tr id="row-${i}">`);
            for(j = 0; j < column; j++)
                cells.push(`<td id="cell-${i}-${j}" 
                    class="cell"></td>`);
            cells.push("</tr>");
        }

        $('#minefield').html(cells.join(""))
        return playground;
    }

    function gamePlay(){
        $(".cell").click(function(){
            timer.start();
            rowIndex = $(this).attr("id").split("-")[1];
            colIndex = $(this).attr("id").split("-")[2];
            if(event.shiftKey){
                if(playground.getFlagged(rowIndex,colIndex)){
                    playground.setFlagged(rowIndex,colIndex,false);
                    // $(this).removeClass("marked");
                }else{
                    playground.setFlagged(rowIndex,colIndex,true);
                    // $(this).addClass("marked");
                }
            }else{
                if(playground.getBomb(rowIndex,colIndex)&&playground.getFlagged(rowIndex,colIndex)==false){
                    $('#cell-'+rowIndex+'-'+colIndex).text('x');
                    gameOver();
                }else{
                    if(playground.getAdjacentCount(rowIndex,colIndex)>0 && playground.getFlagged(rowIndex,colIndex)==false){
                        $('#cell-'+rowIndex+'-'+colIndex).text(playground.getAdjacentCount(rowIndex,colIndex)); 
                        if(playground.getCleared(rowIndex,colIndex)==true){
                            checkAround(rowIndex,colIndex);
                        }else{
                            playground.setCleared(rowIndex,colIndex);
                            // $(this).addClass("cleared");
                        }
                    }
                    if(playground.getAdjacentCount(rowIndex,colIndex)==0){
                        ripple(rowIndex,colIndex);
                    }
                }
            }

            checkWin();
        });
    }

    function checkAround(rowIndex,colIndex){
        var flags=0;
        var rowIndex = parseInt(rowIndex);
        var colIndex = parseInt(colIndex);
        for(var rowCheck=-1;rowCheck<=1;rowCheck++){
            for(var colCheck=-1;colCheck<=1;colCheck++){
                if(rowIndex+rowCheck>=0 && rowIndex+rowCheck<rows && colIndex+colCheck>=0 && colIndex+colCheck<columns){
                    console.log(rowIndex+rowCheck)
                    console.log(colIndex+colCheck)
                    if(playground.getFlagged(rowIndex+rowCheck,colIndex+colCheck)){
                        flags++;
                    }
                }    
            }
        }

        if(flags==playground.getAdjacentCount(rowIndex,colIndex)){
            for(var rowCheck=-1;rowCheck<=1;rowCheck++){
                for(var colCheck=-1;colCheck<=1;colCheck++){
                    if(rowIndex+rowCheck>=0 && rowIndex+rowCheck<rows && colIndex+colCheck>=0 && colIndex+colCheck<columns){
                        if(rowIndex!=0&&colIndex!=0 && playground.getCleared(rowIndex+rowCheck,colIndex+colCheck)==false){
                            $('#cell-'+(rowIndex+rowCheck)+'-'+(colIndex+colCheck)).click();
                        }
                    }    
                }
            }
        }
    }

    function ripple(rowIndex,colIndex){
        var rowIndex = parseInt(rowIndex);
        var colIndex = parseInt(colIndex);

        if(playground.getFlagged(rowIndex,colIndex)==false){
            // $('#cell-'+rowIndex+'-'+colIndex).addClass("cleared");
            playground.setCleared(rowIndex,colIndex);
        }
        if(playground.getAdjacentCount(rowIndex,colIndex)>0){
            if(playground.getFlagged(rowIndex,colIndex)==false){
                playground.setCleared(rowIndex,colIndex);
                $('#cell-'+rowIndex+'-'+colIndex).addClass("cleared");
                $('#cell-'+rowIndex+'-'+colIndex).text(playground.getAdjacentCount(rowIndex,colIndex));
            }
             return;
        }
        for(var rowCheck=-1;rowCheck<=1;rowCheck++){
            for(var colCheck=-1;colCheck<=1;colCheck++){
                if(rowIndex+rowCheck>=0 && rowIndex+rowCheck<rows && colIndex+colCheck>=0 && colIndex+colCheck<columns){
                    if(rowCheck==0&&colCheck==0){
                        continue;
                    }

                    if(playground.getCleared(rowIndex+rowCheck,colIndex+colCheck)){
                        continue;
                    }

                    // if($('#cell-'+(rowIndex+rowCheck)+'-'+(colIndex+colCheck)).hasClass("cleared")==true){
                    //     continue;
                    // }
                    ripple(rowIndex+rowCheck,colIndex+colCheck);
                }
            }
        }       
    }

    function checkWin(){
        for(var i=0;i<rows;i++){
            for(var j=0;j<columns;j++){
                if(playground.getBomb(i,j)&&playground.getFlagged(i,j)==false){
                    return;
                }
                if(playground.getBomb(i,j)==false&&playground.getFlagged(i,j)){
                    return;
                }
                if(playground.getBomb(i,j)==false&&playground.getCleared(i,j)==false){
                    return;
                }
            }
        }
        gameWin();
    }

    function gameWin(){
        timer.stop();
        setTimeout( function(){
            alert("You Win")
            location.reload();
        }, 300 );

    }

    function gameOver(){
        timer.stop();
        for(var i=0;i<rows;i++){
                for(var j=0;j<columns;j++){
                    if(playground.getBomb(i,j)){
                        $('#cell-'+i+'-'+j).addClass('bomb'); 
                    }else{
                        $('#cell-'+i+'-'+j).addClass('cleared'); 
                        if(playground.getAdjacentCount(i,j)>0){
                            $('#cell-'+i+'-'+j).text(playground.getAdjacentCount(i,j));
                        }
                    }
                }
            }
        setTimeout( function(){
            alert("Game Over")
            location.reload();
        }, 300 );
    }

})

class Cell{
    constructor(row_index, col_index){
        this.col_index = col_index;
        this.row_index = row_index;
        this.cleared = false;
        this.bomb = false;
        this.flagged = false;
        this.adj_bomb_count = 0;
    }

}

class PlayGround{
    constructor(row,column, mineNum){
        var playground = new Array(row);
        var mineInsert = mineNum;

        for (var i=0;i<row;i++){
            playground[i] = new Array(column);
        }

        for(var i=0;i<row;i++){
            for(var j=0;j<column;j++){
                playground[i][j] = new Cell(i,j);
            }
        }
        while(mineInsert>0){
            var randRow = Math.floor(Math.random() * (row - 0) + 0);
            var randCol = Math.floor(Math.random() * (column - 0) + 0);
            if(playground[randRow][randCol].bomb != true){
                playground[randRow][randCol].bomb = true;
                for(var rowCheck=-1;rowCheck<=1;rowCheck++){
                    for(var colCheck=-1;colCheck<=1;colCheck++){
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

    getBomb(row,column,status){
        return this.playground[row][column].bomb;
    }

    getAdjacentCount(row,column){
        return this.playground[row][column].adj_bomb_count;
    }

    getFlagged(row,column){
        return this.playground[row][column].flagged;
    }

    setFlagged(row,column,status){
        this.playground[row][column].flagged=status;
        if(status==true){
            $('#cell-'+row+'-'+column).addClass("marked");
        }else{
            $('#cell-'+row+'-'+column).removeClass("marked");
        }
    }

    getCleared(row,column){
        return this.playground[row][column].cleared;
    }

    setCleared(row,column){
        this.playground[row][column].cleared=true;
        $('#cell-'+row+'-'+column).addClass("cleared");
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

