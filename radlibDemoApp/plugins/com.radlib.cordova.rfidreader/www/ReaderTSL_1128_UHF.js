
var bluetooth = require('./CommBluetooth');
var resources = require('./Resources');
var ReaderTSL_1128_UHF = {};

ReaderTSL_1128_UHF.parse = function(success, failure, reader){
   var buffer = "";

   var parsedResults = function(data){
      var idIndex, returnVal = {}, nextFrameStart, currentFrame;

      buffer = buffer.concat(data);

      if (buffer.lastIndexOf("ER:") >= 0){
         nextFrameStart = buffer.lastIndexOf("ER:"); // couldn't add 3 on this line for some reason
         currentFrame = buffer.substring(0, nextFrameStart + 3);
      }
      else {
         nextFrameStart = buffer.lastIndexOf("OK:");
         currentFrame = buffer.substring(0, nextFrameStart);
      }

      // Errors and tag reads must happen twice for the parser to react
      if(currentFrame.indexOf("ER:001") >= 0){
         failure("ER:001 Command not recognized!");
         returnVal.report = "lost";
         buffer = buffer.substring(nextFrameStart, buffer.length);
      }
      else if(currentFrame.indexOf("ER:005") >= 0){
         failure("ER:005 No Transponder Found!");
         returnVal.report = "lost";
         buffer = buffer.substring(nextFrameStart, buffer.length);
      }
      else if(currentFrame.indexOf("ER:008") >= 0){
         failure("ER:008 Antenna Not Fitted!");
         returnVal.report = "lost";
         buffer = buffer.substring(nextFrameStart, buffer.length);
      }

      while (currentFrame.indexOf("EP: ") >= 0){
         document.getElementById("status").innerHTML = "TSL 1128: Tag Read!";
         idIndex = currentFrame.indexOf("EP: ");
         currentFrame = currentFrame.slice(0, idIndex) + currentFrame.slice(idIndex + 4, currentFrame.length); // remove "EP: " from the string
         returnVal.id = currentFrame.substring(idIndex, idIndex + 24);
         returnVal.report = "seen";
         returnVal.reader = "TSL 1128 UHF";
         returnVal.friendlyName = reader.friendlyName;
         returnVal.time = resources.getCurrentTime();
         returnVal.date = resources.getCurrentDate();
         success(returnVal);
      }

      buffer = buffer.substring(nextFrameStart, buffer.length);
   };
   
   //call bluetooth connect to get input stream
   bluetooth.connectStream(parsedResults, failure, reader.address);
};

module.exports = ReaderTSL_1128_UHF;
