var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var bcrypt = require("bcryptjs");
var assert = require('assert');
var Schema = mongoose.Schema;

var Constants = require("../Route/Global_Const/Constants");

var userSchema = new Schema({
	name: String,
	email:{ type: String, required: true, unique: true },
	altEmail:{ type: String},
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	dob:Date,
	gender:String,
	mobile:String,
	altMobile:String,
	created_at: Date,
	updated_at: Date,
	loginAttempts: { type: Number, required: true, default: 0 },
	lockUntil: Number
});

userSchema.virtual('isLocked').get(function() {
  	return !!(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.methods.incrementLoginAttempts = function(callback) {
    var lockExpired = !!(this.lockUntil && this.lockUntil < Date.now());
    if (lockExpired) {
        return this.update({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        }, callback);
    }
    var updates = { $inc: { loginAttempts: 1 } };
    var needToLock = !!(this.loginAttempts + 1 >= Constants.login.maxAttempts && !this.isLocked);
    
    if (needToLock) {
        updates.$set = { lockUntil: Date.now() + Constants.login.lockoutHours };
    }
    return this.update(updates, callback);
};

userSchema.pre('save', function(next) {
	var currentDate = new Date();
	this.updated_at = currentDate;
	if (!this.created_at)
	this.created_at = currentDate;
	next();
});

var User = mongoose.model('User', userSchema);
module.exports = User;

module.exports.createNewUser = function(newUser , callback){
	bcrypt.genSalt(10, function(err, salt) {
		assert.ifError(err);
		bcrypt.hash(newUser.password, salt, function(err, hash) {
			assert.ifError(err);
			newUser.password = hash;
			newUser.save(callback);
		});
	});
};

module.exports.getUserByUsername = function(username , callback){
	var query = {username:username};
	User.findOne(query,callback);
};

module.exports.getUserById = function(id , callback){
	User.findById(id,callback);
};

module.exports.comparePassword = function(candidatePassword,hash,callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
		if(err) throw err;
			callback(null,isMatch);
	});
};

module.exports.recoverUserData = function(existingUser , callback){
  User.findOne({$or:[{email:existingUser.email,mobile:existingUser.mobile} , {altEmail:existingUser.email,altMobile:existingUser.mobile}] , dob:existingUser.dob},callback);
};

module.exports.getUserProfile = function(user,callback){
	User.findOne({username:user.username,name:user.name} , {_id:0,lockUntil:0,loginAttempts:0,isLocked:0,created_at:0,updated_at:0,password:0},callback);
};

module.exports.updateUserPassword = function(user , callback){
	bcrypt.genSalt(10, function(err, salt) {
		assert.ifError(err);
		bcrypt.hash(user.password, salt, function(err, hash) {
			assert.ifError(err);
			var id = new ObjectId(user['_id']);
			user.password = hash;
			User.update({_id:id.toHexString(),username:user.username} , {password:user.password} , {multi:false} , callback);
		});
	});
};

module.exports.updateUserProfile = function (user,callback) {
	if(user.password != undefined){
		bcrypt.genSalt(10, function(err, salt) {
			assert.ifError(err);
			bcrypt.hash(user.password, salt, function(err, hash) {
				assert.ifError(err);
				user.password = hash;
				User.update({username:user.username} , user , {multi:false} , callback);
			});
		});
	}
	else{
		User.update({username:user.username} , user , {multi:false} , callback);
	}
};