({

    loadDetails: function (component, event, helper) {
        helper.loadOrders(component, event);

    },

    activatePb: function (component, event, helper) {
        console.log('wchodzi do controllera activate');
        helper.activatePb(component, event);
    },

    deactivatePb: function (component, event, helper) {
        console.log('wchodzi do controllera deactivate');
        helper.deactivatePb(component, event);
    },

    deletePb: function (component, event, helper) {
        helper.deletePb(component, event);
    },

    handleRowAction: function (component, event, helper) {
        helper.handleRowAction(component,event);
    }
})