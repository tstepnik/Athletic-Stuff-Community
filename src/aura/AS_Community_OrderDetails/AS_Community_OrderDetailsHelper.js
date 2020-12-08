
({
    loadOrders: function (component,event) {
        let orderId = event.getParam('recordId');
        let orderNumber = event.getParam('orderNumber');
        console.log('ORDER ID: ');
        console.log(orderId);
        component.set('v.OrderNumber',orderNumber);
        let orders;
        const action = component.get('c.getOrderItemWrappers');
        action.setParams({orderId: orderId});
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                console.log('Wchodzi do success');
                orders = response.getReturnValue();
                component.set('v.orderItemWrappers',orders);

            } else if (state === "ERROR") {
                console.log('wchodzi do error');
                this.handleErrors(component, response);
            }
        });
        $A.enqueueAction(action);

    },

    createCase: function (component, event) {
        console.log('WCHODZI DO METODY CREATECASE');
        let productName = component.get('v.caseProductName');
        let orderNumber = component.get('v.OrderNumber');
        let caseSubject = component.get('v.caseSubject');
        let caseMessage = component.get('v.caseMessage');
        console.log('WCHODZI DO METODY 1');
        const action = component.get('c.createComplaint');
        console.log('WCHODZI DO METODY 2');

        action.setParams({
            productName: productName,
            orderNumber: orderNumber,
            caseSubject: caseSubject,
            description: caseMessage
        });
        console.log('22');
        action.setCallback(this, function(response) {
            console.log('33');
            const status = response.getState();
            if (status === 'SUCCESS') {
                console.log('WCHODZI DO SUCCESS');
                let sendToast = component.find('toastMaker');
                sendToast.sendResultToast('Success', 'Case Successfully Created. Our agent will contact you soon.', 'Success');
            } else {
                console.log('WCHODZI DO ERROR');
                this.handleErrors(component,response);
            }
        });
        $A.enqueueAction(action);
    },

    handleErrors: function (component,response) {
        let sendErrorToast = component.find('errorToastMaker');
        let errors = response.getErrors();
        sendErrorToast.handleErrors('Error', 'Error while processing loading data', 'Error', errors);
    },

    tableRowClicked: function(component, event) {
        let productName = event.currentTarget.dataset.id;
        component.set('v.caseProductName',productName);
    }
})