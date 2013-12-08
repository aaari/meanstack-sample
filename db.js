var mongo = require('mongodb');
var Db = mongo.Db,
  BSON = mongo.BSONPure;

var mongoUri = 'mongodb://localhost/contentdb';

// CRUDのC
exports.create = function(req, res) {
  var content = JSON.parse(req.body.mydata);
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
exports.read = function(req, res) {
  Db.connect(mongoUri, function(err, db) {
    db.collection('todolist', function(err, collection) {
      collection.find({}).toArray(function(err, items) {
        res.send(items);
        db.close();
      });
    });
  });
};

// CRUDのU
exports.update = function(req, res) {
  var content = JSON.parse(req.body.mydata);
  var updatedata = {};
  updatedata.data = content.data;
  updatedata.checked = content.checked;
  var id = req.params.id;

  Db.connect(mongoUri, function(err, db) {
    db.collection('todolist', function(err, collection) {
      collection.update({'_id':new BSON.ObjectID(id)}, updatedata, {upsert:true}, function(err, result) {
        res.send();
        db.close();
      });
    });
  });
};

// CRUDのD
exports.delete = function(req, res) {
  var id = req.params.id;
  console.log(id);

  Db.connect(mongoUri, function(err, db) { // add Db.connect
    db.collection('todolist', function(err, collection) {
      collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
        res.send();
        db.close();
      });
    });
  });
};
