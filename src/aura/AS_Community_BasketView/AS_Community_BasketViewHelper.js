
({
    getOpportunityProducts: function (component,event,helper) {
        const action = component.get('c.getOpportunityProducts');

        action.setCallback(this, function (response) {

            const status = response.getState();
            if (status === 'SUCCESS') {
                let oppProducts = response.getReturnValue();
                component.set('v.opportunityProducts', oppProducts);

            } else {
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