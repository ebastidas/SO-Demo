this.InvoicesDetailsEditController = RouteController.extend({
	template: "InvoicesDetails",
	

	yieldTemplates: {
		'InvoicesDetailsEdit': { to: 'InvoicesDetailsSubcontent'}
		
	},

	onBeforeAction: function() {
		/*BEFORE_FUNCTION*/
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("InvoicesDetails"); this.render("loading", { to: "InvoicesDetailsSubcontent" });}
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("vendors"),
			Meteor.subscribe("invoice_details", this.params.invoiceId),
			Meteor.subscribe("invoice_item", this.params.itemId)
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
			invoice_details: Invoices.findOne({_id:this.params.invoiceId}, {transform:function(doc) { var vendor = Vendors.findOne({_id: doc.vendorId }); if(vendor) doc.vendorName = vendor.name; return doc; }}),
			invoice_item: InvoiceItems.findOne({_id:this.params.itemId}, {})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
	}
});