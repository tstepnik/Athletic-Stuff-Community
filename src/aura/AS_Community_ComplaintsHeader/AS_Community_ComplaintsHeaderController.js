({
    handleNewCaseModal: function(component, event) {
        component.set('v.showNewComplainModal', true);
    },

    closeModal: function(component, event) {
        component.set('v.showNewComplainModal', false);
    },

    onInit: function (component, event, helper) {
        helper.onInit(component,event);
    },
    createCase: function (component, event, helper) {
        helper.createCase(component,event);
        component.set('v.showNewComplainModal',false);
    },

    closePopup: function (component) {
        component.set('v.showNewComplainModal',false);
    },

})