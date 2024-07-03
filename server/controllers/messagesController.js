const messageModel = require("../model/messageModel");
const Messages = require("../model/messageModel");

module.exports.getMessage = async (req, res, next) => {
    try {
      const { from, to } = req.body;
  
      const messages = await Messages.find({
        users: {
          $all: [from, to],
        },
      }).sort({ updatedAt: 1 });
  
      const projectedMessages = messages.map((msg) => {
        return {
          fromSelf: msg.sender.toString() === from,
          message: msg.message.text,
        };
      });
      res.json(projectedMessages);
    } catch (ex) {
      next(ex);
    }
  };
  

module.exports.addMessage = async (req, res, next) => {

    try {
const {from , to ,message} = req.body;

const data = await messageModel.create({

    message:{text:message},
    users: [from , to],
    sender: from

})

if(data){
    return res.json({msg: 'Message Added to the data-base'})

}
return res.json({msg: 'Message Not-Added to the data-base'})
        
    } catch (error) {
        next(error);
    }
}