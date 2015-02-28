/**
 * Welcome to Pebble.js!
 *
 * A multiple gesture detection algorithm and counter.
 * By Max Hunt - 609556
 * Date - 15/01/2015
 */

//include Accel Pebble Libary
var Accel = require('ui/accel');
//iniate acceleometer
Accel.init();
//include UI Pebble Libary
var UI = require('ui');
//get vector Pebble Libary
var Vector2 = require('vector2');
//Screen for real time results
var CountScreen = new UI.Window();
//Elements for AccelerometerScreen
var TitleText = new UI.Text({ position: new Vector2(0,0), size: new Vector2(144, 168) });
//CountersText
var CounterShakeText = new UI.Text({ position: new Vector2(0,25), size: new Vector2(144, 168) });
var CounterTwistText = new UI.Text({ position: new Vector2(0,50), size: new Vector2(144, 168) });
var CounterXMoveText = new UI.Text({ position: new Vector2(0,75), size: new Vector2(144, 168) });
var CounterYMoveText = new UI.Text({ position: new Vector2(0,100), size: new Vector2(144, 168) });
var CounterZMoveText = new UI.Text({ position: new Vector2(0,125), size: new Vector2(144, 168) });

//var gesture = [[{x:'',y:'',z:''},{x:'50',y:'200',z:'20',xpos:'true',xneg:'false',ypos:'true',yneg:'false',zpos:'true',zneg:'true'}]];//lower hertz Values
//Gestures
var shake = [[{x:null,y:null,z:null},{x:100,y:100,z:100}],[{x:null,y:null,z:null},{x:100,y:100,z:100}],[{x:null,y:null,z:null},{x:100,y:100,z:100}],[{x:null,y:null,z:null},{x:100,y:100,z:100}]];

var twist = [[{x:null,y:null,z:null},{x:80,y:550,z:80}],[{x:null,y:null,z:null},{x:60,y:550,z:80}]];

var xMove = [[{x:null,y:null,z:null},{x:200,y:30,z:50}],[{x:null,y:null,z:null},{x:200,y:30,z:50}],[{x:null,y:null,z:null},{x:200,y:30,z:50}],[{x:null,y:null,z:null},{x:200,y:30,z:50}]];

var yMove = [[{x:null,y:null,z:null},{x:30,y:200,z:20}],[{x:null,y:null,z:null},{x:30,y:200,z:20}],[{x:null,y:null,z:null},{x:30,y:200,z:20}],[{x:null,y:null,z:null},{x:30,y:200,z:20}]];

var zMove = [[{x:null,y:null,z:null},{x:30,y:30,z:200}],[{x:null,y:null,z:null},{x:30,y:30,z:200}],[{x:null,y:null,z:null},{x:30,y:30,z:200}],[{x:null,y:null,z:null},{x:30,y:30,z:200}]];

//Array of gestures, sorted by priority
var gesture = [shake,twist,xMove,yMove,zMove];

//set the accelerometer values
Accel.config({
   rate: 25,
   sample: 5,
   subscribe: false
});

var counterShake = 0;
var counterTwist = 0;
var counterXMove = 0;
var counterYMove = 0;
var counterZMove = 0;

var inWristCount = false;

//start App screen
var main = new UI.Card({   
   icon: 'images/menu_icon.png',
   subtitle: 'Gesture Counter',
   body: 'Press the select button to start the counters.',
   scrollable: true
});

//start APP
console.log("App started");
main.show();
main.on('click', 'select', onClick);


function onClick(e) {
   inWristCount = true;
   console.log('Entered Counter');
   TitleText.text('Counter Screen');
   CountScreen.insert(0,TitleText);
   console.log("Title text added");
   CountScreen.show();
   CountScreen.on('click','back',onAccelBack);   
   CountScreen.on('accelData', onPeek);        
}
//Close Screen and Stop loop
function onAccelBack(){
   console.log('Close Screen and Stop Loop');
   inWristCount = false;
   CountScreen.hide();   
}
//Get Values for Acelerometer
function onPeek(e){   
   if (inWristCount === true){
      var frameArray = [];
      frameArray = arrayToFrames(e);
      var detection = detectGesture(frameArray);
      //frame of dectection
      if (detection[0]===true){
         console.log(JSON.stringify(frameArray));
      }
      insertElements(detection);       
   }
   else{
      console.log("emptyfunction");
      CountScreen.hide();
      Accel.config({
         subscribe: false
      });
   
   }      
}

//Convert the arrays into frames, so they can be processed
function arrayToFrames(e){
   var frameArray = [];
	for ( var i=0; i<e.accels.length-1; i++){
		frameArray.push([e.accels[i],e.accels[i+1]]);
	}
	return (frameArray);
}

//function/algorithm that detects the gestures
function detectGesture(frameArray){ 
   for (var i=0, framelength = frameArray.length-1;  i<framelength; i++){
      //console.log(frameArray[i][0].vibe);
      if ((frameArray[i][0].vibe === true)||(frameArray[i][0].vibe === true)){
         //console.log("frame " + i + "failed" );
      }
      else{
         //console.log("else");
         for(var k=0, overall = gesture.length-1; k <= overall; k++){
            for (var j=0, len = gesture[k].length-1; j <= len; j++){
               if ((Math.abs(frameArray[i][1].z-frameArray[i][0].z)>=gesture[k][j][1].z)&&
                (Math.abs(frameArray[i][1].y-frameArray[i][0].y)>=gesture[k][j][1].y)&&
                (Math.abs(frameArray[i][1].x-frameArray[i][0].x)>=gesture[k][j][1].x)){
                  if (len === j){
                     console.log("Detection on: " +k);
                     Accel.config({subscribe: false});                  
                     //setTimeout(function(){Accel.config({subscribe: true});}, 1000);
                     return [true,k];
                  }
                  else{
                     console.log("Next Frame");
                  }
               }
               else{
                  break;
               }
            }
         }
      }      
   }
   //console.log("No Detecion");
   return(false);  
}

//Insert onto screen
function insertElements(detection) {
   if (detection[0]===true){
      switch(detection[1]){
         case 0:
            counterShake++;
            break;
         case 1:
            counterTwist++;
            break;
         case 2:
            counterXMove++;
            break;
         case 3:
            counterYMove++;
            break;
         case 4:
            counterZMove++;
            break;
      }
   }
   Accel.config({subscribe: true});
   CounterShakeText.text('No. of Shakes: ' + counterShake);
   CounterTwistText.text('No. of Twists: ' + counterTwist);
   CounterXMoveText.text('No. of X : ' + counterXMove);
   CounterYMoveText.text('No. of Y : ' + counterYMove);
   CounterZMoveText.text('No. of Z : ' + counterZMove);   
   CountScreen.insert(1,CounterShakeText);
   CountScreen.insert(2,CounterTwistText);
   CountScreen.insert(3,CounterXMoveText);
   CountScreen.insert(4,CounterYMoveText);
   CountScreen.insert(5,CounterZMoveText);
   CountScreen.show();
}