"use strict";

var mendixplatformsdk_1 = require("mendixplatformsdk");
var mendixmodelsdk_1 = require("mendixmodelsdk");
var when = require("when");

var widgets_occ = new Array(); //a list of all direct widget occurances
var embedables_occ = new Array(); //a list of all embedable elements (snippet&layout) occurances

var combined_widget_occ = new Array(); //final list of widget occurances, including those resulting from embedable elements
/*
function findAllCustomWidgets(model) {
    var units = model.allUnits();
    debugger;
    return loadAllUnits(units).then(function(units) { processAllUnits(units); });
}

function loadAllUnits(units) {
    return  when.all(units.map(function (unit) { return mendixplatformsdk_1.loadAsPromise(unit); }));
}

function processAllUnits(units) {
    return  when.all(units.map(function (unit) { return findWidgets(unit); }));

}
*/
function findAllCustomWidgets(model) {
    return loadAllDocuments(model.allDocuments())
            .then(function (documents) { debugger; return processDocuments(documents); });
    
}
function loadAllDocuments(documents) {
    return when.all(documents.map(function (doc) { return mendixplatformsdk_1.loadAsPromise(doc); }));
}
function processDocuments(documents) {
    return when.all(documents.map(function (doc) { return findWidgets(doc); }));
}

function findWidgets(unit) {
    console.log("Unit:"+unit._registeredQualifiedName);
    //iterate through the unit find all CustomWidget an Snippet elements and add them to coresponding lists
    unit.traverse(function (structure) {
        if ("CustomWidgets$CustomWidget" == structure.typeName) {
            var widgettype = structure.toJSON()["type"]["widgetId"];
            widgettype = widgettype.substr(widgettype.lastIndexOf(".") + 1);
            widgets_occ.push({ "widgetid": widgettype, "unit": unit.qualifiedName, "type": unit.typeName });
        }
        if ("Pages$SnippetCallWidget" == structure.typeName) {
            var snippet = structure.toJSON()["snippetCall"]["snippet"];
            embedables_occ.push({ "type_embedable": "snippet", "name": snippet, "unit": unit.qualifiedName, "type": unit.typeName });
        }
        if ("Pages$LayoutCall" == structure.typeName) {
            var layout = structure.toJSON()["layout"];
            embedables_occ.push({ "type_embedable": "layout", "name": layout, "unit": unit.qualifiedName, "type": unit.typeName });
        }
    });
    //console.log(widgets_occ);
    //console.log(embedables_occ);
    return when.resolve();
}
function dealWithEmedables(occurences) {
    //iterate thrugh embedable calls to find if custom widgets are being used
    var occurences_through_embedables = new Array();

    var findEmbedables = function (widget_occ) {
        //given a custom widget occurence (in a snippet or a layout), finds all pages where this customwidget is being used
        for (var _i = 0, _a = embedables_occ.filter(function (t) { return t["name"] == widget_occ["unit"]; }); _i < _a.length; _i++) {
            var embedable = _a[_i];
            if (embedable["type"] != 'Pages$Page') {
                //add it back on the list so that we find the cctual page later in a recursive call
                occurences_through_embedables.push(
                    { "widgetid": widget_occ["widgetid"],
                      "unit": embedable["unit"], 
                      "type": embedable["type"] 
                    });
            }
            else {
                //we have reached a page, so this is the final usage point for this custom widget
                combined_widget_occ.push(
                    { "widgetid": widget_occ["widgetid"], 
                      "unit": embedable["unit"], 
                      "t": "indirect" });
            }
        }
    };
    for (var _i = 0, _a = occurences.filter(function (e) { return e["type"] != 'Pages$Page'; }); _i < _a.length; _i++) {
        var widget_occ = _a[_i];
        findEmbedables(widget_occ);
    }
    return occurences_through_embedables;
}



function main() {
    var username = 'andrej.gajduk@mansystems.de';
    var apikey = '01bf9690-6388-4e43-ad98-2f0c7936af42';
    var projectName = "NewApp-1486125021786";
    var projectID = "bc6dcf5b-aa32-4e50-9faf-174edc4a5dc1";
    getCustomWidgetsMAIN(username,apikey,projectID, function (widgets_occurances) {
        console.log(widgets_occurances);
    });
}

function getCustomWidgetsMAIN(username,apikey,projectID,callback) {


    widgets_occ = new Array(); //a list of all direct widget occurances
    embedables_occ = new Array(); //a list of all embedable elements (snippet&layout) occurances

    combined_widget_occ = new Array(); //final list of widget occurances, including those resulting from embedable elements

    var client = new mendixplatformsdk_1.MendixSdkClient(username, apikey);
    var project = new mendixplatformsdk_1.Project(client, projectID);
    var error_handeler = function(error) {
        errorHandler(error);
        callback(error,null);
    };
    project.createWorkingCopy()
        .then(function (workingCopy) { return findAllCustomWidgets(workingCopy.model()); })
        .done(function () {
            console.log(widgets_occ);
            console.log(embedables_occ);
        var occurences_through_embedables = dealWithEmedables(widgets_occ);
        while (occurences_through_embedables.length > 0) {
            occurences_through_embedables = dealWithEmedables(occurences_through_embedables);
        }
        console.log(combined_widget_occ);
        for (var _i = 0, _a = widgets_occ; _i < _a.length; _i++) {
            var e = _a[_i];
            combined_widget_occ.push({ "widgetid": e["widgetid"], "unit": e["unit"], "t": "direct" , "type": e["type"] });
        }
        console.log(combined_widget_occ);
        callback(null,combined_widget_occ);
    }, error_handeler);
}


function errorHandler(error) {
    console.log(error);
    console.error(Date.now() + ": Something went wrong:");
    console.error(error);
}


export const CustomWidgets = {
    getWidgets: function(username,apikey,projectID,callback) {
        getCustomWidgetsMAIN(username,apikey,projectID,callback);
    }
}