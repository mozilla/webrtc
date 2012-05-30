
var Ladder = function() {
    var participants = [];
    var arrows = [];
    var column_width = 200;
    var time_height = 30;
    var current_time = 0;
    var arrow_head_length = 7;
    var label_adjust = -.15;
    var max_time = 0;
    var paper = undefined;
    
    var deep_copy = function(a) {
      return JSON.parse(JSON.stringify(a));
    };

    var participant_index = function(p) {
        for (var i=0; i<participants.length; i++) {
            if (participants[i][0] == p) {
                return i;
            }
        }
        participants.push([p,p]);
        return i;
    };

    var posa = function(x, y) {
        return {
            x : x,
            y : y,
            str: function(suff) {
                suff = suff || "";
                return 'x' + suff +'="' + x + 
                    '" y' + suff + '="' + y + '" ';
            },
            adjust: function(dx, dy) {
                return posa(x + dx, y + dy);
            }
        };
    };

    var pos = function(col, time) {
        var p = posa(columnx(col), timey(time));
        p.col = col;
        p.time = time;
        return p;
    };

    var parse_endpoint = function(endpoint) {
        var endpoint_re = /([a-zA-Z0-9]+)(:(.*))?/;
        var pi = -1;
        var time = null;
        var tmp;
        
        var m = endpoint.match(endpoint_re);
        if (!m) {
            return null;
        }
        
        // Find the participant
        pi = participant_index(m[1]);
        
        // is there a time?
        if (m[3]) {
            // First see if it is an integer
            tmp = integer.parseInt(m[3], 10);
            if (!isNaN(tmp)) {
                time = tmp;
            }
        }
                
        return {
            endpoint:m[1],
            column:pi,
            time:time
        };
    };

    var compute_ladder = function(desc) {
        var start;
        var end;
        var label;
        var flags;

        if (desc.participants) {
            participants = deep_copy(desc.participants);
        }

        console.log(desc);
        
        _.each(desc.data, function(x) {
                   // Each of these is a single event
                   start = parse_endpoint(x[0]);
                   end = parse_endpoint(x[1]);
                   label = x[2];
                   flags = x[3] || {};
                   
                   if (!start.time) {
                       start.time = current_time;
                   }
                      
                   if (!end.time) {
                       end.time = current_time;
                       if (flags && flags.duration) {
                           end.time += flags.duration;
                       }
                   }
                      
                   arrows.push({
                                   start : start,
                                   end:end,
                                   label:label
                               });

                   max_time = Math.max(start.time, end.time);

                   if (flags.advance === undefined) {
                       if (flags.duration === undefined)
                           current_time++;
                       else
                           current_time += flags.duration;
                   }
                   else {
                       current_time += flags.advance;
                   }
        });

        console.log(arrows);
    };

    var columnx = function(col) {
        return (col + .5) * column_width;
    };
    
    var timey = function(time) {
        return (time + 5) * time_height;
    };


    var label = function(col, time, str) {
        return '<text ' + pos(col, time).str() + ' text-anchor="middle">' +
            str + "</text>\n";
    };

    var rotate_attr = function(angle, x, y) {
        return ' transform="rotate(' + angle + ', ' + x + ', ' + y + ')" ';
    };

    var arrow_head = function(angle, p, direction) {
        var result = '';
        var xoffset = arrow_head_length * direction;
        
        result += '<line ' + p.str(1) + p.adjust(xoffset, -1 * arrow_head_length).str(2)
            + rotate_attr(angle, p.x, p.y) + ' width="1" + stroke="black"/>';
        result += '<line ' + p.str(1) + p.adjust(xoffset, 1 * arrow_head_length).str(2) 
            + rotate_attr(angle, p.x, p.y) + ' width="1" + stroke="black"/>';
        return result;
    };

    var arrow = function(c1, t1, c2, t2, str, double_headed) {
        var midx = (c1 + c2) / 2;
        var midy = (t1 + t2) / 2;
        var left;
        var right;
        var l2r = false;
        var result = "";

        var angle;

        angle = Math.atan((timey(t2) - timey(t1)) / (columnx(c2) - columnx(c1))) * 180/3.14;

        // Basic line
        result += '<line ' 
            + pos(c1, t1).str(1)
            + pos(c2, t2).str(2) + 
            'width = "1" stroke="black"/>\n';

        // Put into L -> R form        
        if (c2 > c1) {
            left = pos(c1, t1);
            right = pos(c2, t2);
            l2r = true;
        }
        else {
            left = pos(c2, t2);
            right = pos(c1, t1)
        }

        if (l2r || double_headed) {
            result += arrow_head(angle, right, -1);
        };
        
        if (!l2r || double_headed) {
            result += arrow_head(angle, left, 1);
        }
        
        if (str) {
            result += '<text ' + pos(midx, midy + label_adjust).str() + 
                ' text-anchor="middle" '
                + rotate_attr(angle, columnx(midx), timey(midy + label_adjust)) + 
                '>' + 
                str + "</text>\n";
        }
        return result;
    };

    var line = function(c1, t1, c2, t2) {
        return '<line ' 
            + pos(c1, t1).str(1)
            + pos(c2, t2).str(2) + 
            'width = "1" stroke="black"/>\n';
    };

    var draw_ladder = function() {
        var width = columnx(participants.length);
        var height =  timey(max_time + 5);
        
        var result = '<svg width="' + width + '" height="' + height + '">\n';
        
        _.each(participants, function(x, col) {
                   result += label(col, -3, x[1]);
                   result += line(col, -2, col, max_time + 1);
                   result += label(col, max_time + 3, x[1]);
               });

        _.each(arrows, function(x) {
                  result += arrow(x.start.column,
                                  x.start.time,
                                  x.end.column,
                                  x.end.time,
                                  x.label);
               });
        result += '</svg>';
        
        return result;
    };

    return {
        compute_ladder : compute_ladder,
        draw_ladder : draw_ladder
    };
}();
