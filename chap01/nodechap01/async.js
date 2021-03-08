const fs = require('fs');
console.log('시작');

// asynchronous 방식으로 각각 구문 동작 시 실행 순서를 컨트롤 할 수 없다.
fs.readFile('./test.txt', (err, data) => {
	if (err) {
		throw err;
	}
	console.log('1번', data.toString());
});

fs.readFile('./test.txt', (err, data) => {
	if (err) {
		throw err;
	}
	console.log('2번', data.toString());
});

fs.readFile('./test.txt', (err, data) => {
	if (err) {
		throw err;
	}
	console.log('3번', data.toString());
});
console.log('끝');
