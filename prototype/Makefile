all : http_shim_cnhttp

CFLAGS:=-I../cntools/http

CFLAGS+=-Os -s

SRCS:=src/http_shim_cnhttp.c ../cntools/http/http_bsd.c ../cntools/http/cnhttp.c ../cntools/http/sha1.c  ../cntools/http/mfs.c

http_shim_cnhttp : $(SRCS)
	gcc -o $@ $^ $(CFLAGS) $(LDFLAGS)

clean : 
	rm -rf *.o *~ http_shim_cnhttp

