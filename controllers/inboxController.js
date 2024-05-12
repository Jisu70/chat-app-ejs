// Model
const Conversation = require('../models/Converstion') ;
const People = require('../models/People') ;


// 
const getInbox = async (req, res) => {
    try {
        const user_id = req.user._id ; // Logged in user ID 
        const all_conversation = await Conversation.find({'creator.id': user_id }, 'participant last_updated')
        .populate({
            path: 'participant.id',
            select: 'name avatar' 
        })
        .sort({ last_updated: -1 });
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
        const { id } = req.body;
        const creat_conversation = new Conversation({
            creator: {
                id: req.user._id
            },
            participant: {
                id: id 
            }
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

// Get message of the selected conversation 
const getMessage = async (req, res) => {
    try {
        const { conversation_id, name} = req.body ;
        // const get_conversation_message = await 
    } catch (error) {
        console.log(error);

    }
}

module.exports = {
    getInbox,
    crerateConversation,
    getMessage
}