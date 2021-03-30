const fs = require('fs');

console.log('시작');
// asynchronous 파일 읽기의 콜백 함수 내  다시 비동기식 함수 포함시켜서 호출 시 순서를 갖게 됨
fs.readFile('./test.txt', (err, data) => {
	if (err) {
		throw err;
	}
	console.log('1번', data.toString());
	fs.readFile('./test.txt', (err, data) => {
		if (err) {
			throw err;
		}
		console.log('2번', data.toString());
		fs.readFile('./test.txt', (err, data) => {
			if (err) {
				throw err;
			}
			console.log('3번', data.toString());
			console.log('끝');
		});
	});
});