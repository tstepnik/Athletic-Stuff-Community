({
    fetchContactId : function(component) {
        const action = component.get('c.getContactId');
        action.setCallback(this, function(response) {
            const status = response.getState();
            if (status === 'SUCCESS') {
                component.set('v.contactId', response.getReturnValue());
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
    fetchBasketElements : function(component) {
        const action = component.get('c.getBasketElements');
        action.setCallback(this, function(response) {
            const status = response.getState();
            if (status === 'SUCCESS') {
                component.set('v.basketElements', response.getReturnValue());
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
    removeItem : function(component, event) {
        let elementIndex = component.get('v.clickedItemIndex');
        const action = component.get('c.removeBasketElement');
        action.setParams({
            sObjectId: component.get('v.basketElements')[elementIndex].Id
        });
        action.setCallback(this, function(response) {
            const status = response.getState();
            if (status === 'SUCCESS') {
                let oldData = component.get('v.basketElements');
                let newData = [];
                oldData.forEach((element) =>{
                    if( element.Id != elementIndex){
                        newData.push(element);
                    }
                });
                component.set( 'v.basketElements',newData);
                $A.get('e.force:refreshView').fire();
                this.handleShowToast(component, event, 'Success', 'Success', 'Product deleted from your basket');
            } else {
                this.handleShowToast(component, event, 'Error', 'Error', 'Error while processing loading data');
                let errors = response.getError();
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    console.error(JSON.stringify(errors[0].message));
                }
            }
        });
        $A.enqueueAction(action);
    },
    makeOrder : function(component) {
        const action = component.get('c.completeExistingOrder');
        action.setCallback(this, function(response) {
            const status = response.getState();
            if (status === 'SUCCESS') {
                this.handleShowToast(component, event, 'Success', 'Success', 'Order Created');
                component.set('v.basketElements', null);
                $A.get('e.force:refreshView').fire();
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

    handleShowToast: function(component, event, title, variant, message) {
        component.find('notification').showToast({
            "title": title,
            "variant": variant,
            "message": message
        });
    },
});