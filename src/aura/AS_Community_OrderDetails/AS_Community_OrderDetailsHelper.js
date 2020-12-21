
({
    loadOrders: function (component,event) {
        let orderId = event.getParam('recordId');
        let orderNumber = event.getParam('orderNumber');
        component.set('v.OrderNumber',orderNumber);
        let orders;
        const action = component.get('c.getOrderItemWrappers');
        action.setParams({orderId: orderId});
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                orders = response.getReturnValue();
                component.set('v.orderItemWrappers',orders);

            } else {
                let sendErrorToast = component.find('errorToastMaker');
                sendErrorToast.handleErrors(response.getError());
            }
        });
        $A.enqueueAction(action);

    },

    createCase: function (component, event) {
        let productName = component.get('v.caseProductName');
        let orderNumber = component.get('v.OrderNumber');
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
    },

    tableRowClicked: function(component, event) {
        let productName = event.currentTarget.dataset.id;
        component.set('v.caseProductName',productName);
    }
})