/*
 * Parse the Ladder diagram input. This syntax is largely compatible with
 * WSD (aspirationally, it will parse anything that WSD would parse 
 * in mid-2012).
 *  
 * Current syntax:
 * 
 * 'participant' <participant-name> 'as' <participant-handle>
 * <participant-handle> [->|<->] <participant-handle> ':' <message>  [ <options> ]
 * 'advance' <number>
 * 
 * <options> ::= '[' <option> [ '=' <value>], ... ']' ]
 * 
 */

var die = function(msg) {
    print("ERROR: "+ msg);
    throw msg;
};

var DEBUG = false;

var debug = function(msg) {
    if (DEBUG)
        print("DEBUG: " + msg);
};

// Maybe something cooler than regexps would be cool here.
// I miss yacc.
var LadderParse = function() {
    var identifier_re = '[A-Za-z0-9_\\- \\(\\)@]+';
    var words_re = '[^\\[\\]]+';
    var timepoint_re = '(([A-Za-z0-9]+)\s*:)?';
    var options_re = '(.*)\\s*(\\[([^\\]]+)\\])$';
    var participant_re = '^participant\\s+(' + words_re + ')\\s+as\\s+(' + identifier_re + ')';
    var arrow_re = '^' + timepoint_re + '\\s*(' + identifier_re + ')\\s*(<?->)\\s*(' + identifier_re + ')\\s*:\\s*(' + words_re + ')';
    var advance_re = '^advance\\s+(\\d+)';
    
    var handlers = {
    };

    var parse_participant = function(json, m, o) {
	json.participants.push([m[2].trim(), m[1].trim()]);
    };
    handlers[participant_re] = parse_participant;
    
    var parse_arrow = function(json, m, o) {
        
        var timepoint = m[2];
	var from = m[3].trim();
	var type = m[4] === "<->" ? DARROW : ARROW;
	var to = m[5].trim();
	var msg = m[6];

	var opt = o || {};
	// Canonicalize options
	if (opt.duration !== undefined) {
	    opt.duration = parseInt(opt.duration, 10);
	}
	if (opt.advance !== undefined) {
	    opt.advance = parseInt(opt.advance,10);
	}

        debug("TIMEPOINT " + m[2]);
        if (m[2])
            opt.timepoint = m[2];

	json.data.push([type, from, to, msg, opt]);
    };
    handlers[arrow_re] = parse_arrow;

    var parse_advance = function(json, m, o) {
        var advance;
        
        advance = parseInt(m[1], 10);
        if (isNaN(advance))
            die("Couldn't parse advance " + m[0]);
        json.data.push([ADVANCE, 2]);
    };
    handlers[advance_re] = parse_advance;

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

	while(true) {
            l = readline();
            debug(l);
            if (l === "EOFEOFEOFEOFEOFEOFEOFEOFEOFEOF")
                break;

            if (l.match('^\\s*$')) // Blank line
                continue;
            if (l.match('#.*')) // Comment
                continue;

	    line_ct++;
	    l_orig = l;
	    
	    opt = {};

	    // First pull the options off
	    if (m = l.match(options_re)) {
		// There are options
		l = m[1];
		opt = parse_options(m[3]);
	    }
            opt.line_ct__ = line_ct;

	    // Now we can parse the start of the line as expected
	    match = false;
	    for (var r in handlers) {
                debug(r);
		if (m = l.match(r)) {
		    handlers[r](json, m, opt);
		    match = true;
		    break;
		}
	    }
	    if (!match)
		die("No match at line " + line_ct + ' :' + l_orig);
	}
        
        debug("Parsed: " + JSON.stringify(json));
	return json;
    };

    return {
	parse : parse
    };
}();
