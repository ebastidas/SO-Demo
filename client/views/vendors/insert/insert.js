var pageSession = new ReactiveDict();

Template.VendorsInsert.rendered = function() {
	
};

Template.VendorsInsert.events({
	
});

Template.VendorsInsert.helpers({
	
});

Template.VendorsInsertInsertForm.rendered = function() {
	

	pageSession.set("vendorsInsertInsertFormInfoMessage", "");
	pageSession.set("vendorsInsertInsertFormErrorMessage", "");

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

Template.VendorsInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("vendorsInsertInsertFormInfoMessage", "");
		pageSession.set("vendorsInsertInsertFormErrorMessage", "");
		
		var self = this;

		function submitAction(msg) {
			var vendorsInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(vendorsInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("vendorsInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("vendors", {});
		}

		function errorAction(msg) {
			var message = msg || "Error.";
			pageSession.set("vendorsInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = Vendors.insert(values, function(e) { if(e) errorAction(e.message); else submitAction(); });
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

Template.VendorsInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("vendorsInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("vendorsInsertInsertFormErrorMessage");
	}
	
});
