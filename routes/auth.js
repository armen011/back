const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");


//CHECK USER
router.post('/check_user',async (req,res)=>{
	const query=req.query
	const email=query.email
	const username=query.username

	const isEmailUsed =await User.findOne({
		email,
	})
	const isUsernameUsed= await User.findOne({
		username,
	})

	if(!username || !email){
		res.status(403).json({field:"",text:"Email and username are required"})
	}else if(isEmailUsed){
		res.status(403).json({field:"email",text:"Email is already used"})
	}else if(isUsernameUsed){
		res.status(403).json({field:"username",text:"Username is already used"})
	}else{
		res.status(200).json({status:'ok',username,email})
	}
})

//REGISTER
router.post("/register", async (req, res) => {
	const query=req.query
	const email=query.email
	const username=query.username
	const password=query.password
	const dateOfBirth=query.dateOfBirth
	const fullName=query.fullName

	try {
		if(!username || !email|| !password || !dateOfBirth || !fullName){
			res.status(403).json({field:"",text:"email,username,password,dateOfBirth and fullName are required"})
		}else{

		//generate new password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const emailLowerCase = await email.toLowerCase();

		//create new user
		const newUser = new User({
			username,
			email: emailLowerCase,
			password: hashedPassword,
			dateOfBirth,
			fullName
		});

		//save user and respond
		const user = await newUser.save();
		res.status(200).json(user);
	}

	} catch (err) {
		res.status(500).json(err);
	}
});

//LOGIN
router.post("/login", async (req, res) => {

	const query=req.query
	const login=query.login
	const password=query.password

	try {
		const user = await User.findOne({
			email:login,
		}) || await User.findOne({username:login})

		!user && res.status(404).json("user not found");

		const validPassword = await bcrypt.compare(
			password,
			user.password
		);
		!validPassword && res.status(400).json("wrong password");

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
