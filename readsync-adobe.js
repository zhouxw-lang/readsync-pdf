app.addToolButton({cName: "SavePos", cLabel: "SavePosition", cEnable: "event.rc = (app.doc != null);", cExec: "savePos();" });
app.addToolButton({cName: "RestorePos", cLabel: "RestoreLatestPosition", cEnable: "event.rc = (app.doc != null);", cExec: "restorePos();" });
app.addToolButton({cName: "ListPos", cLabel: "ListSavedPositions", cEnable: "event.rc = (app.doc != null);", cExec: "listPos();" });
app.addToolButton({cName: "ClearPos", cLabel: "ClearAllPositions", cEnable: "event.rc = (app.doc != null);", cExec: "clearPos();" });

const APP_ID = "LangCB3K_RDSync";
const APP_VERSION = "V1";
const APP_STR = APP_ID + "-" + APP_VERSION;

const LIST_MAX_NUM = 20;

var savePos = app.trustedFunction( function() {

	var date = new Date();
	var ts = date.getTime();

	var stateName = APP_STR + "-" + ts;

	app.beginPriv();

	this.addAnnot(
	{
		type: "Circle",
		page: this.pageNum,
		rect: [0, 0, 0, 0],
		author: APP_STR,
		name: stateName,
		popupOpen: false,
		popupRect: [200,100,400,200],
		contents: this.viewState.toSource(),
		strokeColor: color.red,
		fillColor: ["RGB",1,1,.855],
		hidden: true
	});
	
	try {
		this.saveAs(this.path);
	} catch(e) {
		app.alert("Reading position was created but auto-save failed. You might need to save the document manually.");
	}

	app.endPriv();

});

var restorePos = app.trustedFunction( function() {

	app.beginPriv();

	this.syncAnnotScan();
	var annots = this.getAnnots({});
	var mostRecentState;
	var mostRecentDate;
	if (annots) {
		for (var i = 0; i < annots.length; i++) {
			if (APP_STR === annots[i].author) {
				if (!mostRecentDate || annots[i].modDate.getTime() >= mostRecentDate.getTime()) {
					mostRecentDate = annots[i].modDate;
					mostRecentState = annots[i].contents;
				}
			}
		}
	}
	
	if (mostRecentState) {
		this.viewState = eval(mostRecentState);
	} else {
		app.alert("There is no reading position in this document.");
	}

	app.endPriv();
});

var listPos = app.trustedFunction( function() {

	app.beginPriv();

	this.syncAnnotScan();
	var annots = this.getAnnots({});
	var relevantAnnots = [];
	if (annots) {
		for (var i = 0; i < annots.length; i++) {
			if (APP_STR === annots[i].author) {
				relevantAnnots.push(annots[i]);
			}
		}
	}
	
	var msg;
	if(relevantAnnots.length > 0) {
		msg = "The number of reading positions is: " + relevantAnnots.length + "\n\n" + "Here is a list of most recent (" + LIST_MAX_NUM + " max) reading positions:\n";
		
		relevantAnnots.sort(function compare(a, b) {return b.modDate.getTime() - a.modDate.getTime()});
		var total = Math.min(LIST_MAX_NUM, relevantAnnots.length);
		for (var i = 0; i < total; i++) {
			msg += "  Time: " + relevantAnnots[i].modDate.toLocaleString() + "\tPage: " + (relevantAnnots[i].page + 1) + "\n";
		}
	} else {
		msg = "There is no reading position in this document.";
	}
	app.alert(msg, 3);

	app.endPriv();
});

var clearPos = app.trustedFunction( function() {

	if (app.alert("All the reading positions will be deleted and this document will be saved. Is it OK?", 2, 2) !== 4) {
		return;
	}

	app.beginPriv();

	this.syncAnnotScan();
	var annots = this.getAnnots({});
	var count = 0;
	if (annots) {
		for (var i = 0; i < annots.length; i++) {
			if (APP_STR === annots[i].author) {
				annots[i].destroy();
			}
		}
	}
	
	try {
		this.saveAs(this.path);
	} catch(e) {
		app.alert("Reading positions were cleared but auto-save failed. You might need to save the document manually.");
	}

	app.endPriv();
});

