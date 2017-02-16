import { Template } from 'meteor/templating';
 
import './body.html';


function renderWidgetOccurences(widgets) {
    var table = "<table> <tr> <th> Widget </th><th> File </th> </tr>";
    for ( var i = 0 ; i < widgets.length ; i++ ) {
        var a = widgets[i];
        table += "<tr> <td>"+a["widgetid"]+"</td><td>"+a["unit"]+"</td> </tr>";
    }
    table += "</table>";
    document.getElementById("res").innerHTML = table;
}

function renderListOfObjects(a,header,class_) {
	if ( a.length == 0 ) return;
    var table = "<table class=\""+class_+"\"> <tr>";
    for ( var i = 0 ; i < header.length ; ++i ) {
		table += "<th class=\"text-left\">"+header[i]+"</th>";
	}
	table += "<th class=\"text-left\">Files</th>";
	table += "</tr>";
	for ( var i = 0 ; i < a.length ; ++i ) {
		var aa = a[i];
		table += "<tr>";
		for ( var k = 0 ; k < header.length ; ++k ) {
			table += "<td class=\"text-left\">"+aa[header[k]]+"</td>";
		}
		table += '<td> <a class="btn" widget="'+aa[header[0]]+'" href="javascript:void(0)">Details</a> </td>';
		table += "</th>";
	}
	table += "</table>";
	return table;
}

function processWidgetOccurences(widgets) {
	var res = {};
	console.log(widgets);
	if ( typeof widgets == "undefined" || widgets.length == 0 ) {
		document.getElementById("res").innerHTML = '<h1>Sorry no Custom Widgets were found</h1>';
		return null;
	}
	for ( var i = 0 ; i < widgets.length ; ++i ) {
		var w = widgets[i]; 
		addOccurence(res,w["widgetid"],w["t"]);
	}
	res = convertToArray(res,"name");

	document.getElementById("res").innerHTML = '<h1>Custom Widgets</h1>'+renderListOfObjects(res,["name","direct","effective"],"table-fill");
	setTimeout(function () {
		var a = document.getElementsByClassName("btn");
		for ( var i = 0 ; i < a.length ; ++i ) {
			a[i].onclick = function() {
		      var modal = document.getElementById('myModal');
		      modal.style.display = "block";

		      var widget_name = this.getAttribute("widget");
		      
		      var modal_title = document.getElementById('modal_title');
		      modal_title.innerHTML = "List of files where "+widget_name+" occurs:";
		      var text = "";
			  for ( var i = 0 ; i < widgets.length ; ++i ) {
					var w = widgets[i]; 
					if ( w["widgetid"] == widget_name ) {
						text += w["unit"]+"\n";
					}
			  }
		      var text_area = document.getElementById('all_files');
		      text_area.value = text;
		      return false;
		    }
		}
	},50);
}

function convertToArray(a,attr) {
	var res = [];
	var keys = Object.keys(a);
	for ( var i = 0 ; i < keys.length ; ++i ) {
		var b = a[keys[i]];
		b[attr] = keys[i];
		res.push(b);
	}
	return res;
}

function addOccurence(temp,name,type) {
	var counts_for_widget = {"direct":0,"effective":0};
	if ( temp.hasOwnProperty(name) ) {
		counts_for_widget = temp[name];
	}
	if ( type == "direct" ) {
		counts_for_widget["direct"] += 1;
	}
	counts_for_widget["effective"] += 1;
	temp[name] = counts_for_widget;
}

Template.body.onRendered(function(){
   $('.project-details').validate();
});

Template.body.events({

  'submit .project-details'(event) {
    event.preventDefault();
 	
    // Get values from form element
    const target = event.target;
    const username = target.username.value;
    const api_key = target.api_key.value;
    const project_id = target.project_id.value;


    var please_wait = document.getElementById("please_wait");	
    please_wait.style.display = "block";

    var submit_btn = document.getElementById("submit_btn")
    submit_btn.disabled = true;	


	document.getElementById("res").innerHTML = '';
	document.getElementById("error").innerHTML = '';

    
    Meteor.call("getWidgets",username,api_key,project_id,function (error, result) {
    	console.log(JSON.stringify(result));
    	please_wait.style.display = "none";
    	if ( result.response == "success" ) {
	    	processWidgetOccurences(result.widgets);	
    	}
    	else {
			document.getElementById("error").innerHTML = result.message.text;
    	}
    	setTimeout(function () {submit_btn.disabled = false;},500);
    });
	
    
    var messages = [];
    messages.push("Contacting mendix");
    messages.push("Acquiring access");
    messages.push("Creating a working copy of the project");
    messages.push("Reading modules");
    messages.push("Finding custom widgets");
    messages.push("Dealing with snippets and layouts");
    messages.push("Dealing with snippets and layouts.. Please wait");
    messages.push("This might take a while");
    messages.push("This project is huge");
    messages.push("Why dont you grab a cup of coffee?");
    messages.push("Well this is a bit embarassing");
    messages.push("This must be the largest project in the world");
    messages.push("I am still trying");


	document.getElementById("submit_btn").disabled = true;	
    
    var ennertainUser = function(i,t) {
    	if ( please_wait.style.display == "none" ) return;
    	var m = "";
    	if ( i < messages.length ) m = messages[i];
    	else m = messages[messages.length-1]+" "+(i-messages.length);
    	if ( i > 20 ) m = "All hope is lost. I stop trying now.";
    	please_wait.innerHTML = m;
    	if ( i > 21 ) {
    		submit_btn.disabled = false;
    		return;
    	}
    	setTimeout(function () {ennertainUser(i+1,t+i*200);},t);
    };
    ennertainUser(0,2800);
  },
});

/*
setTimeout(function () {
	var result = [{"widgetid":"BooleanSlider","unit":"MyFirstModule.PageWithSnippetWithWidget1","t":"indirect"},{"widgetid":"LabelSelect","unit":"MyFirstModule.AlsoUsesLayoutWithWidget","t":"indirect"},{"widgetid":"LabelSelect","unit":"AnotherModule.UsesLayoutWithWidget","t":"indirect"},{"widgetid":"Counter","unit":"AnotherModule.PageWithTwoLevelSnippet","t":"indirect"},{"widgetid":"ClockPickerforMendix","unit":"AnotherModule.PageWithTwoLevelSnippet","t":"indirect"},{"widgetid":"BooleanSlider","unit":"LayoutWithSnippet.PageWithLayoutWithSnippet","t":"indirect"},{"widgetid":"Counter","unit":"LayoutWithSnippet.PageWithLayoutWithLevel2Snippet","t":"indirect"},{"widgetid":"ClockPickerforMendix","unit":"LayoutWithSnippet.PageWithLayoutWithLevel2Snippet","t":"indirect"},{"widgetid":"BooleanSlider","unit":"MyFirstModule.OneWidgetDirectly","t":"direct","type":"Pages$Page"},{"widgetid":"BooleanSlider","unit":"MyFirstModule.SnippetWithWidget1","t":"direct","type":"Pages$Snippet"},{"widgetid":"Counter","unit":"MyFirstModule.ThreeWidgetsDirectly","t":"direct","type":"Pages$Page"},{"widgetid":"BooleanSlider","unit":"MyFirstModule.ThreeWidgetsDirectly","t":"direct","type":"Pages$Page"},{"widgetid":"BooleanSlider","unit":"MyFirstModule.ThreeWidgetsDirectly","t":"direct","type":"Pages$Page"},{"widgetid":"LabelSelect","unit":"MyFirstModule.AdressOverview","t":"direct","type":"Pages$Page"},{"widgetid":"ClockPickerforMendix","unit":"MyFirstModule.SnippetWithWidget2","t":"direct","type":"Pages$Snippet"},{"widgetid":"BooleanSlider","unit":"MyFirstModule.Person_NewEdit_OneWidgetDirectly","t":"direct","type":"Pages$Page"},{"widgetid":"ClockPickerforMendix","unit":"LayoutModule.PageWithDirectWidget","t":"direct","type":"Pages$Page"},{"widgetid":"LabelSelect","unit":"LayoutModule.Layout","t":"direct","type":"Pages$Layout"},{"widgetid":"BooleanSlider","unit":"LayoutWithSnippet.SnippetWithWidget","t":"direct","type":"Pages$Snippet"},{"widgetid":"Counter","unit":"AnotherModule.TwoLevelSnippet","t":"direct","type":"Pages$Snippet"},{"widgetid":"BooleanSlider","unit":"AnotherModule.UsesLayoutWithWidget","t":"direct","type":"Pages$Page"},{"widgetid":"Counter","unit":"AnotherModule.PageWithDirectSnippet","t":"direct","type":"Pages$Page"}];
	processWidgetOccurences(result);
	please_wait.style.display = "none";

	setTimeout(function () {submit_btn.disabled = false;},500);
	
},2500);
*/
