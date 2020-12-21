({

    loadPrice: function (component, event) {
        const action = component.get('c.getProductInfoWrapper');
        action.setParams({productId: component.get('v.recordId')});
        action.setCallback(this, function (response) {
            const status = response.getState();
            if (status === 'SUCCESS') {
                let productInfoWrapper = response.getReturnValue();
                component.set('v.productInfoWrapper', productInfoWrapper);
            } else {
                let sendErrorToast = component.find('errorToastMaker');
                sendErrorToast.handleErrors(response.getError());
            }
        });
        $A.enqueueAction(action);
    },

    addProductToOrder: function (component, event) {
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
            }else {
                let sendErrorToast = component.find('errorToastMaker');
                sendErrorToast.handleErrors(response.getError());
            }
        });
        $A.enqueueAction(action);
    }
})