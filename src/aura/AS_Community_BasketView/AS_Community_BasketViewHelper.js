({
    getOpportunityProducts: function (component,event,helper) {
        const action = component.get('c.getBasketItemWrappers');

        action.setCallback(this, function (response) {

            const status = response.getState();
            if (status === 'SUCCESS') {
                let orderItemWrappers = response.getReturnValue();
                component.set('v.orderItemWrappers', orderItemWrappers);
            } else {
                let sendErrorToast = component.find('errorToastMaker');
                sendErrorToast.handleErrors(response.getError());
        }

        });
        $A.enqueueAction(action);
        this.countSum(component,event);

    },

    countSum: function (component,event) {
        const action = component.get('c.countSum');
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let priceSum = response.getReturnValue();
                component.set('v.priceSum',priceSum);
                if(priceSum <= 0){
                    this.hideButton(component);
                }
            }   else {
                let sendErrorToast = component.find('errorToastMaker');
                sendErrorToast.handleErrors(response.getError());
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

    handleEvent: function (component, event) {
        this.countSum(component,event);

    },

    hideButton: function (component) {
        let element = component.find('buyBtn');
        $A.util.toggleClass(element, "hideElement");
        let cartIsEmpty = component.find('cart-is-empty');
        $A.util.removeClass(cartIsEmpty, "hideElement");

    },

    showButton: function(component) {
        let element = component.find('buyBtn');
        $A.util.removeClass(element, "hideElement");
        let cartIsEmpty = component.find('cart-is-empty');
        $A.util.toggleClass(cartIsEmpty, "hideElement");
    },

    hideEmptyCartText: function (component) {
        let cartIsEmpty = component.find('cart-is-empty');
        $A.util.toggleClass(cartIsEmpty, "hideElement");
    },

    handleErrors: function (component,response) {
        let sendErrorToast = component.find('errorToastMaker');
        let errors = response.getErrors();
        sendErrorToast.handleErrors('Error', 'Error while processing loading data', 'Error', errors);
    },
    completeOrder: function (component, event) {
        const action = component.get('c.completeTransaction');
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let mainContainer = component.find('bViewContainer');
                $A.util.toggleClass(mainContainer, "hideElement");
                component.set('v.buyBtnPressed',true);
            } else if (state === "ERROR") {
                this.handleErrors(component, response);
            }
        });
        $A.enqueueAction(action);
    }

})