var censor = require("censorifybykarl");
console.log(censor.getCensoredWords());
console.log(censor.censor("some very sad, bad and mad text."));
censor.addCensoredWord("gloomy");
console.log(censor.getCensoredWords());
console.log(censor.censor("A very gloomy day."));