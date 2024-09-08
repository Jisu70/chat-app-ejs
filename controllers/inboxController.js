// Model
const Conversation = require('../models/Converstion') ;
const People = require('../models/People') ;
const Message = require('../models/Message') ;
const { formatDateTime } = require("../utilities/commonFunction")

// Inbox page 
const getInbox = async (req, res) => {
    try {
        const authenticated_userid = req.user._id ; 

        const all_conversations = await Conversation.find({
            $or: [{ creator: authenticated_userid }, { participant: authenticated_userid }]
        }, 'creator participant last_updated')
        .populate({
            path: 'participant',
            select: ['name', 'avatar'] 
        })
        .populate({
            path: 'creator',
            select: ['name', 'avatar'] 
        })
        .sort({ last_updated: -1 });
        
        const conversationsWithLastMessage = await Promise.all(all_conversations.map(async (conversation) => {
            const lastMessage = await Message.findOne({ conversation_id: conversation._id })
            .sort({ date_time: -1 }) 
            .select('text sender date_time')
            .lean();
 
            let otherUser;
            if (String(conversation.creator._id) === String(authenticated_userid)) {
                otherUser = {
                    _id: conversation.participant._id,
                    name: conversation.participant.name,
                    avatar: conversation.participant.avatar
                };
            } else {
                otherUser = {
                    _id: conversation.creator._id,
                    name: conversation.creator.name,
                    avatar: conversation.creator.avatar
                };
            }
            return {
                _id: conversation._id,
                otherUser: otherUser,
                lastmessage : lastMessage ?  {
                    _id: lastMessage._id,
                    text: lastMessage.text,
                    sender : authenticated_userid === String(lastMessage.sender.id) ? 'You' : otherUser.name,
                    date_time: formatDateTime(lastMessage.date_time)
                } : {}
            };
        }));
        
        res.render('inbox', {
            all_conversation: conversationsWithLastMessage,
            loggedinUserId : authenticated_userid 
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}


// create conversation
const crerateConversation = async (req, res) => {
    try {
        const { id } = req.body;
        const haveConversation = await Conversation.findOne({
            $or: [
                { creator: req.user._id, participant: id },
                { creator: id, participant: req.user._id }
            ]
        });     
        if (haveConversation) {
            return res.status(400).json({
                errors: {
                  common: {
                    msg: "Already have conversation.",
                  },
                },
            });
        }   
        const creat_conversation = new Conversation({
            creator: req.user._id,
            participant:  id 
        
        })

        await creat_conversation.save();

        res.status(200).json({
            message: "Conversation was added successfully!",
        });
      
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: {
              common: {
                msg: err.message,
              },
            },
        });
    }
}

// get messages of a conversation
async function getMessages(req, res, next) {
    try {
      const messages = await Message.find({
        conversation_id: req.params.conversation_id,
      }).sort("-createdAt");
  
      res.status(200).json({
        data : messages,
        loggedinUserId : req.user._id,
        conversation_id : req.params.conversation_id
      });
    } catch (err) {
      res.status(500).json({
        errors: {
          common: {
            msg: "Unknows error occured!",
          },
        },
      });
    }
  }



// Submit message
const submitMessage = async (req, res) => {
    try {
        const { conversation_id, attachments, message } = req.body;
        const loggedin_userid = req.user._id;
        const loggedin_username = req.user.name;

        // Find the conversation and populate creator and participant names
        const conversation = await Conversation.findById(conversation_id)
            .populate('creator', 'name')
            .populate('participant', 'name')
            .exec();

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        // Destructure the creator and participant details
        const { creator: { name: creator_name, _id: creator_id }, participant: { name: participant_name, _id: participant_id } } = conversation;

        // Determine receiver details based on logged-in user
        let receiverId, receiverName;
        if (loggedin_userid === creator_id.toString()) {
            receiverId = participant_id.toString();
            receiverName = participant_name;
        } else {
            receiverId = creator_id.toString();
            receiverName = creator_name;
        }

        // Create a new message instance
        const newMessage = new Message({
            text: message,
            attachment: attachments ? attachments.map(file => file.fileName) : [],
            sender: {
                id: loggedin_userid,
                name: loggedin_username,
            },
            receiver: {
                id: receiverId,
                name: receiverName,
            },
            conversation_id: conversation_id
        });

        // Save the message to the database
        const savedMessage = await newMessage.save();

        // Emit socket event for new message
        global.io.emit("new_message", {
            conversation_id: conversation_id,
            sender: {
                id: loggedin_userid,
                name: loggedin_username,
                avatar: null,
            },
            receiver: {
                id: receiverId,
                name: receiverName,
            },
            message: savedMessage.text,
            attachment: savedMessage.attachment,
            date_time: savedMessage.createdAt, // Extract the message creation time
        });

        // Send the newly created message back as a response
        res.status(201).json(savedMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};


module.exports = {
    getInbox,
    crerateConversation,
    getMessages,
    submitMessage
}