
/////////////////////////////////////////////////////////////////////////////////
// Scroll Bars
/////////////////////////////////////////////////////////////////////////////////

//Based on: https://www.brainbell.com/javascript/making-resizable-table-js.html
function setListenersHorizontal(div){
	var pageX,curCol,nxtCol,curColWidth,nxtColWidth;
	div.addEventListener('mousedown', function (e) {
		curCol = e.target.parentElement;
		nxtCol = curCol.nextElementSibling;
		pageX = e.pageX;
		curColWidth = curCol.offsetWidth
		if (nxtCol)
			nxtColWidth = nxtCol.offsetWidth
	});

	document.addEventListener('mousemove', function (e) {
		if (curCol) {
			var diffX = e.pageX - pageX;
			if (nxtCol)
			{
				var nw =  (nxtColWidth - (diffX));
				if( nw < 3) return;
				nxtCol.style.width = nw+'px';
			}
			var nw = (curColWidth + diffX);
			if( nw < 3 ) return;
			curCol.style.width = nw+'px';
		}
	});

	document.addEventListener('mouseup', function (e) { 
		curCol = undefined;
		nxtCol = undefined;
		pageX = undefined;
		nxtColWidth = undefined;
		curColWidth = undefined;
	});
}

function setListenersVertical(div,curRow,nxtRow){
	var pageY,curRowHeight,nxtRowHeight;
	var moving = false;
	div.addEventListener('mousedown', function (e) {
		//curRow = e.target.parentElement;
		//console.log( curRow );
		//nxtRow = curRow.parentElement.nextElementSibling.firstChild; //XXX THIS IS WRONG IN MOST CASES...
		//console.log( nxtRow );
		pageY = e.pageY;
		curRowHeight = curRow.offsetHeight;
		if (nxtRow)
			nxtRowHeight = nxtRow.offsetHeight;
		moving = true;
	});

	document.addEventListener('mousemove', function (e) {
		if (!moving) return;

		var diffY =  e.pageY - pageY;
		if (nxtRow)
		{
			var nh = (nxtRowHeight - (diffY));
			if( nh < 3 ) return;
			nxtRow.style.height = nh +'px';
		}

		var nh = (curRowHeight + diffY);
		if( nh < 3 ) return
		curRow.style.height = nh+'px';
	});

	document.addEventListener('mouseup', function (e) { 
		moving = false;
		pageY = undefined;
		nxtRowHeight = undefined;
		curRowHeight = undefined;
	});
}


/////////////////////////////////////////////////////////////////////////////////
// Tab opening/closing
/////////////////////////////////////////////////////////////////////////////////

tabOwnership = {};
tabIDToContainer = [];

//Style taken from https://www.w3schools.com/howto/howto_js_tabs.asp
function openTab(evt, tabID) {

	var container = tabIDToContainer[tabID];
	var tabsArray = tabOwnership[container];

	for( let tid in tabsArray )
	{
		var content = tabsArray[tid].content;
		var tab = tabsArray[tid].tab;

		tab.className = tab.className.replace(" active", "");
		if( tid == tabID )
		{
			tab.className += " active";
			if( content )
				content.style.display = "block";
		}
		else
		{
			if( content )
				content.style.display = "none";
		}
	}
}

function closeTab(evt, tabID)
{
	var container = tabIDToContainer[tabID];
	var tabsArray = tabOwnership[container];
	var thisTab = tabsArray[tabID];

	if( thisTab.content )
		thisTab.content.parentNode.removeChild( thisTab.content );
	if( thisTab.tab )
		thisTab.tab.parentNode.removeChild( thisTab.tab );

	delete tabsArray[tabID];
	delete tabIDToContainer[tabID];
}

function TabDrag( event, tabname )
{
	event.dataTransfer.setData("tabid", tabname);
}

function HandleMenuDrop( event )
{
	var target = event.target;
	//Search up the tree for when we have a tabbay we've dropped into.
	while( target && target.id.split( "_" )[1] != "tabbay" )
		target = target.parentNode;
	if( !target ) return;
	var dest_id = target.id.split( "_" )[0];
	var tabID = event.dataTransfer.getData("tabid");

	var container = tabIDToContainer[tabID];
	var tabsArray = tabOwnership[container];
	var thisTab = tabsArray[tabID];

	//Remove the tab from the previous bay.
	if( thisTab.content )
		thisTab.content.parentNode.removeChild( thisTab.content );
	if( thisTab.tab )
		thisTab.tab.parentNode.removeChild( thisTab.tab );

	delete tabsArray[tabID];

	AttachTabToParent( dest_id, tabID, thisTab.tab, thisTab.content );

	//Tricky: Make sure only one tab in this bay is opened.
	if( thisTab.tab.className.includes("active") )
		openTab( null, tabID );

	event.preventDefault();
}

function PreventDefault( event )
{
	event.preventDefault();
}


function AttachTabToParent( tabparentname, tabid, tab, content )
{
	var tabparent = document.getElementById( tabparentname + "_tabbay" );
	var contentparent = document.getElementById( tabparentname + "_tabbody" );

	tabparent.appendChild( tab );

	if( !tabOwnership[tabparentname] )
		tabOwnership[tabparentname] = new Array();

	if( content )
		contentparent.appendChild( content );

	tabOwnership[tabparentname][tabid] = {
		tab : tab,
		content : content
	};
	tabIDToContainer[tabid] = tabparentname;
}


function GenerateTab( tabid, tabname, tabparentname, closeable, contentfunction, clickfunction )
{

	var content = null;
	if( contentfunction )
	{
		content = contentfunction( tabid, tabname );
		content.style.display = "none";
	}
	if( !clickfunction ) clickfunction = openTab;

	var tab = document.createElement( "div", tabname + "_buttonlink" );
	tab.className = "tablinks";
	tab.draggable = true;
    tab.addEventListener('dragstart', function( event ) { TabDrag( event, tabid ) }, true);

	var buttonA = document.createElement( "button", tabname + "_buttonA" );
	buttonA.className = "tablinks tablinksA";
	buttonA.addEventListener("click", function(event) { clickfunction(event, tabid ); } );
	buttonA.innerHTML = tabname;
	tab.appendChild( buttonA );

	if( closeable )
	{
		var buttonB = document.createElement( "button", tabname + "_buttonB" );
		buttonB.className = "tablinks tablinksB";
		buttonB.addEventListener("click", function(event) { closeTab(event, tabid ); } );
		buttonB.innerHTML = "❌";
		tab.appendChild( buttonB );
	}

	AttachTabToParent( tabparentname, tabid, tab, content );
}

////////////////////////////////////////////////////////////////////////////////


function EditorClick( evt )
{
	selection = window.getSelection();
	console.log( selection );
}

function EditorTextChange( evt )
{
	console.log( evt );
}

function EditorKeyDown( evt )
{
	if( evt.ctrlKey )
	{
		console.log( evt );
		event.preventDefault();
	}
}

function GenerateEditor( tabid, tabname )
{
	var newdiv = document.createElement( "div", tabname + "_body" );
	newdiv.className = "editor";
	var editorcontainer = document.createElement( "div",  tabname + "_container" );
	newdiv.appendChild( editorcontainer );
	editorcontainer.className = "editorContainer";

	/* based on https://codemirror.net/demo/complete.html */
	var gutter = document.createElement( "div", tabname + "_gutter" );
	editorcontainer.appendChild( gutter );
	gutter.className = "editorGutter";
	gutter.style="width: 29px;";
	gutter.innerHTML = "1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>"

	var linesSection = document.createElement( "div", tabname + "_gutter" );
	editorcontainer.appendChild( linesSection );
	linesSection.className = "editorLinesSection";

	var editorNote = document.createElement( "div", tabname + "_editornote" );
	linesSection.appendChild( editorNote );
	editorNote.innerHTML = "";
	editorNote.className = "editorNote";

	var editorLines = document.createElement( "div", tabname + "_editorlines" );
	linesSection.appendChild( editorLines );
	editorLines.addEventListener( "click", EditorClick );
	editorLines.contentEditable = true;
	editorLines.spellcheck = false;
	editorLines.addEventListener("input", EditorTextChange );
	editorLines.addEventListener("keydown", EditorKeyDown );

	var editorContent = document.createElement( "xmp", tabname + "_editorxmp" );
	editorLines.appendChild( editorContent );
	editorContent.className="editorLines";
	editorContent.innerHTML = "#include <stdio.h>\nint main()\n{\n    printf( \"Hello, world!!!\\n\" );\n}\n";

	return newdiv;
}

////////////////////////////////////////////////////////////////////////////////

function GenerateSettings(tabid, tabname )
{
	var newdiv = document.createElement( "div", tabname + "_body" );
	newdiv.innerHTML = "<h1>Settings</h1>";

	return newdiv;
}

function GenerateProject(tabid, tabname )
{
	var newdiv = document.createElement( "div", tabname + "_body" );
	newdiv.innerHTML = "<h1>Project Settings</h1>";

	return newdiv;
}

function GenerateFileListing(tabid, tabname )
{
	var newdiv = document.createElement( "div", tabname + "_body" );
	newdiv.innerHTML = "<h1>File Listing</h1>";

	return newdiv;
}

////////////////////////////////////////////////////////////////////////////////

function SetupDocument()
{
	setListenersHorizontal( document.getElementById( "resizerfl" ) );
	setListenersHorizontal( document.getElementById( "resizerflmid" ) );
	setListenersVertical( document.getElementById( "resizerhz" ), 
		document.getElementById( "maincontenttd" ),
		document.getElementById( "bottomcontentid" ) );

	bays = document.getElementsByClassName("tabbay");
	for( var b = 0; b < bays.length; b++ )
	{
		var elem = bays[b];
		elem.addEventListener( "drop", HandleMenuDrop );
		elem.addEventListener( "dragover", PreventDefault );
	}

	GenerateTab( "settingsbutton", "⚙️", "main", false, GenerateSettings );
	GenerateTab( "playbutton", "▶️", "main", false, null, function() { console.log( "PLAY" ) } );
	GenerateTab( "anotherfile_c", "anotherfile.c", "main", true, GenerateEditor );
	GenerateTab( "anotherfile_h", "anotherfile.h", "main", true, GenerateEditor );
	GenerateTab( "projectsettings", "Project", "main", true, GenerateProject );
	GenerateTab( "filelisting", "File List", "side", false, GenerateFileListing );
	GenerateTab( "Output", "Output", "bottom", false, GenerateEditor );
}

