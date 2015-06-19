var pageSession = new ReactiveDict();

Template.Vendors.rendered = function() {
	
};

Template.Vendors.events({
	
});

Template.Vendors.helpers({
	
});

var VendorsViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("VendorsViewSearchString");
	var sortBy = pageSession.get("VendorsViewSortBy");
	var sortAscending = pageSession.get("VendorsViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name", "email", "website", "totalAmount"];
		filtered = _.filter(raw, function(item) {
			var match = false;
			_.each(searchFields, function(field) {
				var value = (getPropertyValue(field, item) || "") + "";

				match = match || (value && value.match(regEx));
				if(match) {
					return false;
				}
			})
			return match;
		});
	}

	// sort
	if(sortBy) {
		filtered = _.sortBy(filtered, sortBy);

		// descending?
		if(!sortAscending) {
			filtered = filtered.reverse();
		}
	}

	return filtered;
};

var VendorsViewExport = function(cursor, fileType) {
	var data = VendorsViewItems(cursor);
	var exportFields = ["name", "email", "website", "totalAmount"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.VendorsView.rendered = function() {
	pageSession.set("VendorsViewStyle", "table");
	
};

Template.VendorsView.events({
	"submit #dataview-controls": function(e, t) {
		return false;
	},

	"click #dataview-search-button": function(e, t) {
		e.preventDefault();
		var form = $(e.currentTarget).parent();
		if(form) {
			var searchInput = form.find("#dataview-search-input");
			if(searchInput) {
				searchInput.focus();
				var searchString = searchInput.val();
				pageSession.set("VendorsViewSearchString", searchString);
			}

		}
		return false;
	},

	"keydown #dataview-search-input": function(e, t) {
		if(e.which === 13)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					var searchString = searchInput.val();
					pageSession.set("VendorsViewSearchString", searchString);
				}

			}
			return false;
		}

		if(e.which === 27)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					searchInput.val("");
					pageSession.set("VendorsViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("vendors.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		VendorsViewExport(this.vendor_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		VendorsViewExport(this.vendor_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		VendorsViewExport(this.vendor_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		VendorsViewExport(this.vendor_list, "json");
	}

	
});

Template.VendorsView.helpers({

	"insertButtonClass": function() {
		return Vendors.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.vendor_list || this.vendor_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.vendor_list && this.vendor_list.count() > 0;
	},
	"isNotFound": function() {
		return this.vendor_list && pageSession.get("VendorsViewSearchString") && VendorsViewItems(this.vendor_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("VendorsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("VendorsViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("VendorsViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("VendorsViewStyle") == "gallery";
	}

	
});


Template.VendorsViewTable.rendered = function() {
	
};

Template.VendorsViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("VendorsViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("VendorsViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("VendorsViewSortAscending") || false;
			pageSession.set("VendorsViewSortAscending", !sortAscending);
		} else {
			pageSession.set("VendorsViewSortAscending", true);
		}
	}
});

Template.VendorsViewTable.helpers({
	"tableItems": function() {
		return VendorsViewItems(this.vendor_list);
	}
});


Template.VendorsViewTableItems.rendered = function() {
	
};

Template.VendorsViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		Router.go("vendors.details", {vendorId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Vendors.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #delete-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Delete? Are you sure?",
			title: "Delete",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Vendors.remove({ _id: me._id });
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	},
	"click #edit-button": function(e, t) {
		e.preventDefault();
		Router.go("vendors.edit", {vendorId: this._id});
		return false;
	}
});

Template.VendorsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Vendors.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Vendors.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
