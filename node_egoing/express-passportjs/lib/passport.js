module.exports = function(app){

    var authData = {
        email: 'egoing777@gmail.com',
        password: '111111',
        nickname: 'egoing'
      }    

    // passport는 session을 내부적으로 사용하므로 세션 선언 후에 작성되야함
    var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

    // passport를 사용하기 위한 구문
    app.use(passport.initialize()); 
    // 내부적으로 session 사용
    app.use(passport.session());  

    // 로그인 성공 시 한 번만 호출되며 user 식별자를 session store에 passport property로 저장
    passport.serializeUser(function(user, done) {
        //console.log('serializeUser', user);
        done(null, user.email);
    });

    // 로그인 성공 후 페이지 방문마다 callback이 호출
    // 식별자로 DB에서 데이터를 조회해서 가져옴
    passport.deserializeUser(function(id, done) {
        //console.log('deserializeUser', id);
        done(null, authData);
    // User.findById(id, function(err, user) {
    //   done(err, user);
    // });
    });

    // 사용자가 로그인을 시도할 때 로그인 성공 유무를 나타내는 코드
    passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'pwd'
    },
    function(username, password, done) {
        //console.log('LocalStrategy', username, password)
        if(username === authData.email){
            if(password === authData.password){
                return done(null, authData);
            } else{
                return done(null, false, { message: 'Incorrect password.' });
            }
        } else{
                return done(null, false, { message: 'Incorrect username.' });
        }
    })); 
    return passport; 
}
