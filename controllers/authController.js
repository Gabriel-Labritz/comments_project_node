const bcrypt = require("bcryptjs");
const User = require("../models/User");

module.exports = class AuthController {
  static login(req, res) {
    res.render("auth/login");
  }

  static async loginSave(req, res) {
    const { email, password } = req.body;

    // check if email match
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      req.flash("message", "Ops!, o usuário não foi encontrado.");
      res.render("auth/login");
      return;
    }

    // check if password match
    const comparePassword = bcrypt.compareSync(password, user.password);

    if (!comparePassword) {
      req.flash(
        "message",
        "Ops! a senha informada está incorreta, tente novamente."
      );
      res.render("auth/login");
      return;
    }

    // if authenticated initialize session
    req.session.userid = user.id;
    req.flash("message", "Login realizado com sucesso!");

    req.session.save(() => {
      res.redirect("/");
    });
  }

  static register(req, res) {
    res.render("auth/register");
  }

  static async registerSave(req, res) {
    const { name, email, password, confirmpassword } = req.body;

    // check if password match
    if (password !== confirmpassword) {
      req.flash("message", "A senha informada não confere, tente novamente!");
      res.render("auth/register");
      return;
    }

    // check if user exists in the database
    const userExists = await User.findOne({ where: { email: email } });

    if (userExists) {
      req.flash(
        "message",
        "Ops!, o email informado já foi cadastrado, tente novamente informando outro email!"
      );
      res.render("auth/register");
      return;
    }

    // create a user password encrypted
    const salt = bcrypt.genSaltSync(10);
    const userPasswordEncrypted = bcrypt.hashSync(password, salt);

    const user = { name, email, password: userPasswordEncrypted };

    // create a user in the database
    try {
      const createdUser = await User.create(user);

      // initilize session
      req.session.userid = createdUser.id;
      req.flash("message", "Cadastro realizado com sucesso!");

      req.session.save(() => {
        res.redirect("/");
      });
    } catch (err) {
      console.log("Ocorreu um erro!", err);
    }
  }

  static logOut(req, res) {
    req.session.destroy();
    res.redirect("/login");
  }
};
