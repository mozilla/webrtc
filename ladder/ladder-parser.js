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
    var options_re = '(.*)\\s+(\\[([^\\]]+)\\])$';
    var participant_re = '^participant\\s+(' + words_re + ')\\s+as\\s+(' + identifier_re + ')';
    var arrow_re = '^(' + identifier_re + ')\\s*(<?->)\\s*(' + identifier_re + ')\\s*:\\s*(' + words_re + ')';

    var die = function(msg) {
	print("ERROR: "+ msg);
	throw msg;
    };

    var handlers = {
    };


    var parse_participant = function(json, m, o) {
	json.participants.push([m[2], m[1]]);
    };
    handlers[participant_re] = parse_participant;
    
    var parse_arrow = function(json, m, o) {
	var from = m[1];
	var type = m[2] === "<->" ? DARROW : ARROW;
	var to = m[3];
	var msg = m[4];

	var opt = o || {};
	// Canonicalize options
	if (opt.duration !== undefined) {
	    opt.duration = parseInt(opt.duration, 10);
	}
	if (opt.advance !== undefined) {
	    opt.advance = parseInt(opt.advance,10);
	}

	json.data.push([type, from, to, msg, opt]);
    };
    handlers[arrow_re] = parse_arrow;

    var parse_options = function(opts) {
	// Options are a sequence of comma-separated values, with optional
	// assignment, i.e., a, b=c, d=f
	var lst = opts.split(',');
	var retval = {};

	lst.forEach(function(opt) {
			var m = opt.match('^\\s*(\\w+)\\s*(=\\s*(\\w+))?\\s*$');
			if (!m) {
			    die("Invalid option: " + opt);
			}
			retval[m[1]] = m[3] || true;
		    });

	return retval;
    };
    
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
	    
	    opt = null;

	    // First pull the options off
	    if (m = l.match(options_re)) {
		// There are options
		l = m[1];
		opt = parse_options(m[3]);
	    }

	    // Now we can parse the start of the line as expected
	    match = false;
	    for (var r in handlers) {
		if (m = l.match(r)) {
		    handlers[r](json, m, opt);
		    match = true;
		    break;
		}
	    }
	    if (!match)
		die("No match at line " + line_ct + ' :' + l_orig);
	}

//	print(JSON.stringify(json));
	return json;
    };

    return {
	parse : parse
    };
}();
