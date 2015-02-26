//These comments are extremely obviously who writes in javascript/nodejs, so
//generally they should not even be in the file like this
//but these are provided here since some of you have never touched js/nodejs
//Should probably delete these sort of comments in the end.

//require the necessary external files
var bluetooth = require("./CommBluetooth");
var rc522 = require("./ReaderArduino_RC522_LF");
var tsl1128 = require("./ReaderTSL_1128_UHF");
var internalCam = require("./InternalBarcodeScanner");

//create empty object to be exported
var radlib = {};

radlib.connect = function(success, failure, reader) {
   switch(reader.connection) {
      case "BLUETOOTH":
         if (reader.model === "ARDUINORC522LF"){
            rc522.parse(success, failure, reader);
         } 
         else if (reader.model === "TSL1128UHF"){
            tsl1128.parse(success, failure, reader);
         }else{
            failure("ERROR: Unsupported bluetooth model");
         }
         break;
      case "CAMERA":
         internalCam.scanBarcode(success, failure);

         break;
      default:
         failure("ERROR: Not valid connection type!");
         break;
   }
};

radlib.scan = function (success, failure, connectionTypes) {
   if(connectionTypes.indexOf("BLUETOOTH") >= 0){
      bluetooth.startDiscovery(success, failure);
   };

};

//export object with all its functions
module.exports = radlib;