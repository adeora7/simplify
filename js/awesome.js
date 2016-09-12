//set variables according to your preference
//start of environment variables;

var devTools = 1; // 0 for off and 1 for on
var gridOn = 1; // to turn off the grid, change value to 0
var mobileViewSwitch = 1; //to enable shifting between landscape/portrait mode on mobile
var gridSizeX = 100;
var gridSizeY = 100;
var save = 0;
var inProgress = 1;
var allow = 0;
var elementCounter = 0;

var allElements = [];
var parentChildMap = {
	"body" : []
};
/*

	{
		"parent" : [],

	}

*/
//end of environment variables;


//utility functions

function removeElement(className){
	var childClass = className;
	console.log(parentChildMap[childClass]);
	if(parentChildMap[childClass].length == 0 ){
		var flag = 1;
		for(var property in parentChildMap){
			if (parentChildMap.hasOwnProperty(property)) {
				for(var i = 0; i < parentChildMap[property].length; i++){
					if(parentChildMap[property][i] == childClass){
						parentChildMap[property].splice(i, 1);
						delete parentChildMap[childClass];
						flag = 0;
						break;
					}
				}	
			}
			if(flag == 0){
				break;
			}

		}
	}
	else{
		var flag = 1;
		for(var property in parentChildMap){
			if (parentChildMap.hasOwnProperty(property)) {
				for(var i = 0; i < parentChildMap[property].length; i++){
					if(parentChildMap[property][i] == childClass){
						parentChildMap[property].splice(i, 1);
						for(var j = 0; j< parentChildMap[childClass]; j++){
							parentChildMap[property].push(parentChildMap[childClass][j]);
						}
						delete parentChildMap[childClass];
						flag = 0;
						break;
					}
				}	
			}
			if(flag == 0){
				break;
			}

		}	
	}
	console.log(parentChildMap);

}

function addElement(startx, starty, e){

	var newElement = document.createElement('div');
	$("body").append(newElement);
	$(newElement).css({
		position: "absolute",
		top: starty + "px",
		left: startx + "px",
		height: "100px",
		width: "100px",
		background: "red" 

	});
	$(newElement).addClass("resizable");
	$(newElement).addClass("entry"+elementCounter);
	var currE = "entry" + elementCounter;
	elementCounter++;
	$(newElement).resizable();
	$(newElement).append("<button class='editDiv'>edit</button><button class='cancelDiv'>X</button>");

	// makes GSAP Draggable avoid clicks on the resize handles
	$('.ui-resizable-handle').attr('data-clickable', true);

	if($(e.target).hasClass("resizable")){
		var classes = $(e.target).attr('class').split(' ');
		if(e.target.classList[1] in parentChildMap){
			parentChildMap[e.target.classList[1]].push(currE);
		}
		else{
			parentChildMap[e.target.classList[1]] = [];
			parentChildMap[e.target.classList[1]].push(currE);
		}
		
		console.log(parentChildMap);
	}
	else
	{
		console.log(currE);
		parentChildMap[currE] = [];
		parentChildMap["body"].push(currE);
		// console.log(parentChildMap);	
	}
}	

function saveState(){
	allElements = $('.resizable');
	// console.log(allElements);
	for(var i = 0;i< allElements.length ;i++){
		$(allElements[i]).find('.cancelDiv, .ui-resizable-handle, .editDiv').remove();
	}
	save = 0;
}

function generateCode(){
	if(save == 0){
		var finalSolution = document.createElement('div');
		$(finalSolution).addClass("body").css({
			top : "0px",
			left : "0px"
		});
		$("body").append(finalSolution);
		for (var property in parentChildMap) {
			if (parentChildMap.hasOwnProperty(property)) {
		        //property is the parent where this child is to be added
		        var u = $("body").find("."+property);
		        for(var x = 0 ; x< parentChildMap[property].length; x++){
		        	//console.log(parentChildMap[property][x]);
		        	//child to be added
		        	var v;
		        	for(var i = 0; i < allElements.length;i++){
		        		if($(allElements[i]).hasClass(parentChildMap[property][x]) ){
		        			v = allElements[i];
		        			break;
		        		}
		        	}
		        	$(v).css({
		        		top: (parseInt($(v).css("top")) - parseInt($(u).css("top"))) + "px",
		        		left: (parseInt($(v).css("left")) - parseInt($(u).css("left"))) + "px"

		        	});

					//console.log( parseInt($(v).css("top")) -parseInt($(u).css("top")) );
		        	
		        	u.append(v);
		        }
		    }
		}
		console.log(finalSolution);
		var htmlOutput = 
		`<!DOCTYPE html>
		<html>
			<head>
			</head>
			<body>
		`;

		htmlOutput += $(finalSolution).html();

		htmlOutput += `
			</body>
		</html>`;
		//console.log(htmlOutput);
		$("#downloadLink").attr('href', makeTextFile(htmlOutput));
		// $("body").text(htmlOutput);
		allow = 1;
		// window.print();
	}
	else
	{
		alert("save your project first");
	}
}

function showGrid(){
	var body = document.body,
    html = document.documentElement;
	var height = Math.max( body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight );

	var width = Math.max( body.scrollWidth, body.offsetWidth, 
                       html.clientWidth, html.scrollWidth, html.offsetWidth );
	//alert(height); alert(width);
	var boxesX = parseInt(width/gridSizeX);
	var boxesY = parseInt(height/gridSizeY);

	var lastRowHeight = height - boxesY*gridSizeY;

	// console.log(boxesX,boxesY);

	var grid = document.createElement('div'),
		$grid = $(grid);
	grid.id = "grid";
	$("body").append(grid);
	grid.innerHTML = "";

	var boxNumber = 0;

	for(var y = 0;y < boxesY;y++){	
		var boxRow =  document.createElement('div');
		// $boxRow = $("<div>");
		$(boxRow).addClass('boxRow');
		$grid.append(boxRow);
		for(var x = 0; x < boxesX; x++){
			var box = document.createElement('div');
			box.classList.add('gridBox');
			$(box).css({
				height : gridSizeX + "px",
				width : gridSizeY + "px"
			});
			$(boxRow).append(box);
		}
	}

	var boxRow =  document.createElement('div');
	$(boxRow).addClass('boxRow');
	$grid.append(boxRow);
	for(var x = 0;x < boxesX;x++){
		var box = document.createElement('div');
		box.classList.add('gridBox');
		$(box).css({
			height : lastRowHeight + "px",
			width : gridSizeY + "px"
		});
		$(boxRow).append(box);
	}

		//console.log('Clicked');
		//console.log(e);
		//console.log(e.pageX, e.clientX, e.offsetX);
		
	var offset = $("#grid").offset();
	$(document).click(function(e){
    	if(allow == 0){
    		addElement(e.pageX - offset.left, e.pageY - offset.top,e);
    	}
    	save = 1;
	});


}

function makeTextFile(text) {
	var data = new Blob([text], {type: 'text/plain'});
	textFile = window.URL.createObjectURL(data);
	return textFile;
}
//end of utility functions


$(document).ready(function(){
	var awesome = $("body");
	if(gridOn == 1){
		showGrid();
	}

	$(document).on('click', ".cancelDiv", function(e) {
		//$().remove();
		e.stopPropagation();
		var className = $(this).closest('.resizable').attr("class").split(" ")[1];
		// console.log(className);
		removeElement(className);
		$(this).closest('.resizable').remove();
	});

	$(document).on('click', ".editDiv", function(e) {
		//$().remove();
		e.stopPropagation();
		var textToAdd = prompt("Eneter HTML to be added");
		if(textToAdd != null){
			var current = $(this).closest('.resizable').html();
			current += textToAdd;
			$(this).closest('.resizable').append(textToAdd);
		}
	});


	$('#saveState').click(function(e){
		saveState();
		e.stopPropagation();
	});

	$("#generate").click(function(e){
		generateCode();
		e.stopPropagation();
	});

});