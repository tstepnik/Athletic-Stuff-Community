({
    onInit: function(component,event,helper){
        this.hideModal(component);
        this.getOpportunityProducts(component,event,helper);
        this.countSum(component,event);
    },


    getOpportunityProducts: function (component,event,helper) {
        this.showSpinner(component);
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
            this.hideSpinner(component);

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


    showModal: function(component,event,helper){
        this.getOpportunityProducts(component,event,helper);
        this.countSum(component,event);
        let modal = component.find('basket-modal');
        $A.util.removeClass(modal, "hideElement");

    },

    hideModal: function(component){
        let modal = component.find('basket-modal');
        $A.util.toggleClass(modal, "hideElement");
    },

    countSum: function (component,event) {
        console.log('2');
        console.log('WCHODZI DO COUNT SUM');
        const action = component.get('c.countSum');
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                console.log('3');
                console.log('WCHODZI DO SUCCESS');
                let priceSum = response.getReturnValue();
                console.log('Price: ' + priceSum);
                component.set('v.priceSum',priceSum);
            }      else if (state === "ERROR") {
                this.handleErrors(component,event,response);
            }
        });
        $A.enqueueAction(action);

    },

    showSpinner: function(component) {
        component.find('spinner').showSpinner();
    },
    hideSpinner: function(component) {
        component.find('spinner').hideSpinner();
    },

})