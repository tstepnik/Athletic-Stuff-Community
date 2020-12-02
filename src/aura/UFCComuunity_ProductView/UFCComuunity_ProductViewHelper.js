({
    init : function(component, event){
        let action = component.get("c.getProductPictures");
        action.setParams({ productId : component.get("v.recordId") });
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                component.set('v.pictures', response.getReturnValue());
            }
            else if (state === "ERROR") {
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
        });
        $A.enqueueAction(action);
    },
    addElementToBasket: function(component, event ){
        let action = component.get("c.addProductToBasket");
        action.setParams({
            productId : component.get("v.recordId"),
            quantity: 1
        });
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                this.handleShowToast(component, event, 'Success', 'Success', 'Product added to your basket');
            }
            else if (state === "ERROR") {
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
})