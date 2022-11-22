const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (reqs, res) => {
	const req={
		body:{
			username:"armen21",
			password:"Armen.21.06",
			email:'armen21mkrtchyan0616@gmail.com'
		}
	}
	res.status(200).json({bosy:{name:"Armen",body:reqs.body}});


	try {
		//generate new password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);
		const emailLowerCase = await req.body.email.toLowerCase();

		console.log("AAAA",emailLowerCase)

		//create new user
		const newUser = new User({
			username: req.body.username,
			email: emailLowerCase,
			password: hashedPassword,
		});

		//save user and respond
		const user = await newUser.save();
		res.status(200).json(user);
	} catch (err) {
		console.log("err",err)

		res.status(500).json(err);
	}
});

// //LOGIN
// router.post("/login", async (reqp, res) => {
	const req={
		body:{
			password:"Armen.21.06",
			email:'armen21mkrtchyan0616@gmail.com'
		}
	}
// 	try {
// 		const user = await User.findOne({
// 			email: req.body.email.toLowerCase(),
// 		});

// 		!user && res.status(404).json("user not found");

// 		const validPassword = await bcrypt.compare(
// 			req.body.password,
// 			user.password
// 		);
// 		!validPassword && res.status(400).json("wrong password");

// 		res.status(200).json(user);
// 	} catch (err) {
// 		res.status(500).json(err);
// 	}
// });


// test
router.post("/login", async (req, res) => {
	const req={
		body:{
			password:"Armen.21.06",
			email:'armen21mkrtchyan0616@gmail.com'
		}
	}
			const user = await User.findOne({
			email: req.body.email.toLowerCase(),
		});

				!user && res.status(404).json("user not found");

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		!validPassword && res.status(400).json("wrong password");

		res.status(200).json(user);
});

module.exports = router;
