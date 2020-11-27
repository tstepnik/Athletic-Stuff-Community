/**
 * Created by tomas on 26.11.2020.
 */
({

    onInit: function (component, event, helper) {
        helper.setDetails(component, event, helper);
    },
    increase: function (component, event, helper) {
        helper.increaseProductsNumber(component, event, helper);
    },

    decrease: function (component, event, helper) {
        helper.decreaseProductsNumber(component, event, helper);
    }

})