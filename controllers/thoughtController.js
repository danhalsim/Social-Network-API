const { Thought, User } = require('../models');

module.exports = {

  async getAllThoughts(req, res) {
    try {
      const allThoughts = await Thought.find()
        .populate('reactions');
      res.json(allThoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // get thought by id
  async getSingleThought(req, res) {
    try {
      const singleThought = await Thought.findOne({ _id: req.params.thoughtId })
        .populate('reactions');

      if (!singleThought) {
        return res.status(404).json({ message: 'No thought with that ID was found' });
      }

      res.json(singleThought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // create a new thought and add it to the user
  async createThought(req, res) {
    try {
      const newThought = await Thought.create(req.body);
      const updateUser = await User.findOneAndUpdate(
        { username: req.body.username },
        { $addToSet: { thoughts: newThought._id } },
        { new: true },
      )
        .populate('thoughts')
        .populate('friends')

      if (!updateUser) {
        return res.status(400).json(err)
      }
      res.json(updateUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateThought(req, res) {
    try {
      const updateThought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { new: true }
      )
        .populate('reactions')

      if (!updateThought) {
        return res.status(404).json(err);
      }
      res.json(updateThought);
    } catch (err) {
      res.status(500).json(err)
    }
  },

  async deleteThought(req, res) {
    try {
      const deleteThought = await Thought.findOneAndDelete(
        { _id: req.params.thoughtId }
        )

        .populate('thoughts')
        .populate('friends')

      if (!deleteThought) {
        return res.status(404).json(err);
      }

      res.json(deleteThought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async createReaction(req, res) {
    try {
      const createReaction = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $push: { reactions: req.body } },
        // { $addToSet: { reactions: req.body } }, // test
        { runValidators: true, new: true }
      );

      if (!createReaction) {
        return res.status(400).json(err);
      }

      res.json(createReaction);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async deleteReaction(req, res) {
    try {
      const deleteReaction = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { new: true }
      );

      if (!deleteReaction) {
        return res.status(404).json(err);
      }

      res.json(deleteReaction);
    } catch (err) {
      res.status(500).json(err)
    }
  }
};