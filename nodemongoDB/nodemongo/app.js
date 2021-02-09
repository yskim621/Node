const express = require('express');
const morgan = require('morgan');
const path = require('path');
const multer = require('multer');
const fs = require('fs')

const app = express();
app.set('port', process.env.PORT || 7000);
app.use(morgan('dev'));

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
})); 

//파일 다운로드
var util = require('util')
var mime = require('mime')

try {
	fs.readdirSync('img');
} catch (error) {
	console.error('img 폴더가 없어 img 폴더를 생성합니다.');
	fs.mkdirSync('img');
}

const upload = multer({
	storage: multer.diskStorage({
		destination(req, file, done) {
			done(null, 'img/');
		},
		filename(req, file, done) {
			const ext = path.extname(file.originalname);
			done(null, path.basename(file.originalname, ext) + Date.now() + ext);
		},
	}),
	limits: { fileSize: 10 * 1024 * 1024 },
});

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).send(err.message)
});

app.listen(app.get('port'), () => {
	console.log(app.get('port'), '번 포트에서 대기 중');
});


var MongoClient = require('mongodb').MongoClient;
var db;

var databaseUrl = 'mongodb://localhost:27017/';

app.get('/item/all', (req, res, next) => {
	MongoClient.connect(databaseUrl, function(err, database) {
		if (err != null)
			res.json({'result':false}); 
		db = database.db('node');
		db.collection("item").find().sort({"itemid": -1}).toArray(function (err, items) {
			res.json({'count':items.length, 'list':items, 'result':true}); 
		});
	})
});


app.get('/item/list', (req, res, next) => {

	const pageno = req.query.pageno;
	const count = req.query.count;

	var start = 1;
	var size = 3;
	if(pageno != undefined && count != undefined){
		start = (pageno - 1) * count
		size = parseInt(count)
	}

	MongoClient.connect(databaseUrl, function(err, database) {
		if (err != null)
			res.json({'result':err}); 
		db = database.db('node');
		var len;
		db.collection("item").find().toArray(function (err, items) {
			len = items.length;
			db.collection("item").find().sort({"itemid": -1}).skip(start).limit(size).toArray(function (err, items) {
				res.json({'count':len, 'list':items}); 
			});
		});
	})
});


app.get('/item/detail', (req, res, next) => {
	const itemid = req.query.itemid;
	MongoClient.connect(databaseUrl, function(err, database) {
		if (err != null)
			res.json({'result':err}); 

		db = database.db('node');
		db.collection("item").findOne({ "itemid": Number(itemid) }, function (err, item) {
			if(item == null){
				res.json({'result': false}); 
			}else{
				res.json({'result': true, 'item': item}); 
			}
		});
	})
});

app.get('/img/:fileid', function(req, res){
	var fileId = req.params.fileid;
	var file = '/Users/mac/Documents/source/node/nodemongo/img' + '/' + fileId;
	console.log("file:" + file);
	mimetype = mime.lookup(fileId);
	console.log("file:" + mimetype);
	res.setHeader('Content-disposition', 'attachment; filename=' + fileId);
	res.setHeader('Content-type', mimetype);
	var filestream = fs.createReadStream(file);
	filestream.pipe(res);
});

app.post('/item/insert', upload.single('pictureurl'), (req, res, next) => {
	const itemname = req.body.itemname;
	const description = req.body.description;
	const price = req.body.price;
	var pictureurl;

	if(req.file){
		pictureurl = req.file.filename
	}else{
		pictureurl = "default.jpg";
	}

	MongoClient.connect(databaseUrl, function(err, database) {
		if (err != null)
			res.json({'result':false}); 
		db = database.db('node');

		db.collection("item").find({}, {projection: { _id: 0, itemid:1}}).sort({itemid:-1}).limit(1).toArray(function(err, result) {
			if (err) 
				res.json({'result':false}); 
			var itemid = 1;
			if(result[0] != null){
				itemid = result[0].itemid + 1;
			}
			db.collection("item").insert({ "itemid":itemid, "itemname": itemname, "description":description, "price":price, "pictureurl":pictureurl }, function (e, result) { 
				if (err){ 
					res.json({'result':false}); 
				}
				else{
					//현재 시간의 년월일 시분초 가져오기
					var date = new Date()
					var year = date.getFullYear();
					var month = (1 + date.getMonth());
					month = month >= 10 ? month : '0' + month;
					var day = date.getDate();
					day = day >= 10 ? day : '0' + day;

					var hour = date.getHours();
					hour = hour >= 10 ? hour : '0' + hour;
					var minute = date.getMinutes();
					minute = minute >= 10 ? minute : '0' + minute;
					var second = date.getSeconds();
					second = second >= 10 ? second : '0' + second;

					const writeStream = fs.createWriteStream('./update.txt');
					writeStream.write(year + '-' + month + '-' + day + " " + hour + ":" + minute + ":" + second);
					writeStream.end();
					res.json({'result':true})
				}
			});
		});
	});
});

app.get('/item/insert', (req, res, next) => {
	res.render('insert'); 
});

app.post('/item/update', upload.single('pictureurl'), (req, res, next) => {
	const itemid = req.body.itemid;
	const itemname = req.body.itemname;
	const description = req.body.description;
	const price = req.body.price;
	const oldpictureurl = req.body.oldpictureurl;
	var pictureurl;

	if(req.file){
		pictureurl = req.file.filename
	}else{
		pictureurl = oldpictureurl;
	}

	MongoClient.connect(databaseUrl, function(err, database) {
		if (err != null)
			res.json({'result':false}); 
		db = database.db('node');

		db.collection("item").update({ "itemid":Number(itemid)}, {$set:{"itemname": itemname, "description":description, "price":price, "pictureurl":pictureurl }}, function (e, result) { 
			if (err){ 
				res.json({'result':false}); 
			}
			else{
				//현재 시간의 년월일 시분초 가져오기
				var date = new Date()
				var year = date.getFullYear();
				var month = (1 + date.getMonth());
				month = month >= 10 ? month : '0' + month;
				var day = date.getDate();
				day = day >= 10 ? day : '0' + day;

				var hour = date.getHours();
				hour = hour >= 10 ? hour : '0' + hour;
				var minute = date.getMinutes();
				minute = minute >= 10 ? minute : '0' + minute;
				var second = date.getSeconds();
				second = second >= 10 ? second : '0' + second;

				const writeStream = fs.createWriteStream('./update.txt');
				writeStream.write(year + '-' + month + '-' + day + " " + hour + ":" + minute + ":" + second);
				writeStream.end();
				res.json({'result':true})
			}
		});
	});
});

app.get('/item/update', (req, res, next) => {
	res.render('update'); 
});

app.post('/item/delete', (req, res, next) => {
	MongoClient.connect(databaseUrl, function(err, database) {
		if (err != null)
			res.json({'result':false}); 

		db = database.db('node');
		const itemid = req.body.itemid;
		db.collection("item").deleteOne({"itemid":Number(itemid)}, function(e, result) {
			if(result.result.n == 0){
				res.json({"result":false});
			}else{
				//현재 시간의 년월일 시분초 가져오기
				var date = new Date()
				var year = date.getFullYear();
				var month = (1 + date.getMonth());
				month = month >= 10 ? month : '0' + month;
				var day = date.getDate();
				day = day >= 10 ? day : '0' + day;

				var hour = date.getHours();
				hour = hour >= 10 ? hour : '0' + hour;
				var minute = date.getMinutes();
				minute = minute >= 10 ? minute : '0' + minute;
				var second = date.getSeconds();
				second = second >= 10 ? second : '0' + second;

				const writeStream = fs.createWriteStream('./update.txt');
				writeStream.write(year + '-' + month + '-' + day + " " + hour + ":" + minute + ":" + second);
				writeStream.end();
				res.json({'result':true}) 
			}
		});
	});
});

app.get('/item/delete', (req, res, next) => {
	res.render('delete'); 
});

app.get('/item/date', (req, res, next) => {
	fs.readFile('./update.txt', function (err, data) { 
		res.json({'result':data.toString()}); 
	});
});


