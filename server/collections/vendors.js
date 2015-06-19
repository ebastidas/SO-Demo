Vendors.allow({
	insert: function (userId, doc) {
		return Vendors.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Vendors.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Vendors.userCanRemove(userId, doc);
	}
});

Vendors.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.ownerId) doc.ownerId = userId;
if(!doc.totalAmount) doc.totalAmount = 0;
});

Vendors.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Vendors.before.remove(function(userId, doc) {
	
});

Vendors.after.insert(function(userId, doc) {
	
});

Vendors.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Vendors.after.remove(function(userId, doc) {
	
});
