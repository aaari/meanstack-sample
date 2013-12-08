var express = require('express'),
  http = require('http'),
  path = require('path'),
  db = require('./db.js'),
  application_root = __dirname;

var app = express();
app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('view engine', 'ejs');

  // AngularJSのディレクトリを静的ファイルとして追加
  app.use(express.static(path.join(application_root, "app")));

  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.get('/todo', db.read); // GETの処理
app.post('/todo', db.create); // POSTの処理
app.delete('/todo/:id', db.delete); // DELETEの処理
app.put('/todo/:id', db.update); // PUTの処理

// サーバ起動
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
