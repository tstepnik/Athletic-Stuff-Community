({
    onInit : function(component, event, helper) {
        let service = component.find("service");
        service.getNewRecord(
            "Case",
            null,
            false,
            $A.getCallback(function() {
                let record = component.get("v.productCase");
                let error = component.get("v.recordError");
                if(error || (record === null)) {
                    console.log("Error initializing record template: " + error);
                    return;
                }
                // component.set("v.Product__c", record);
                console.log(component.get('v.productCase'))
            })
        );
    },
    sendResultToast : function(title, message, type) {
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

})