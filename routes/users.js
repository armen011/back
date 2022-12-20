const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

//update user
router.put("/:id", async (req, res) => {
	// checks to see if user ID matches or is admin
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		if (req.body.password) {
			try {
				const salt = await bcrypt.genSalt(10);
				req.body.password = await bcrypt.hash(req.body.password, salt);
			} catch (err) {
				return res.status(500).json(err);
			}
		}
		try {
			const user = await User.findByIdAndUpdate(req.params.id, {
				$set: req.body,
			});
			res.status(200).json("Account has been updated");
		} catch (err) {
			return res.status(500).json(err);
		}
	} else {
		return res.status(403).json("You can update only your account!");
	}
});

//delete user
router.delete("/:id", async (req, res) => {
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		try {
			await User.findByIdAndDelete(req.params.id);
			res.status(200).json("Account has been deleted");
		} catch (err) {
			return res.status(500).json(err);
		}
	} else {
		return res.status(403).json("You can delete only your account!");
	}
});
//get a user
router.get("/:id", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		// removes password and updatedAt from data
		const { password, updatedAt, ...other } = user._doc;
		res.status(200).json(other);
	} catch (err) {
		res.status(500).json(err);s
	}
});

//Search user 
router.get("/", async (req, res) => {
	try {
		const query=req.query.query
		const users = await User.find()
		const searchedUsers=users.map((user)=>{
			console.log("USER",user.username,query)
			const upperCaseUsername=user.username.toUpperCase()
			const upperCaseQuery=query.toUpperCase()
			if(upperCaseUsername.includes(upperCaseQuery)){
				return {fullName:user.fullName,img:user.profilePicture,username:user.username,id:user._id}
			}
		}).filter(user=>!!user)
		// removes password and updatedAt from data
		res.status(200).json(searchedUsers);
	} catch (err) {
		res.status(500).json(err);
	}
});

//follow a user
router.put("/:id/follow", async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);
			if (!user.followers.includes(req.body.userId)) {
				await user.updateOne({ $push: { followers: req.body.userId } });
				await currentUser.updateOne({
					$push: { followings: req.params.id },
				});
				res.status(200).json("user has been followed");
			} else {
				res.status(403).json("you allready follow this user");
			}
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(403).json("you cant follow yourself");
	}
});

//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);
			if (user.followers.includes(req.body.userId)) {
				await user.updateOne({ $pull: { followers: req.body.userId } });
				await currentUser.updateOne({
					$pull: { followings: req.params.id },
				});
				res.status(200).json("user has been unfollowed");
			} else {
				res.status(403).json("you dont follow this user");
			}
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(403).json("you cant unfollow yourself");
	}
});

module.exports = router;
