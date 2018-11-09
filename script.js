// Sliders Setup
var slider = document.getElementById("width-bar");
var output = document.getElementById("width-setting");
var slider2 = document.getElementById("height-bar");
var output2 = document.getElementById("height-setting");
output.innerHTML = slider.value; 
output2.innerHTML = slider2.value; 
createTable("test",slider.value,slider2.value)

slider.oninput = function() {
    output.innerHTML = this.value;
    createTable("test",this.value,slider2.value)
}
slider2.oninput = function() {
    output2.innerHTML = this.value;
    createTable("test",this.value,slider.value)
}

// $('input[type="button"]').click(function() {
//    createTable("test", $("#rows").val(), $("#cols").val());
//    // numberDiagonally("test");     
// });

// function numberDiagonally(tableId) {
//     var rows = document.getElementById(tableId).rows,
//         numRows = rows.length,
//         numCols = rows[0].cells.length,
//         sq = numRows + numCols - 1,
//         d, x, y,
//         i = 1,
//         dc,
//         c = -1,
//         colors = ["green","yellow","orange","red"];
    
//     diagonalLoop:
//     for (d = 0; d < sq; d++) {
//         dc = "diagonal" + d;
//         for (y = d, x = 0; y >= 0; y--, x++) {
//             if (x === numCols)
//                 continue diagonalLoop;
//             if (y < numRows)
//                 $(rows[y].cells[x]).html(i++).addClass(dc);
//         }
//     }
//     for (d = 0; d < sq; d++)
//         $(".diagonal" + d).css("background-color", colors[c=(c+1)%colors.length]);
// }

function createTable(tableId, rows, cols) {
    var x,y,
        o = [];
    for (y = 0; y < rows; y++){
        o.push("<tr>");
        for(x = 0; x < cols; x++)
            o.push("<td></td>");
        o.push("</tr>");
    }
    $("#" + tableId).html(o.join(""));
}