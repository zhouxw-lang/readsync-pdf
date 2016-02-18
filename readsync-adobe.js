app.addToolButton({cName: "SavePos", cLabel: "SavePosition", cEnable: "event.rc = (app.doc != null);", cExec: "savePos();" });
app.addToolButton({cName: "RestorePos", cLabel: "RestoreLatestPosition", cEnable: "event.rc = (app.doc != null);", cExec: "restorePos();" });
app.addToolButton({cName: "CountPos", cLabel: "CountPositions", cEnable: "event.rc = (app.doc != null);", cExec: "countPos();" });
app.addToolButton({cName: "ClearPos", cLabel: "ClearAllPositions", cEnable: "event.rc = (app.doc != null);", cExec: "clearPos();" });

const APP_ID = "LangCB3K_RDSync";
const APP_VERSION = "V1";
const APP_STR = APP_ID + "-" + APP_VERSION;

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
	
	this.saveAs({
		cPath: this.path,
		bPromptToOverwrite: false,
		cFS: ""
	});

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
	}

	app.endPriv();
});

var countPos = app.trustedFunction( function() {

	app.beginPriv();

	this.syncAnnotScan();
	var annots = this.getAnnots({});
	var count = 0;
	if (annots) {
		for (var i = 0; i < annots.length; i++) {
			if (APP_STR === annots[i].author) {
				count++;
			}
		}
	}
	
	app.alert("The number of reading positions is: " + count);

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
	
	this.saveAs({
		cPath: this.path,
		bPromptToOverwrite: false,
		cFS: ""
	});

	app.endPriv();
});

