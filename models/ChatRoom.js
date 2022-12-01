const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema(
	{
		creatorId: {
			type: String,
			required: true,
		},
		memberId: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("ChatRoom", ChatRoomSchema);
