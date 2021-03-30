// args console 출력 시 index가 0번 noderuntime의 위치, 1번 해당 파일 실행 경로,
// index = 2번부터 파일 실행 시 입력한 값을 배열로 리턴
var args = process.argv;
console.log(args[2]);

console.log('A');
console.log('B');
if(args[2] === '1'){
  console.log('C1');
} else {
  console.log('C2');
}
console.log('D');