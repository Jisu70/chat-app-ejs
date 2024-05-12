const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema({
  creator: {
    id: {
      type: mongoose.Types.ObjectId,
      ref: 'People',
      required: true
    },
  },
  participant: {
    id: {
      type: mongoose.Types.ObjectId,
      ref: 'People',
      required: true
    },
  },
  last_updated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
