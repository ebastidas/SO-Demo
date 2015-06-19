this.InvoicesController = RouteController.extend({
	template: "Invoices",
	

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
			Meteor.subscribe("invoice_list")
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
			invoice_list: Invoices.find({}, {transform:function(doc) { var vendor = Vendors.findOne({_id: doc.vendorId }); if(vendor) doc.vendorName = vendor.name; return doc; },sort:{invoiceNumber:-1}})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
	}
});