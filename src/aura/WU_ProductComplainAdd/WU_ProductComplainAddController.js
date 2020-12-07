({
    doInit: function (component, event, helper) {
        helper.onInit(component, event, helper);
    },
    setRating: function (component, event, helper) {
        component.set('v.productReview.Rating__c', event.get('rating'));
    },
    onSave: function (component, event, helper) {
        if (!(component.get('v.productCase.Subject')||component.get('v.productCase.Description'))){
            helper.sendResultToast('Missing field', 'Subject and Description can\'t be empty', 'Warning');
            return;
        }
        component.set('v.productCase.Origin', 'Web');
        let service = component.find("service");
        service.saveRecord(result => {
            if (result.state === "SUCCESS" || result.state === "DRAFT") {
                helper.sendResultToast('Saved', 'The record was saved.', 'Success');
                helper.onInit(component, event, helper);
            } else if (result.state === "INCOMPLETE") {
                console.log("User is offline, device doesn't support drafts.");
            } else if (result.state === "ERROR") {
                console.log('Problem saving review, error: ' + JSON.stringify(result.error));
            } else {
                console.log('Unknown problem, state: ' + result.state + ', error: ' + JSON.stringify(result.error));
            }
        });
    }
})