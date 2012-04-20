# Please run 'make' to update the pdf before committing.
# 'dot' comes from the graphviz package. See graphviz.org.

all: webrtc.pdf

%.pdf: %.dot
	dot -Tpdf $< $@
