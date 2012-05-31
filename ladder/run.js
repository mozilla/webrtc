var parse_json = false;

load( "ladder-diagram.js" );
load( "ladder-parser.js");

var data;

if (parse_json) {
    // Load the file from stdin 
    var numLines = 0;
    var lines = new Array();
    do {
	lines[ numLines ] = readline();
	if ( lines[ numLines ] === "EOF" ) {
            lines.pop();
            break;
	}
	numLines++;
    } while ( true );

    data = JSON.parse( lines.join(' ') );
}
else {
    data = LadderParse.parse();
}

Ladder.compute_ladder(data);
result = Ladder.draw_ladder();

print( result );

