# readsync-pdf
Plug-ins for saving and restoring reading positions for PDF files. Reading positions are stored in PDF files so together with a Sync applicatoin (Google Drive, OneDrive, etc) they can be synced across devices. 

Supported PDF readers:
* Adobe Acrobat Standard/Pro/Reader 7.0 or later.
* To be added.

## Install
Put `readsync-adobe.js` under JavaScripts folder folder, here are some exapmles:

|          Reader         |       OS       |                             Directory                             |
|:-----------------------:|:--------------:|:-----------------------------------------------------------------:|
| Adobe Acrobat Reader DC | Windows 10 x64 | C:\Program Files (x86)\Adobe\Acrobat Reader DC\Reader\Javascripts |
| Adobe Acrobat Reader DC |      OS X      |   $HOME/Library/Application Support/Adobe/Acrobat/DC/JavaScripts  |
|   Adobe Acrobat Pro DC  | Windows 10 x64 |    C:\Program Files (x86)\Adobe\Acrobat DC\Acrobat\Javascripts    |

## Getting Started
### For Adobe Acrobat
* Install readsync-pdf
* Start Adobe Acrobat and activate *Add-on Tools* toolbar. 
* Click on `SavePosition` button: a new reading position will be created and the document will be saved.
* Click on `RestoreLatestPosition` button: the latest reading position will be restored.
* Click on `ListSavedPositions` button: at most 20 latest saved positions will be listed. 
* Click on `ClearAllPositions` button: all reading positions will be deleted and the document will be saved.

## Known Issues
* Under Windows 10, auto-save does not work for documents containing commas in filename. When this happens, please manually save the documents.