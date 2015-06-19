var pageSession = new ReactiveDict();

Template.VendorsDetails.rendered = function() {
	
};

Template.VendorsDetails.events({
	
});

Template.VendorsDetails.helpers({
	
});

Template.VendorsDetailsDetailsForm.rendered = function() {
	

	pageSession.set("vendorsDetailsDetailsFormInfoMessage", "");
	pageSession.set("vendorsDetailsDetailsFormErrorMessage", "");

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

Template.VendorsDetailsDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("vendorsDetailsDetailsFormInfoMessage", "");
		pageSession.set("vendorsDetailsDetailsFormErrorMessage", "");
		
		var self = this;

		function submitAction(msg) {
			var vendorsDetailsDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(vendorsDetailsDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("vendorsDetailsDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			var message = msg || "Error.";
			pageSession.set("vendorsDetailsDetailsFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		/*CANCEL_REDIRECT*/
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		Router.go("vendors", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("vendors", {});
	}

	
});

Template.VendorsDetailsDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("vendorsDetailsDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("vendorsDetailsDetailsFormErrorMessage");
	}
	
});
