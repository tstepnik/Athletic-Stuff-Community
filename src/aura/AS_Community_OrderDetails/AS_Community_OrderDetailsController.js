({
    handleNewCaseModal: function (component, event) {
        let orderNumber = component.get('v.OrderNumber');
        component.set('v.showNewComplainModal', true);
    },

    onInit: function (component, event, helper) {

    },
    tableRowClicked: function(component, event, helper) {
        helper.tableRowClicked(component, event);
    },

    loadDetails: function (component, event, helper) {
        helper.loadOrders(component, event);
    },

    closeModal: function (component, event) {
        component.set('v.showNewComplainModal', false);
    },
    createCase: function (component, event, helper) {
        helper.createCase(component, event);
        component.set('v.showNewComplainModal', false);
    }
})