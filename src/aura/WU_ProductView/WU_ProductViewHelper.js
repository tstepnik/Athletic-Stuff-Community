({
    init : function(component, event, helper){
        let action = component.get("c.getProductPictures");
        action.setParams({ productId : component.get("v.recordId") });
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                component.set('v.response', response.getReturnValue());
                console.log(response.getReturnValue());
                let rating = component.get('v.response.rating');
                rating = Math.round(rating);
                let listOfStars = [];
                for (let i = 0; i < 5; i++) {
                    listOfStars.push((rating > i) ? true : false);
                }
                component.set('v.stars', listOfStars);
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
    }
})