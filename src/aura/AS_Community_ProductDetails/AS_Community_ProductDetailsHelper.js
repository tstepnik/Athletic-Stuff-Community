({

    loadPrice: function (component, event) {
        console.log('WCHODZI DO LOAD PRICE');
        const action = component.get('c.getProductInfoWrapper');
        action.setParams({productId: component.get('v.recordId')});
        action.setCallback(this, function (response) {
            console.log('WCHODZI DO CALL BACK');
            const status = response.getState();
            if (status === 'SUCCESS') {
                let productInfoWrapper = response.getReturnValue();
                component.set('v.productInfoWrapper', productInfoWrapper);
            } else if (status === "ERROR") {
                this.handleErrors(component,response);
            }
        });
        $A.enqueueAction(action);
    },

    addProductToOrder: function (component, event) {
        console.log('WCHODZI DO ADD PRODUCT TO BASKET');
        let productInfoWrapper = component.get('v.productInfoWrapper');
        const action = component.get('c.addProductToBasket');
        action.setParams({
            productId: productInfoWrapper.productId,
            pricebookEntryId: productInfoWrapper.pricebookEntryId,
            unitPrice: productInfoWrapper.price
        });
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let responseMessage = response.getReturnValue();
                let sendToast = component.find('toastMaker');
                sendToast.sendResultToast('Success', responseMessage, 'Success');
            } else if (state === "ERROR") {
               this.handleErrors(component,response);
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