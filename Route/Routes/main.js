module.exports.header = function (req, res) {
	if(req.user)
		res.render("partials/Main/Header",{UserName:req.user.name});
	else
		res.send(undefined);
};

module.exports.brand = function (req, res) {
	if(req.user)
		res.render("partials/Main/Brand",{UserName:req.user.name});	
	else
		res.send(undefined);
};

module.exports.banner = function (req, res) {
	if(req.user)
	    res.render("partials/Main/Banner");	
	else
		res.send(undefined);
};

module.exports.horizontalMenu = function (req, res) {
	if(req.user)
	    res.render("partials/Main/HorozontalMenu");
	else
		res.send(undefined);
};

module.exports.VerticalMenu = function (req, res) {
	if(req.user)
		res.render("partials/Main/VerticalMenu");
	else
		res.send(undefined);
};

module.exports.footer = function (req, res) {
	if(req.user)
		res.render("partials/Main/Footer");
	else
		res.send(undefined);
};

module.exports.login = function (req, res) {
    res.render("pages/User/login" , {redirectToLogin:false});
};

module.exports.signUp = function (req, res) {
    res.render("pages/User/register");
};

module.exports.forgotCredentials = function (req, res) {
    res.render("pages/User/forgotCredentials");
};

module.exports.logout = function (req, res) {
    req.logout();
	req.flash('success_msg', 'You are logged out');
	res.render('pages/User/logout');
};

module.exports.sessionData = function (req, res) {
	console.log(req.session.passport.user);
	if(req.session.passport.user != undefined)
	    res.send({status:"AUTHORIZED"});
	else
		res.send({status:"UNAUTHORIZED"})
};

module.exports.userProfile = function (req, res) {
    res.render("pages/User/profile");
};

module.exports.home = function (req, res) {
    res.render("pages/home");
};

module.exports.HTML = function (req, res) {
    res.render("pages/Learn/html");
};

module.exports.CSS = function (req, res) {
    res.render("pages/Learn/css");
};

module.exports.JS = function (req, res) {
    res.render("pages/Learn/javascript");
};

module.exports.designElement = function (req, res) {
    res.render("pages/Design/designElement");
};

module.exports.designComponent = function (req, res) {
    res.render("pages/Design/designComponent");
};

module.exports.designLayout = function (req, res) {
    res.render("pages/Design/designLayout");
};

module.exports.about = function (req, res) {
    res.render("pages/about");
};

module.exports.query = function (req, res) {
    res.render("pages/query");
};

module.exports.resourceNotFound = function (req, res) {
    res.render("partials/Main/resourceNotFound",{loggenIn:req.user});
};

module.exports.styleAdd = function (req, res) {
    res.render("pages/Design/styleAdd") ;
};