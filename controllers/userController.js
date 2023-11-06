const { User, Thought } = require('../models');

module.exports = {

  async getAllUsers(req, res) {
    try {
      const allUsers = await User.find()
        .populate('thoughts')
        .populate('friends');

      res.status(200).json(allUsers);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async getSingleUser(req, res) {
    try {
      const singleUser = await User.findOne(
        { _id: req.params.userId })
        .populate('thoughts')
        .populate('friends');

      if (!singleUser) {
        return res.status(404).json(err);
      }

      res.status(200).json(singleUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async createUser(req, res) {
    try {
      const createUser = await User.create({
        username: req.body.username,
        email: req.body.email
      });

      res.status(200).json(createUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateUser(req, res) {
    try {
      const updateUser = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      )
        .populate('thoughts')
        .populate('friends')

      if (!updateUser) {
        return res.status(404).json(err)
      }

      res.status(200).json(updateUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async deleteUser(req, res) {
    try {
      const deleteUser = await User.findOneAndDelete(
        { _id: req.params.userId });

      if (!deleteUser) {
        return res.status(404).json(err)
      }

      res.status(200).json(deleteUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // add another removeFriend as a friend
  async addFriend(req, res) {
    try {
      const addFriend = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $push: { friends: req.params.friendId } },
        { new: true }
      )
        .populate('thoughts')
        .populate('friends');

      if (!addFriend) {
        return res.status(404).json(err);
      }
      res.status(200).json(addFriend);
    } catch (err) {
      res.status(500).json(err)
    }
  },

  async removeFriend(req, res) {
    try {
      const removeFriend = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      )
        .populate("friends")
        .populate("thoughts");

      if (!removeFriend) {
        return res.status(404).json(err);
      }
      res.status(200).json(removeFriend);
    } catch (err) {
      res.status(500).json(err)
    }
  }
};