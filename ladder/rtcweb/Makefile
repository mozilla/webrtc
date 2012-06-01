JS = js
JS = /System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Resources/jsc
#JS = jsc

SRC  := $(wildcard *.wsd)

SVG  := $(patsubst %.wsd,%.svg,$(SRC))
PNG  := $(patsubst %.wsd,%.png,$(SRC)) 

all:  $(SVG) $(PNG) 

clean:
	- rm -f *.svg *.png

%.svg: %.wsd
	cat $^ | ( cd .. ; $(JS) run.js ) > $@

%.png: %.svg
	java -jar ../batik-rasterizer.jar $^ -d $@ -bg 255.255.255.255

