const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");

 const sendMessage= async ({from,to,chatId,text})=>{
    const messageData={from,
    to,
    chatId,
    viewdBy:[from],
    text
    }
    const newMessage = new Message(messageData);
    const savedMessage = await newMessage.save();
    const resolvedData={
        type:'receive',
        text:savedMessage.text,
        chatId:savedMessage.chatId,
        date:savedMessage.createdAt
    }
    return [[savedMessage.to],resolvedData]
}
module.exports={sendMessage}