
load( "json2.js" );
load( "ladder-diagram.js" );

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


//print the file 
var i=0;
for ( i=0; i<numLines; i++ ) {
   // print( "line ",i,": ", lines[i] );
}

//print( "about to parse '" , lines.join(' ') , "'" );
var data = JSON.parse( lines.join(' ') );
//print( "stdin=", JSON.stringify( data ) );

//load( 'data.js' );
//print( "load =",JSON.stringify( data ) );

Ladder.compute_ladder(data);
result = Ladder.draw_ladder();

print( result );

