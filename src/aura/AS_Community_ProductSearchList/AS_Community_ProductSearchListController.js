/**
 * Created by tomas on 23.11.2020.
 */
({

    doInit: function (component, event, helper) {
        helper.loadProducts(component);
    },

    pressPreviousButton: function(component,event,helper){
        helper.pressPreviousButton(component,event,helper);
    },
    pressNextButton: function(component,event,helper){
        helper.pressNextButton(component,event,helper);
    }


})