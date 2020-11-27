({
    init: function (component, event, helper) {

        let action = component.get("c.getProductPictures");
        action.setParams({productId: component.get("v.recordId")});
        action.setCallback(this, function (response) {

            let state = response.getState();

            if (state === "SUCCESS") {
                component.set('v.pictures', response.getReturnValue());
                console.log(response.getReturnValue());
            } else if (state === "INCOMPLETE") {
                //todo do something
            } else if (state === "ERROR") {
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
    }
})