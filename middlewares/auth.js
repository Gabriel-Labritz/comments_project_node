// middleware check if user is authenticated to acess any routes
module.exports.checkAuth = function (req, res, next) {
  const userId = req.session.userid;

  if (!userId) {
    res.redirect("/login");
  }

  next();
};
