this.InvoicesInsertController = RouteController.extend({
	template: "InvoicesInsert",
	

	yieldTemplates: {
		/*YIELD_TEMPLATES*/
	},

	onBeforeAction: function() {
		/*BEFORE_FUNCTION*/
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("loading"); }
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("vendors"),
			Meteor.subscribe("all_invoices")
		];
		var ready = true;
		_.each(subs, function(sub) {
			if(!sub.ready())
				ready = false;
		});
		return ready;
	},

	data: function() {
		

		return {
			params: this.params || {},
			vendors: Vendors.find({}, {}),
			all_invoices: Invoices.findOne({}, {})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
	}
});