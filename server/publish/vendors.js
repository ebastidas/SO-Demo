Meteor.publish("vendor_list", function() {
	return Vendors.find({ownerId:this.userId}, {transform:function(doc) { var sum = 0; Invoices.find({ vendorId: doc._id }).map(function(item) { sum += item.totalAmount; }); doc.totalAmount = sum; return doc; }});
});

Meteor.publish("vendors_empty", function() {
	return Vendors.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("vendor_details", function(vendorId) {
	return Vendors.find({_id:vendorId,ownerId:this.userId}, {transform:function(doc) { var sum = 0; Invoices.find({ vendorId: doc._id }).map(function(item) { sum += item.totalAmount; }); doc.totalAmount = sum; return doc; }});
});

Meteor.publish("vendor", function(vendorId) {
	return Vendors.find({_id:vendorId,ownerId:this.userId}, {});
});

Meteor.publish("vendors", function() {
	return Vendors.find({ownerId:this.userId}, {});
});

