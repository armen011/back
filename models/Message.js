const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
	{
		from: {
			type: String,
			required: true,
		},
		to: {
			type: String,
			required: true,
		},
        chatId:{
			type: String,
			required: true,
		},
        viewdBy:{
                type: Array,
                default: [],
        },
        text:{
            type: String,
        }
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
