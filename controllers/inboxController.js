// Model
const Conversation = require('../models/Converstion')

// 
const getInbox = async (req, res) => {
    try {
        const user_id = req.user._id ;
        const all_conversation = await Conversation.find({'creator.id': user_id }, 'participant last_updated').sort({ last_updated: -1 });
        res.render('inbox', {
            all_conversation
        })
    } catch (error) {
        console.log(error)
    }
}

// create conversation
const crerateConversation = async (req, res) => {
    try {
        const { participant,id,avatar } = req.body;
        const creat_conversation = new Conversation({
            creator: {
                id: req.user._id,
                name: req.user.name,
                avatar: req.user.avatar
            },
            participant: {
                name: participant,
                id: id,
                avatar: avatar || null,
            },
        })

        const save_conversation = await creat_conversation.save();

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

module.exports = {
    getInbox,
    crerateConversation
}