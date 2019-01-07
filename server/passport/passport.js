// config/passport.js

// load all the things we need
const LocalStrategy = require('passport-local').Strategy;
// load up the user model
const User = require('../models/table-gateway/user');


// expose this function to our app using module.exports
module.exports = function auth(passport) {
  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
      done(null, user);
    }).catch((err) => {
      done(err);
    });
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-signup', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with username
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true, // allows us to pass back the entire request to the callback
  },
    (req, username, password, done) => {
      // asynchronous
      // User.findOne wont fire unless data is sent back
      process.nextTick(() => {
        // find a user whose username is the same as the forms username
        // we are checking to see if the user trying to login already exists
        User.find({
          username,
        })
          .then((users) => {
            const user = users[0];
            // check to see if theres already a user with that username
            if (user) {
              return done(null, false, req.flash('signupMessage',
                'Ya existe un usuario con ese nombre de usuario.'));
            }
            // if there is no user with that username
            // create the user
            User.new().then((newUser) => {
              // set the user's local credentials
              newUser = req.body;
              delete newUser.id;
              newUser.email_verified = false;
              // save the user
              User.save(newUser).then((user) => {
                return done(null, user);
              }).catch((err) => {
                if (err) {
                  return done(req.flash('signupMessage', err));
                }
              });
            }).catch((err) => {
              // if there are any errors, return the error
              if (err) {
                return done(err);
              }
            });
          }).catch((err) => {
            return done(err);
          });
      });
    }));

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-login', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with username
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true, // allows us to pass back the entire request to the callback
  }, (req, username, password, done) => {
      // callback with username and password from our form
      // find a user whose username is the same as the forms username
      // we are checking to see if the user trying to login already exists
    User.find({
      username,
    }).then((users) => {
      const user = users[0];
      // if no user is found, return the message
      if (!user) {
        return done(null, false, req.flash('loginMessage', 'Usuario no existe.')); // req.flash is the way to set flashdata using connect-flash
      }

      // if the user is not active notify that
      if (!user.is_active) {
        return done(null, false, req.flash('loginMessage', 'Usuario no se encuentra activo. Para activarlo contacte a Accionet')); // req.flash is the way to set flashdata using connect-flash
      }
      // if the user is found but the password is wrong
      if (!User.validPassword(user, password)) {
        return done(null, false, req.flash('loginMessage', 'Contraseña incorrecta.')); // create the loginMessage and save it to session as flashdata
      }
      return done(null, user);
    }).catch((err) => {
      return done(err);
    });
  }));
};
