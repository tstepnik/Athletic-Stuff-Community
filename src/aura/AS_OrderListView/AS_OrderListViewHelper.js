/**
 * Created by tomas on 04.12.2020.
 */
({
    loadOrders: function (component, event) {
        console.log('WCHODZI DO METODY');
        let orders;
        const action = component.get('c.getOrderWrappers');
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                console.log('WCHODZI DO SUCCESS');
                orders = response.getReturnValue();
                component.set('v.orderWrappers',orders);
                // component.set('v.orderWrappers', JSON.stringify(orders));
                console.log('//////////');
                console.log('HELPER');
                console.log('11');
                let ord = component.get('v.orderWrappers');
                console.log('22');
                console.log(ord[0]);
                console.log('33');
                console.log(ord[0].numberOfProducts);
                console.log('44');
                console.log('//////////');
            } else if (state === "ERROR") {
                this.handleErrors(component, event, response);
            }
        });
        $A.enqueueAction(action);

    },

    handleShowToast: function (component, event, title, variant, message) {
        component.find('notification').showToast({
            "title": title,
            "variant": variant,
            "message": message
        });
    },
    handleErrors: function (component,event,response) {
        this.handleShowToast(component, event, 'Error', 'Error', 'Error while processing loading data');
        let errors = response.getError();
        if (errors) {
            if (errors[0] && errors[0].message) {
                console.log("Error message: " +
                    errors[0].message);
            }
        } else {
            console.log("Unknown error");
        }
    }
})