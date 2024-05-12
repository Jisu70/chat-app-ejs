const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema({
  creator: {
    type: mongoose.Types.ObjectId,
    ref: 'People',
    required: true
  },
  participant: {
    type: mongoose.Types.ObjectId,
    ref: 'People',
    required: true
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
