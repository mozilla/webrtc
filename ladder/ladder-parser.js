/*
 * Parse the Ladder diagram input. This syntax is largely compatible with
 * WSD (aspirationally, it will parse anything that WSD would parse 
 * in mid-2012).
 *  
 * Current syntax:
 * 
 * 'participant' <participant-name> 'as' <participant-handle>
 * <participant-handle> [->|<->] <participant-handle> ':' <message>  [ <options> ]
 * 
 * <options> ::= '[' <option> [ '=' <value>], ... ']' ]
 * 
 */

// Maybe something cooler than regexps would be cool here.
// I miss yacc.
var LadderParse = function() {
    var identifier_re = '[A-Za-z0-9_\\- \\(\\)]+';
    var words_re = '[^\\[\\]]+';
    var options_re = '(.*)\s+(\[[^\]]+\])$'
    var participant_re = '^participant\\s+(' + words_re + ')\\s+as\\s+(' + identifier_re + ')';
    var arrow_re = '^(' + identifier_re + ')\\s+(<?->)\\s+(' + identifier_re + ')\\s+(' + words_re + ')';
        
    var handlers = {
    };


    var parse_participant = function(json, m, o) {
	


    };
    handlers[participant_re] = parse_participant;
    
    var parse_arrow = function(json, m, o) {
	


    };
    handlers[arrow_re] = parse_arrow;

    
    var parse = function() {
	var json = {
	    participants:[],
	    data:[]
	};

	var m;
	var opt = null;
	var l;
	var l_orig;
	var line_ct = 0;
	var match = false;

	while(l = readline()) {
	    line_ct++;
	    l_orig = l;
//	    l = l.strip();

	    // First pull the options off
	    if (m = l.match(options_re)) {
		// There are options
		l = m[1];
		opt = m[2];
	    }

	    // Now we can parse the start of the line as expected
	    for (var r in handlers) {
		print(r);
		if (m = l.match(r)) {
		    handlers[r](json, m, opt);
		    match = true;
		    break;
		}
	    }
	    if (!match)
		throw "No match at line " + line_ct + ' :' + l_orig;
	}

	return json;
    };

    return {
	parse : parse
    };
}();
