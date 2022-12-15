const router = require("express").Router();
const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");
const User = require("../models/User");

//create a Room
router.post("/", async (req, res) => {
  try {
    //check if room exists
    const myRoom = await ChatRoom.find(req.body);
    const invitedRoom = await ChatRoom.find({
      creatorId: req.body.memberId,
      memberId: req.body.creatorId,
    });
    const member = await User.findById(req.body.memberId);
    if (myRoom.length > 0 || invitedRoom.length > 0) {
      const currentRoom = myRoom.length > 0 ? myRoom : invitedRoom;
      console.log("Room already exists");
      const chat = {
        id: currentRoom[0].id,
        title: member.fullName,
        picture: member.profilePicture,
      };
      res.status(200).json(chat);
    } else {
      const newRoom = new ChatRoom(req.body);
      const savedRoom = await newRoom.save();
      console.log("----", savedRoom.id);
      res.status(200).json({
        id: savedRoom.id,
        title: member.fullName,
        picture: member.profilePicture,
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const myChats = await ChatRoom.find({ creatorId: req.query.user_id }).then(
      async (chats) => {
        if (chats.length === 0) {
          return chats;
        }
        const result = await Promise.all(
          chats.map(async (chat) => {
            try {
              const user = await User.findById(chat.memberId);
              return {
                id: chat.id,
                title: user.fullName,
                picture: user.profilePicture,
                userId: user.id,
              };
            } catch (err) {}
          })
        );
        return result.filter((chat) => !!chat);
      }
    );

    const invitedChats = await ChatRoom.find({
      memberId: req.query.user_id,
    }).then(async (chats) => {
      if (chats.length === 0) {
        return chats;
      }
      const result = await Promise.all(
        chats.map(async (chat) => {
          try {
            const user = await User.findById(chat.creatorId);
            return {
              id: chat.id,
              title: user.fullName,
              picture: user.profilePicture,
              userId: user.id,
            };
          } catch (err) {}
        })
      );
      return result.filter((chat) => !!chat);
    });

    const chats = [...myChats, ...invitedChats];
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/messages/:chatId/:userId", async (req, res) => {
  try {
    const resolvedMessages = await Message.find({
      chatId: req.params.chatId,
    }).then((messages) => {
      if (messages.length === 0) {
        return messages;
      }

      return messages.map((message) => {
        const type = message.from === req.params.userId ? "send" : "receive";
        const isNew = !message.viewdBy.includes(req.params.userId);

        return {
          type,
          text: message.text,
          chatId: message.chatId,
          date: message.createdAt,
          isNew,
        };
      });
    });

    res.status(200).json(resolvedMessages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
