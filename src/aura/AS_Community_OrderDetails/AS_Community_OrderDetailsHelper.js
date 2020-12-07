
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

    handleErrors: function (component,response) {
        let sendErrorToast = component.find('errorToastMaker');
        let errors = response.getErrors();
        sendErrorToast.handleErrors('Error', 'Error while processing loading data', 'Error', errors);
    }
})