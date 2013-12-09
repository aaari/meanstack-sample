var mongo = require('mongodb');
var Db = mongo.Db,
  BSON = mongo.BSONPure;

var mongoUri = 'mongodb://localhost/contentdb';

// CRUDのC
// セッション内のUIDに紐付けてデータを作成する
exports.create = function(req, res) {
  var uid = req.user.uid;
  var content = JSON.parse(req.body.mydata);
  content.uid = uid;
  Db.connect(mongoUri, function(err, db) {
    db.collection('todolist', function(err, collection) {
      collection.insert(content, {safe: true}, function(err, result) {
        res.send();
        db.close();
      });
    });
  });
};

// CRUDのR
// セッション内のUIDに関連するデータのみ検索する
exports.read = function(req, res) {
  var uid = req.user.uid;
  Db.connect(mongoUri, function(err, db) {
    db.collection('todolist', function(err, collection) {
      collection.find({'uid': uid}).toArray(function(err, items) {
        res.send(items);
        db.close();
      });
    });
  });
};

// CRUDのU
// セッション内のUIDに関連するデータのみ検索する
exports.update = function(req, res) {
  var content = JSON.parse(req.body.mydata);
  var id = req.params.id;
  var uid = req.user.uid;
  var updatedata = {};

  updatedata.data = content.data;
  updatedata.checked = content.checked;
  updatedata.uid = uid;

  Db.connect(mongoUri, function(err, db) {
    db.collection('todolist', function(err, collection) {
      collection.update({'_id':new BSON.ObjectID(id), 'uid': uid}, updatedata, {upsert:true}, function(err, result) {
        res.send();
        db.close();
      });
    });
  });
};

// CRUDのD
exports.delete = function(req, res) {
  var id = req.params.id;
  var uid = req.user.uid;

  Db.connect(mongoUri, function(err, db) { // add Db.connect
    db.collection('todolist', function(err, collection) {
      collection.remove({'_id':new BSON.ObjectID(id), 'uid': uid}, {safe:true}, function(err, result) {
        res.send();
        db.close();
      });
    });
  });
};
