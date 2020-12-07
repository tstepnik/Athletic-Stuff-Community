({
    loadOrders: function (component) {
        let orders;
        const action = component.get('c.getOrderWrappers');
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                orders = response.getReturnValue();
                component.set('v.orderWrappers', orders);
            } else if (state === "ERROR") {
                this.handleErrors(component, response);
            }
        });
        $A.enqueueAction(action);

    },

    handleErrors: function (component, response) {
        let sendErrorToast = component.find('errorToastMaker');
        let errors = response.getErrors();
        sendErrorToast.handleErrors('Error', 'Error while processing loading data', 'Error', errors);
    },

    tableRowClicked: function (component, event) {
        console.log('CLICK');
        let wrappersList = component.get('v.orderWrappers');
        console.log('CLICK2');
        let index = event.currentTarget.dataset.index;
        console.log('CLICK3');
        let wrapper = wrappersList[index];
        console.log('CLICK4');
        let rows = component.find("row");
        console.log('CLICK5');
        console.log(rows);
        // rows.forEach((element) => {
        //     $A.util.removeClass(element, "row-highlighted");
        // });

        $A.util.addClass(rows[index], "row-highlighted");
        console.log('CLICK6');
        let eventt = $A.get('e.c:AS_Community_OrderIdEvent');
        console.log('CLICK7');
        console.log('WRAPPER ID');
        let id = wrapper.orderId;
        let orderNumber = wrapper.orderNumber;
        console.log(id);
        eventt.setParams({
            "recordId": id,
            "orderNumber": orderNumber
        });

        eventt.fire();
        console.log('EVENT SIĘ WYSYLA');
    }
})