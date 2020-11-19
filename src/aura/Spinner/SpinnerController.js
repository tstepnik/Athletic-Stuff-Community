({
    showSpinner: function(component, event, helper) {
        component.set('v.spinnerVisible', true);
    },

    hideSpinner: function(component, event, helper) {
        component.set('v.spinnerVisible', false);
    },
})