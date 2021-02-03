function simpleTimeout(consoleTimer){
    console.timeEnd(consoleTimer);
}
console.time("twoSecond");
setTimeout(simpleTimeout, 2000, "twoSecond");
console.time("oneSecond");
setTimeout(simpleTimeout, 1000, "oneSecond");
console.time("fiveSecond");
setTimeout(simpleTimeout, 5000, "fiveSecond");
console.time("50MilliSecond");
setTimeout(simpleTimeout, 50, "50MilliSecond");

var x=0, y=0, z=0;
function displayValues(){
    console.log("X=%d; Y=%d; Z=%d", x, y, z);
}
function updateX(){
    x += 1;
}
function updateY(){
    y += 1;
}
function updateZ(){
    z += 1;
    displayValues();
}
setInterval(updateX, 500);
setInterval(updateY, 1000);
setInterval(updateZ, 2000);

var fs = require("fs");
fs.stat("nexttick.js", function(){
    console.log("nexttick.js Exists");
});
setImmediate(function(){
    console.log("Immediate Timer 1 Executed")
});
setImmediate(() => {
    console.log("Immediate Timer 2 Executed")
});
process.nextTick(function(){
    console.log("Next tick 1 Executed");
});
process.nextTick(() => {
    console.log("Next tick 2 Executed");
});