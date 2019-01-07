function isLoggedIn(req, res, next) {
  // if (req.isAuthenticated()) {
  if (true) {
    return next();
  }
  logout(req, res);
}

function logout(req, res) {
  // if they aren't redirect them to the home page
  req.logout();
  res.redirect('/login');
}

module.exports = isLoggedIn;
