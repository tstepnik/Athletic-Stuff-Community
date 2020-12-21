({
    onInit: function(component,event,helper){
        this.hideModal(component);
        this.getOpportunityProducts(component,event,helper);
        this.countSum(component,event);
    },


    getOpportunityProducts: function (component) {
        this.showSpinner(component);
        const action = component.get('c.getBasketItemWrappers');

        action.setCallback(this, function (response) {

            const status = response.getState();
            if (status === 'SUCCESS') {
                let getBasketItemWrappers = response.getReturnValue();
                component.set('v.getBasketItemWrappers', getBasketItemWrappers);

            } else {
                let sendErrorToast = component.find('errorToastMaker');
                sendErrorToast.handleErrors(response.getError());
            }
            this.hideSpinner(component);

        });
        $A.enqueueAction(action);

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
        const action = component.get('c.countSum');
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let priceSum = response.getReturnValue();
                component.set('v.priceSum',priceSum);
            }    else {
                let sendErrorToast = component.find('errorToastMaker');
                sendErrorToast.handleErrors(response.getError());
            }
        });
        $A.enqueueAction(action);

    },

    showSpinner: function(component) {
        component.find('spinner').showSpinner();
    },
    hideSpinner: function(component) {
        component.find('spinner').hideSpinner();
    }
})