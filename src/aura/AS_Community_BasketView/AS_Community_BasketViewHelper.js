/**
 * Created by tomas on 26.11.2020.
 */
({
    getOpportunityProducts: function (component,event,helper) {
console.log('WCHODZI DO METODY HELPERA');
        const action = component.get('c.getOpportunityProducts');

        //
        action.setCallback(this, function (response) {
            console.log('WCHODZI DO SET CALLLBACK');

            const status = response.getState();
            if (status === 'SUCCESS') {
                console.log('WCHODZI DO SUCCESS');
                let oppProducts = response.getReturnValue();
                component.set('v.opportunityProducts', oppProducts);
                console.log('PRODUCTS:');
                console.log(component.get('v.opportunityProducts'));

            } else {
                console.log('WCHODZI DO ERROR');
                this.handleShowToast(component, event, 'Error', 'error', 'Error while processing loading data');
                let errors = response.getError();
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    console.error(JSON.stringify(errors[0].message));
                }
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
})