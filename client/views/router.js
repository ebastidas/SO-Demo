Router.configure({
	templateNameConverter: "upperCamelCase",
	routeControllerNameConverter: "upperCamelCase",
	layoutTemplate: "layout",
	notFoundTemplate: "notFound",
	loadingTemplate: "loading"
});

var publicRoutes = ["home_public", "login", "register", "forgot_password", "reset_password"];
var privateRoutes = ["home_private", "vendors", "vendors.insert", "vendors.details", "vendors.edit", "invoices", "invoices.insert", "invoices.details", "invoices.details.items", "invoices.details.insert", "invoices.details.edit", "invoices.edit", "user_settings", "user_settings.profile", "user_settings.change_pass", "logout"];
var zonelessRoutes = [];

var roleMap = [
	
];

this.firstGrantedRoute = function() {
	var grantedRoute = "";
	_.every(privateRoutes, function(route) {
		if(routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;
	});

	if(grantedRoute == "") {
		if(routeGranted("home_private")) {
			return "home_private";				
		} else {
			return "home_public";
		}
	}

	return grantedRoute;
}

// this function returns true if user is in role allowed to access given route
this.routeGranted = function(routeName) {
	if(!routeName) {
		// route without name - enable access (?)
		return true;
	}

	if(!roleMap || roleMap.length === 0) {
		// this app don't have role map - enable access
		return true;
	}

	var roleMapItem = _.find(roleMap, function(roleItem) { return roleItem.route == routeName; });
	if(!roleMapItem) {
		// page is not restricted
		return true;
	}

	if(!Meteor.user() || !Meteor.user().roles) {
		// user is not logged in
		return false;
	}

	// this page is restricted to some role(s), check if user is in one of allowedRoles
	var allowedRoles = roleMapItem.roles;
	var granted = _.intersection(allowedRoles, Meteor.user().roles);
	if(!granted || granted.length === 0) {
		return false;
	}

	return true;
};

Router.ensureLogged = function() {
	if(Meteor.userId() && (!Meteor.user() || !Meteor.user().roles)) {
		return;
	}

	if(!Meteor.userId()) {
		// user is not logged in - redirect to public home
		this.redirect("home_public");
	} else {
		// user is logged in - check role
		if(!routeGranted(this.route.getName())) {
			// user is not in allowedRoles - redirect to private home
			var redirectRoute = firstGrantedRoute();
			this.redirect(redirectRoute);
		} else {
			this.next();
		}
	}
};

Router.ensureNotLogged = function() {
	if(Meteor.userId() && (!Meteor.user() || !Meteor.user().roles)) {
		return;
	}

	if(Meteor.userId()) {
		var redirectRoute = firstGrantedRoute();
		this.redirect(redirectRoute);
	}
	else {
		this.next();
	}
};

Meteor.subscribe("current_user_data");

Router.onBeforeAction(function() {
	// loading indicator here
	if(!this.ready()) {
		$("body").addClass("wait");
	} else {
		$("body").removeClass("wait");
		this.next();
	}
});

Router.onBeforeAction(Router.ensureNotLogged, {only: publicRoutes});
Router.onBeforeAction(Router.ensureLogged, {only: privateRoutes});

Router.map(function () {
	
	this.route("home_public", {path: "/", controller: "HomePublicController"});
	this.route("login", {path: "/login", controller: "LoginController"});
	this.route("register", {path: "/register", controller: "RegisterController"});
	this.route("forgot_password", {path: "/forgot_password", controller: "ForgotPasswordController"});
	this.route("reset_password", {path: "/reset_password/:resetPasswordToken", controller: "ResetPasswordController"});
	this.route("home_private", {path: "/home_private", controller: "HomePrivateController"});
	this.route("vendors", {path: "/vendors", controller: "VendorsController"});
	this.route("vendors.insert", {path: "/vendors/insert", controller: "VendorsInsertController"});
	this.route("vendors.details", {path: "/vendors/details/:vendorId", controller: "VendorsDetailsController"});
	this.route("vendors.edit", {path: "/vendors/edit/:vendorId", controller: "VendorsEditController"});
	this.route("invoices", {path: "/invoices", controller: "InvoicesController"});
	this.route("invoices.insert", {path: "/invoices/insert", controller: "InvoicesInsertController"});
	this.route("invoices.details", {path: "/invoices/details/:invoiceId", controller: "InvoicesDetailsController"});
	this.route("invoices.details.items", {path: "/invoices/details/:invoiceId/items", controller: "InvoicesDetailsItemsController"});
	this.route("invoices.details.insert", {path: "/invoices/details/:invoiceId/insert", controller: "InvoicesDetailsInsertController"});
	this.route("invoices.details.edit", {path: "/invoices/details/:invoiceId/edit/:itemId", controller: "InvoicesDetailsEditController"});
	this.route("invoices.edit", {path: "/invoices/edit/:invoiceId", controller: "InvoicesEditController"});
	this.route("user_settings", {path: "/user_settings", controller: "UserSettingsController"});
	this.route("user_settings.profile", {path: "/user_settings/profile", controller: "UserSettingsProfileController"});
	this.route("user_settings.change_pass", {path: "/user_settings/change_pass", controller: "UserSettingsChangePassController"});
	this.route("logout", {path: "/logout", controller: "LogoutController"});
});
