const { Schema, model } = require('mongoose');
const reactions = require('./Reactions');
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now(),

    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactions],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});
const Thought = model('thought', thoughtSchema);
module.exports = Thought;