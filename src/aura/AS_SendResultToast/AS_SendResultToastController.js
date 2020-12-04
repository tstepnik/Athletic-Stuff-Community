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
    }
});