#!/usr/bin/env python
from optparse import OptionParser
import sys
import re
import os.path
import subprocess

DIAGRAM_PATH = "/Users/ekr/doc/mozilla/webrtc/ladder/run.js"

diagram_ct = 0
in_diagram = False
diagram = ""

def die(msg):
    print msg
    sys.exit(1)


def make_diagram(data):
    global diagram
    global diagram_ct
    wsdname = "%s-%d.wsd"%(name_base,diagram_ct)
    svgname = "%s-%d.svg"%(name_base,diagram_ct)
    wsdfile = open(wsdname, "w")
    if wsdfile is None:
        die("Couldn't open wsd file")
    wsdfile.write(diagram)
    wsdfile.close()
    diagram = ""
    diagram_ct += 1
    subprocess.call(["node",DIAGRAM_PATH, wsdname, svgname])

    if options.prefix:
        pathname = "%s/%s"%(options.prefix, svgnames)
    else:
        pathname = svgname

    svgin = open(svgname)
    if svgin is None:
        die("Couldn't open sVG file")
    return "<P>" + svgin.read() + "<P>"

parser = OptionParser()
parser.add_option("-p", "--prefix", dest="prefix", default="")

(options, args) = parser.parse_args()


if len(args) != 2:
    die("Wrong number of arguments")

infile = open(args[0])
if infile is None:
    die("Couldn't open %s"%args[0])

outfile = open(args[1], "w")
if outfile is None:
    die("Couldn't open %s"%args[1])
name_base = os.path.splitext(args[1])[0]


for l in infile:
    if not in_diagram:
        if re.search("--- LADDER: START ---", l):
            in_diagram = True
        else:
            outfile.write(l)
    else:
        if re.search("--- LADDER: END ---", l):
            in_diagram = False
            outfile.write(make_diagram(diagram))
            outfile.write("\n")
        else:
            diagram += l

            
    


    
            

    
