#include <stdio.h>
#include <string.h>
#include <unistd.h>

#include "cnhttp.h"
#include "http_bsd.h"




//Close of curhttp happened.
void CloseEvent()
{
}

void HTTPCustomCallback( )
{
	if( curhttp->rcb )
		((void(*)())curhttp->rcb)();
	else
		curhttp->isdone = 1;
}


static void WSEchoData(  int len )
{
	char cbo[len];
	int i;
	for( i = 0; i < len; i++ )
	{
		cbo[i] = WSPOPMASK();
	}
	WebSocketSend( cbo, len );
}

static void WSCommandData(  int len )
{
	uint8_t  __attribute__ ((aligned (32))) buf[1300];
	int i;

	for( i = 0; i < len; i++ )
	{
		buf[i] = WSPOPMASK();
	}

	//i = issue_command(buf, 1300, buf, len );
	if( i < 0 ) i = 0;

	WebSocketSend( buf, i );
}



void NewWebSocket()
{
	if( strcmp( (const char*)curhttp->pathbuffer, "/d/ws/echo" ) == 0 )
	{
		curhttp->rcb = 0;
		curhttp->rcbDat = (void*)&WSEchoData;
	}
	else if( strncmp( (const char*)curhttp->pathbuffer, "/d/ws/issue", 11 ) == 0 )
	{
		curhttp->rcb = 0;
		curhttp->rcbDat = (void*)&WSCommandData;
	}
	else
	{
		curhttp->is404 = 1;
	}
}




void WebSocketTick()
{
	if( curhttp->rcb )
	{
		((void(*)())curhttp->rcb)();
	}
}

void WebSocketData( int len )
{
	if( curhttp->rcbDat )
	{
		((void(*)( int ))curhttp->rcbDat)(  len ); 
	}
}

void HTTPCustomStart( )
{
	curhttp->rcb = 0;
	curhttp->bytesleft = 0;
	curhttp->isfirst = 1;
	HTTPHandleInternalCallback();
}


int main()
{
	RunHTTP( 8888 );

	while(1)
	{
		TickHTTP();
		usleep( 30000 );
	}
}

