({
    onInit: function (component, event) {
        component.set('v.caseOrderNumber',' ');
        component.set('v.caseSubject',' ');
    },

    createCase: function (component, event) {
        let productName = component.get('v.caseProductName');
        let orderNumber = component.get('v.caseOrderNumber');
        let caseSubject = component.get('v.caseSubject');
        let caseMessage = component.get('v.caseMessage');

        const action = component.get('c.createComplaint');
        action.setParams({
            productName: productName,
            orderNumber: orderNumber,
            caseSubject: caseSubject,
            description: caseMessage
        });
        action.setCallback(this, function(response) {
            const status = response.getState();
            if (status === 'SUCCESS') {
                let sendToast = component.find('toastMaker');
                sendToast.sendResultToast('Success', 'Case Successfully Created. Our agent will contact you soon.', 'Success');
            } else {
                let sendErrorToast = component.find('errorToastMaker');
                sendErrorToast.handleErrors(response.getError());
            }
        });
        $A.enqueueAction(action);
    }
})