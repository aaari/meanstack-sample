var express = require('express'),
  http = require('http'),
  path = require('path'),
  db = require('./db.js'),
  application_root = __dirname;

/* passportの設定 */
var passport = require('passport'),
  TwitterStrategy = require('passport-twitter').Strategy;

// Passport: TwitterのOAuth設定
passport.use(new TwitterStrategy({
  consumerKey: "your key",
  consumerSecret: "your secret",
  callbackURL: "/auth/twitter/callback"
}, function(token, tokenSecret, profile, done) {
  console.log('id: ' + profile.id + " provider:" + profile.provider + " dispname:" + profile.displayName);
  // ユーザIDを設定
  profile.uid = profile.provider + profile.id;
  process.nextTick(function() {
    return done(null, profile);
  });
}));

// Serialized and deserialized methods when got from session
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Define a middleware function to be used for every secured routes
// 認証が通っていないところは401を返すための関数
var auth = function(req, res, next){
  if (!req.isAuthenticated()) {
    res.send(401);
  } else {
    next();
  }
};

var app = express();
app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('view engine', 'ejs');

  // AngularJSのディレクトリを静的ファイルとして追加
  app.use(express.static(path.join(application_root, "app")));

  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  // OAuth認証用
  app.use(express.session({ secret: 'hogehoge', cookie: {maxAge: 1000 * 60 * 60 * 24 * 30} }));
  app.use(passport.initialize()); // Add passport initialization
  app.use(passport.session());    // Add passport initialization

  app.use(app.router);
});

// route to log in
app.get("/auth/twitter", passport.authenticate('twitter'));
app.get("/auth/twitter/callback", passport.authenticate('twitter', {
  successRedirect: '/',
  falureRedirect: '/login'
}));

// ブラウザのURLで/loginにアクセスするとエラーになるためリダイレクトする
app.get('/login', function(req, res) {
  res.redirect('/');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/todo', auth, db.read); // GETの処理。要認証
app.post('/todo', auth, db.create); // POSTの処理。要認証
app.delete('/todo/:id', auth, db.delete); // DELETEの処理。要認証
app.put('/todo/:id', auth, db.update); // PUTの処理。要認証

// サーバ起動
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
