Meteor.publish("invoices", function() {
	return Invoices.find({ownerId:this.userId}, {});
});

Meteor.publish("invoice_list", function() {
	return Invoices.find({ownerId:this.userId}, {transform:function(doc) { var vendor = Vendors.findOne({_id: doc.vendorId }); if(vendor) doc.vendorName = vendor.name; return doc; },sort:{invoiceNumber:-1}});
});

Meteor.publish("all_invoices", function() {
	return Invoices.find({ownerId:this.userId}, {});
});

Meteor.publish("invoice_details", function(invoiceId) {
	return Invoices.find({_id:invoiceId,ownerId:this.userId}, {transform:function(doc) { var vendor = Vendors.findOne({_id: doc.vendorId }); if(vendor) doc.vendorName = vendor.name; return doc; }});
});

Meteor.publish("invoice", function(invoiceId) {
	return Invoices.find({_id:invoiceId,ownerId:this.userId}, {});
});

