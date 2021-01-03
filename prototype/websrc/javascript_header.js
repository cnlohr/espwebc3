

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
				nxtCol.style.width = (nxtColWidth - (diffX))+'px';

			curCol.style.width = (curColWidth + diffX)+'px';
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

function setListenersVertical(div){
	var pageY,curRow,nxtRow,curRowHeight,nxtRowHeight;
	div.addEventListener('mousedown', function (e) {
		curRow = e.target.parentElement;
		nxtRow = curRow.nextElementSibling; //XXX THIS IS WRONG IN MOST CASES...
		pageY = e.pageY;
		curRowHeight = curRow.offsetHeight
		if (nxtRow)
			nxtRowWidth = nxtRow.offsetHeight
	});

	document.addEventListener('mousemove', function (e) {
		if (curRow) {
			var diffY = pageY - e.pageY;
			if (nxtRow)
				nxtRow.style.height = (nxtRowHeight - (diffY))+'px';

			curRow.style.height = (curRowHeight + diffY)+'px';
		}
	});

	document.addEventListener('mouseup', function (e) { 
		curRow = undefined;
		nxtRow = undefined;
		pageY = undefined;
		nxtRowHeight = undefined;
		curRowHeight = undefined;
	});
}



//From https://www.w3schools.com/howto/howto_js_tabs.asp
function openTab(evt, cityName) {
	// Declare all variables
	var i, tabcontent, tablinks;

	// Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}

	// Get all elements with class="tablinks" and remove the class "active"
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++)
		tablinks[i].className = tablinks[i].className.replace(" active", "");

	// Show the current tab, and add an "active" class to the button that opened the tab
	document.getElementById(cityName).style.display = "block";

	evt.currentTarget.parentElement.className += " active";
} 



function editorClick( evt )
{
	selection = window.getSelection();
	console.log( selection );
}


function SetupDocument()
{
	setListenersHorizontal( document.getElementById( "resizerfl" ) );
	setListenersVertical( document.getElementById( "resizerhz" ) );
	console.log( "XXX\n" );
}

