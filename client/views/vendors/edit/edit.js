var pageSession = new ReactiveDict();

Template.VendorsEdit.rendered = function() {
	
};

Template.VendorsEdit.events({
	
});

Template.VendorsEdit.helpers({
	
});

Template.VendorsEditEditForm.rendered = function() {
	

	pageSession.set("vendorsEditEditFormInfoMessage", "");
	pageSession.set("vendorsEditEditFormErrorMessage", "");

	$(".input-group.date").each(function() {
		var format = $(this).find("input[type='text']").attr("data-format");

		if(format) {
			format = format.toLowerCase();			
		}
		else {
			format = "mm/dd/yyyy";
		}

		$(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			todayBtn: true,
			forceParse: false,
			keyboardNavigation: false,
			format: format
		});
	});

	$("input[type='file']").fileinput();
	$("input[autofocus]").focus();
};

Template.VendorsEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("vendorsEditEditFormInfoMessage", "");
		pageSession.set("vendorsEditEditFormErrorMessage", "");
		
		var self = this;

		function submitAction(msg) {
			var vendorsEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(vendorsEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("vendorsEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("vendors", {});
		}

		function errorAction(msg) {
			var message = msg || "Error.";
			pageSession.set("vendorsEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Vendors.update({ _id: t.data.vendor._id }, { $set: values }, function(e) { if(e) errorAction(e.message); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("vendors", {});
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}

	
});

Template.VendorsEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("vendorsEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("vendorsEditEditFormErrorMessage");
	}
	
});
