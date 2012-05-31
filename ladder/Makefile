


all:  data.svg data.png


clean:
	- rm -f *.svg *.png

%.svg: %.wsd
	cat $^ | jsc run.js > test.svg > $@

%.png: %.svg
	java -jar batik-rasterizer.jar $^ -d $@ -bg 255.255.255.255

