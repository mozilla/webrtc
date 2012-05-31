JS = js
JS = /System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Resources/jsc
#JS = jsc

all:  data.svg data.png


clean:
	- rm -f *.svg *.png

%.svg: %.wsd
	cat $^ | $(JS) run.js > $@

%.png: %.svg
	java -jar batik-rasterizer.jar $^ -d $@ -bg 255.255.255.255

