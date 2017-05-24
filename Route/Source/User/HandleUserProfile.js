var User = require("../../../Model/users");

module.exports.getUserProfile = function (req,res) {
    User.getUserProfile(req.user , function(err,user){
		if(err) throw err;
		res.send(user);
	});
};

module.exports.updateUserProfile = function (req, res, next) {
    var name = req.body.name;
	var email = req.body.email;
	var altEmail = req.body.altEmail;
	var dob = req.body.dob;
	var altMobile = req.body.altMobile;
	var mobile = req.body.mobile;
	var username = req.body.username;
	var password = req.body.password;

	req.checkBody('name' , 'Name is required').notEmpty();
	req.checkBody('dob' , 'Email is required').notEmpty();
	req.checkBody('email' , 'Email is required').notEmpty();
	req.checkBody('email' , 'Invalid Email').isEmail();
	req.checkBody('mobile' , 'Phone No. is required').notEmpty();
	req.checkBody('username' , 'Username is required').notEmpty();
	if(altEmail){
		req.checkBody('altEmail' , 'Invalid Altername Email').isEmail();
	}
	if(altMobile){
		req.checkBody('altMobile' , 'Invalid alternate phone number').notEmpty();
	}
	if(password){
		req.checkBody('password' , 'Password is required').notEmpty();
		req.checkBody('cpassword' , 'Both password do not match').equals(req.body.password);
	}
	
	var errors = req.validationErrors();

	if(errors){
		res.send(JSON.stringify(errors));
	}
	else{
		User.updateUserProfile(req.body , function (err , raw) {
			if(err) throw err;
			if(raw.n >= 1){
				res.send(JSON.stringify({status:"Success"}));
			}
			else{
				res.send(JSON.stringify({status:"Failed"}));
			}
		});
	}
};