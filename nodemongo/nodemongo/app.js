//필요한 모듈 가져오기 
const express = require('express')
const morgan = require('morgan')
const nunjucks = require('nunjucks')
const multer = require('multer')
const mongoClient = require('mongodb').MongoClient

const fs = require('fs')
const path = require('path')

//웹 서버 설정
const app = express()
app.set('port', process.env.PORT || 2000)

//디버깅을 위한 morgan 설정
app.use(morgan('dev'))

var db; //데이터베이스 객체를 저장할 변수
var databaseUrl = 'mongodb://localhost:27017/'

//시작 요청
app.get('/', (req, res) => {
	mongoClient.connect(databaseUrl, function(err, databse){
		if(err != null){
			res.send("에러 내용:" + err);
		}else{
			res.send("데이터베이스 접속 성공")
		}
	})
});

//컬렉션의 전체 데이터 가져오기 요청
app.get('/item/list', (req, res) => {
	mongoClient.connect(databaseUrl, function(err, database){
		if(err != null){
			res.json({'count':0});
		}else{
			//데이터베이스 객체를 생성
			db = database.db('nodemongo')
			//필요한 작업을 수행 - item 컬렉션의 모든 데이터 가져오기
			db.collection('item').find().toArray(function(err, items){
				if(err != null){
					res.json({'count':0})
				}else{
					res.json({'count':items.length, 'list':items})
				}
			})
		}
	})
});

//컬렉션의 상세보기 요청
app.get('/item/detail', (req, res) => {
	//파라미터 읽기 - 파라미터는 항상 문자
	const itemid = req.query.itemid
	mongoClient.connect(databaseUrl, function(err, database){
		if(err != null){
			res.json({'item':null});
		}else{
			//데이터베이스 객체를 생성
			db = database.db('nodemongo')
			//필요한 작업을 수행 - item 컬렉션에서 조건에 맞는 데이터 1개  가져오기
			//문자열을 숫자로 변경할 때는 Number(문자열)
			db.collection('item').findOne({'itemid':Number(itemid)},
					 function(err, item){
				if(err != null){
					res.json({'item':null})
				}else{
					res.json({'item':item})
				}
			})
		}
	})
});

//item/date 요청이 오면 update.txt 파일의 내용을 읽어서 출력
app.get('/item/date', (req, res) => {
	//파일의 내용 읽기
	fs.readFile('./update.txt', function(err, data){
		res.json({'result': data.toString()});
	})	
});

//post 방식의 파라미터를 읽기 위한 설정
var bodyparser = require('body-parser')
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
	extended:true
}))

//item/delete 요청이 post 방식으로 온 경우 처리
app.post('/item/delete', (req, res) => {
	//파라미터 읽기
	var itemid = req.body.itemid
	//데이터베이스 연결 
	mongoClient.connect(databaseUrl, function(err, database){
		//에러 처리
		if(err != null){
			res.json({'result': false});
		}else{
			//사용할 데이터베이스 와 연결
			db = database.db('nodemongo');
			//컬렉션에서 조건에 맞는 데이터 삭제
			db.collection('item').deleteOne({'itemid':Number(itemid)}, 
					function(err, result){
				//지워진 행이 없는 경우
				if(result.result.n == 0){
					res.json({'result': false})
				}else{
					res.json({'result':true})
					//성공한 시간을 update.txt 파일에 기록
					const writeStream = fs.createWriteStream('./update.txt');
					writeStream.write(Date.now().toString());
					writeStream.end();
				}
			});
		}
	})
})

//파일 업로드를 위한 설정

//1.디렉토리 설정
try{
	fs.readdirSync('img')
}catch(err){
	fs.mkdirSync('img');
}
//2.파일 업로드 옵션 설정
const upload = multer({
	storage:multer.diskStorage({
		destination(req, file, done){
			done(null, 'img/')
		},filename(req, file, done){
			const ext = path.extname(file.originalname);
			done(null, path.basename(file.originalname, ext) + Date.now() + ext);
		},
	}),
	limits:{fileSize:10*1024*1024}
})

//item/insert 요청이 post 방식으로 전송된 경우 처리
app.post('/item/insert',upload.single('pictureurl'), (req, res) => {
	//파라미터 읽어오기
	const itemname = req.body.itemname
	const price = req.body.price
	const description = req.body.description
	
	//업로드된 파일 이름
	var pictureurl
	//파일이 있는 경우
	if(req.file){
		pictureurl = req.file.filename
	}else{
		pictureurl = 'default.jpg'
	}
	
	//데이터베이스 연결
	mongoClient.connect(databaseUrl, function(err,database){
		if(err != null){
			res.json({'result': false});
		}else{
			//nodemongo 라는 데이터베이스를 사용할 수 있도록 db에 대
			db = database.db('nodemongo')
			//가장 큰 itemid 가져오기
			db.collection('item').find({},{projection:{_id:0, itemid:1}})
				.sort({'itemid':-1}).limit(1).toArray(function(err, result){
						if(err != null){
							res.json({'result': false});
						}else{
							var itemid = 1
							if(result.length != 0){
								itemid = result[0].itemid + 1
							}
							//데이터 삽입
							db.collection('item').insert({'itemid':itemid, 'itemname':itemname, 
								'price':price, 'description':description, 'pictureurl':pictureurl},
								 	function(err, result){
										if(err != null){
											res.json({'result': false});
										}else{
											//파일에 삽입한 시간을 저장
											const writeStream = fs.createWriteStream('./update.txt')
											writeStream.write(Date.now().toString())
											writeStream.end()
											
											res.json({'result': true});
										}
								})
						}
				})
		}
	});
	
});


//파일 다운로드를 위한 모듈 추출
var util = require('util')
var mime = require('mime') //mime : 파일의 종류를 나타내는 것


//img/이미지파일이름 요청을 처리하는 코드
app.get('/img/:fileid', (req, res) => {
	//img 뒤에 있는 내용을 가져오기 
	var fileid = req.params.fileid
	//다운로드 받을 파일의 절대 경로 생성
	var file = '/Users/a30403/Desktop/Node/nodemongo/img' + 
		'/' + fileid
	//mime type 알아내기
	mimetype = mime.lookup(fileid)
	//헤더에 부착
	res.setHeader('Content-disposition', 'attachment; filename' + fileid);
	res.setHeader('Content-type', mimetype);
	//파일 전송
	var filestream = fs.createReadStream(file)
	filestream.pipe(res)
})

//item/insert 요청이 get 방식으로 온 경우 처리
app.get('/item/insert', (req, res) => {
	res.sendFile(path.join(__dirname, 'insert.html'))
})

//item/delete 요청이 get 방식으로 온 경우 처리
app.get('/item/delete', (req, res) => {
	res.sendFile(path.join(__dirname, 'delete.html'))
})

//서버 실행
app.listen(app.get('port'), () =>{
	console.log('서버 실행 중')
});