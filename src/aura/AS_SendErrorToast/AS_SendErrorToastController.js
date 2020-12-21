({

    handleErrors: function (component,event, helper) {
        let params = event.getParam('arguments');
        let errors = params.errors;

        if (params) {
            if (errors) {
                let resultsToast = $A.get("e.force:showToast");
                if (resultsToast) {
                    resultsToast.setParams({
                        "title": 'Error',
                        "message": errors[0].message,
                        "type": 'Error'
                    });
                    resultsToast.fire();
                }
            }
        } else {
            console.log("Unknown error");
        }
    }
});