const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// const monitor = require('./server/models/monitor');
// const isLoggedIn = require('./server/passport/passportService');
const RadiusServer = require('./server/radius_server/mk-radius-server');

const usersRouter = require('./server/routes/user');
const usersRouterApi = require('./server/routes/userAPI');
const sessionRouter = require('./server/routes/session');
const statusRouter = require('./server/routes/status');
const apiRouter = require('./server/routes/api');
const networkDevicesRouterOld = require('./server/routes/networkDevicesOld');
const mailRouter = require('./server/routes/mail');
const mailRouterApi = require('./server/routes/mailAPI');
const networkDeviceRouter = require('./server/routes/networkDevice');
const networkDeviceApi = require('./server/routes/networkDeviceAPI');
const placeRouter = require('./server/routes/place');
const placeApi = require('./server/routes/placeAPI');
const subscriptionRouter = require('./server/routes/subscription');
const subscriptionApi = require('./server/routes/subscriptionAPI');
const index = require('./server/routes/index');

const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

require('./server/passport/passport')(passport);

app.use(session({ secret: 'freewififorallfreewifibyaccionet' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());
// view engine setup -
app.set('views', path.join(__dirname, 'client/views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/public')));


app.post('/login', passport.authenticate('local-login', {
  successRedirect: '/front/network-device', // redirect to the secure profile section
  failureRedirect: '/login', // redirect back to the signup page if there is an error
  failureFlash: true, // allow flash messages
}));

// app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', index);
app.use('/api', usersRouterApi);
app.use('/session', sessionRouter);
app.use('/status', statusRouter);
app.use('/api', apiRouter);
app.use('/network_device', networkDevicesRouterOld);
app.use('/', networkDeviceRouter);
app.use('/', mailRouter);
app.use('/', mailRouterApi);
app.use('/', networkDeviceApi);
app.use('/', placeRouter);
app.use('/', placeApi);
app.use('/', subscriptionRouter);
app.use('/', subscriptionApi);

app.get('/login', (req, res) => {
  res.render(path.join(__dirname, 'client', 'views', 'login.ejs'), {
    message: req.flash('loginMessage'),
  });
});
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => { // eslint-disable-line
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// monitor.all();
RadiusServer.start();
module.exports = app;
