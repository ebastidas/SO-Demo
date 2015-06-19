this.VendorsDetailsController = RouteController.extend({
	template: "VendorsDetails",
	

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
			Meteor.subscribe("vendor_details", this.params.vendorId)
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
			vendor_details: Vendors.findOne({_id:this.params.vendorId}, {transform:function(doc) { var sum = 0; Invoices.find({ vendorId: doc._id }).map(function(item) { sum += item.totalAmount; }); doc.totalAmount = sum; return doc; }})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
	}
});