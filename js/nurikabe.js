var num_of_cols = num_of_rows = 5;
var puzzle;
var sol;
var puzNo = 0;
var puzTot = 0;
var ans =    [0, 0, 0, 0, 0,
              0, 0, 0, 0, 0,
              0, 0, 0, 0, 0,
              0, 0, 0, 0, 0,
              0, 0, 0, 0, 0 ];



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

function parseJson(){
    $.getJSON('js/puzzles.json', function(data) {
        puzzle = data.puzzles[puzNo].problem;
        sol = data.puzzles[puzNo].solution;
        puzTot = data.puzzles.length;
        $('#puzCount').empty();
        $('#puzCount').append("Puzzle: " + (puzNo+1) + "/" + puzTot);
    }).done(function() {
    initGame();
    });
}

function initGame(){
    $("#game_map").empty();
    for(var i=0; i<num_of_cols*num_of_rows;++i)
    {
        var cellVal = "<div></div>";
        if (puzzle[i] != 0) {
            cellVal = "<div>"+puzzle[i]+"</div>";
        }
        var cell = $(cellVal)
            .addClass("cell "+i)
            .appendTo("#game_map");

        if (puzzle[i] == 0) {
            cell
                .addClass("empty")
                .bind("click", playMove)
                .bind('mouseover', hoverCell)
                .bind('mouseout', leaveCell);
        }

        // Add the line breaks
        if ( i % num_of_cols === 0 ){
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

    for(var i=0; i<num_of_cols*num_of_rows;++i) {
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
    for(var i=0; i<num_of_cols*num_of_rows;++i) {
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
