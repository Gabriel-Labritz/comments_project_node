const Comments = require("../models/Comments");
const User = require("../models/User");

const { Op } = require("sequelize");

module.exports = class CommentsController {
  // Create
  static createComments(req, res) {
    res.render("comments/create");
  }

  static async createCommentsSave(req, res) {
    const { title } = req.body;

    const comment = {
      title,
      UserId: req.session.userid,
    };

    try {
      await Comments.create(comment);

      req.flash("message", "Comentário adicionado com sucesso!");
      req.session.save(() => {
        res.redirect("/comments/dashboard");
      });
    } catch (err) {
      console.log("Ocorreu um erro!", err);
    }
  }

  // Read all comments from any users in the home page
  static async showComments(req, res) {
    let search = "";
    let order = "DESC";

    try {
      if (req.query.search) {
        search = req.query.search;
      }

      if (req.query.order === "old") {
        order = "ASC";
      } else {
        order = "DESC";
      }

      const commentsData = await Comments.findAll({
        include: User,
        where: { title: { [Op.like]: `%${search}%` } },
        order: [["createdAt", order]],
      });

      const comments = commentsData.map((comment) =>
        comment.get({ plain: true })
      );

      let commentsQty = comments.length;

      if (commentsQty === 0) {
        commentsQty = false;
      }

      res.render("comments/home", { comments, search, commentsQty });
    } catch (err) {
      console.log("Ocorreu um erro!", err);
    }
  }

  // Real all comments from user authenticated in the dashboard
  static async dashboard(req, res) {
    const userId = req.session.userid;
    let emptyComments = false;

    try {
      const user = await User.findOne({
        where: { id: userId },
        include: Comments,
        plain: true,
      });

      if (!user) {
        res.redirect("/login");
      }

      const commentsUser = user.Comments.map((comments) => comments.dataValues);

      if (commentsUser.length === 0) {
        emptyComments = true;
      }

      res.render("comments/dashboard", { commentsUser, emptyComments });
    } catch (err) {
      console.log("Ocorreu um erro!", err);
    }
  }

  // Update
  static async editComment(req, res) {
    const { id } = req.params;

    try {
      const comment = await Comments.findOne({ where: { id: id }, raw: true });

      res.render("comments/edit", { comment });
    } catch (err) {
      console.log("Ocorreu um erro!", err);
    }
  }

  static async editCommentSave(req, res) {
    const { id, title } = req.body;

    const comment = { id, title };

    try {
      await Comments.update(comment, { where: { id: id } });

      req.flash("message", "Comentário editado com sucesso!");

      req.session.save(() => {
        res.redirect("/comments/dashboard");
      });
    } catch (err) {
      console.log("Ocorreu um erro!", err);
    }
  }

  // Delete
  static async removeComment(req, res) {
    const { id } = req.body;
    const UserId = req.session.userid;

    try {
      await Comments.destroy({ where: { id: id, UserId: UserId } });

      req.flash("message", "Comentário removido com sucesso!");

      req.session.save(() => {
        res.redirect("/comments/dashboard");
      });
    } catch (err) {
      console.log("Ocorreu um erro !", err);
    }
  }
};
