({
    sendResultToast : function(component, event, helper) {
        let params = event.getParam('arguments');
        if (params) {
            let title = params.title, message = params.message, type = params.type;
            let resultsToast = $A.get("e.force:showToast");
            if (resultsToast) {
                resultsToast.setParams({
                    "title": title,
                    "message": message,
                    "type": type
                });
                resultsToast.fire();
            }
        }
    },

    handleErrors: function (component,event,helper) {
        this.sendResultToast(component, event, helper);
        let params = event.getParam('arguments');
        let errors = params.errors;
        if (errors) {
            if (errors[0] && errors[0].message) {
                console.log("Error message: " +
                    errors[0].message);
            }
        } else {
            console.log("Unknown error");
        }
    }
});