all : ../page/index.html

../page/index.html : index.ht
	bash -c 'export JAVASCRIPT_DATA=$$(cat javascript_header.js); envsubst < $< > $@'

clean :
	rm -rf ../page/index.html
