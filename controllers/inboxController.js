// Model
const Conversation = require('../models/Converstion') ;
const People = require('../models/People') ;


// Inbox page 
const getInbox = async (req, res) => {
    try {
        const user_id = req.user._id ; // Logged in user ID 
        const all_conversation = await Conversation.find({'creator': user_id }, 'participant last_updated')
        .populate({
            path: 'participant',
            select: ['name', 'avatar'] 
        })
        .sort({ last_updated: -1 });
        res.render('inbox', {
            all_conversation
        })
    } catch (error) {
        console.log(error) ;
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

// Get message of the selected conversation 
const getMessage = async (req, res) => {
    try {
        const { conversation_id } = req.body ;
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