var gridSize = 5;
var puzzle;
var sol;
var puzNo = 0;
var puzTot = 0;
var ans;

$(document).ready(function(){
    console.log( "Starting" );
    $(function(){
        $("#check").click(function(){
            checkWin();
        });
    });
    $(function(){
        $("#reset").click(function(){
            resetBoard();
        });
    });
    $(function(){
        $("#next").click(function(){
            newGame();
        });
    });
    parseJson();
});

function setGameMode(inPuzNo, inGameSize) {
    puzNo = inPuzNo;
    gridSize = inGameSize;
    parseJson();
}

function parseJson(){
    console.log( "Called ParseJson" );
    $.getJSON('js/puzzles.json', function(data) {
        if (gridSize == 5) {
            puzzle = data.easy[puzNo].problem;
            sol = data.easy[puzNo].solution;
            puzTot = data.easy.length;
        } else if (gridSize == 7) {
            puzzle = data.medium[puzNo].problem;
            sol = data.medium[puzNo].solution;
            puzTot = data.medium.length;
        } else if (gridSize == 9) {
            puzzle = data.hard[puzNo].problem;
            sol = data.hard[puzNo].solution;
            puzTot = data.hard.length;
        }
        ans = new Array((gridSize*gridSize)+1).join('0').split('').map(parseFloat);
        console.log( "Answer: " + ans );
        $('#puzCount').empty();
        $('#puzCount').append("Puzzle: " + (puzNo+1) + "/" + puzTot);
    }).done(function() {
    initGame();
    });
}

function initGame(){
    $("#game_map").empty();
    for(var i=0; i<gridSize*gridSize;++i)
    {
        var cellVal = "<div></div>";
        if (puzzle[i] != 0) {
            cellVal = "<div>"+puzzle[i]+"</div>";
        }
        var cell = $(cellVal)
            .addClass("cell "+i)
            .appendTo("#game_map");

        if (gridSize == 5) {
            cell.addClass("easy");
        } else if (gridSize == 7) {
            cell.addClass("medium");
        } else if (gridSize == 9) {
            cell.addClass("hard");
        }

        if (puzzle[i] == 0) {
            cell
                .addClass("empty")
                .bind("click", playMove)
                .bind('mouseover', hoverCell)
                .bind('mouseout', leaveCell);
        }

        // Add the line breaks
        if ( i % gridSize === 0 ){
            cell.before('<div class="clear"></div>');
        }

    }
};

function playMove(){
	var cell = $(this);
	cell
		.trigger("mouseout")

    if( cell.hasClass("empty") ) {
        cell.removeClass("empty").addClass("filled");
    } else {
        cell.removeClass("filled").addClass("empty");
    }

    for(var i=0; i<gridSize*gridSize;++i) {
        if(cell.hasClass(i)) {
            if(cell.hasClass("filled")) {
                ans[i] = 1;
            } else {
                ans[i] = 0;
            }
        }
    }

	return false;
};

function hoverCell(){
	$(this).addClass("hover");
	return false;
};

function leaveCell(){
	$(this).removeClass("hover");
	return false;
};

function checkArrays( arrA, arrB ){

    for(var i=0;i<arrA.length;i++){
         if(arrA[i]!==arrB[i]) return false;
    }

    return true;

}

function resetBoard() {
    clearAnswer();
    parseJson();
}

function newGame() {
    puzNo++;
    clearAnswer();
    parseJson();
}

function clearAnswer(){
    for(var i=0; i<gridSize*gridSize;++i) {
        ans[i] = 0;
    }
}

function checkWin() {
    console.log( "Answer Solution Comparison: " + checkArrays(sol, ans) );
    console.log( "Solution: " + sol );
    console.log( "Answer: " + ans );
    if (checkArrays(sol, ans)) {
        $(".cell").unbind("click");
        alert('You\'ve Solved It!');
    }
};

function overlay(inId) {
	el = document.getElementById(inId);
	el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}
