var events = require("events");
var emitter = new events.EventEmitter();
emitter.emit("simpleEvent");

function MyObj(){
    events.EventEmitter.call(this);
}
MyObj.prototype.__proto__ = events.EventEmitter.prototype;

var myObj = new MyObj();
myObj.emit("someEvent");

function myCallback (){
    console.log("콜백 함수");
}
var myObject = new MyObj();
myObject.on("someEvent", myCallback);