({
    displayAllAccounts: function(component, event, helper) {
        helper.handleEvent(component, event);
        component.set('v.zoomLevel', 0);
    },
    showChosenRecord: function(component, event, helper) {
        helper.showChosenRecord(component, event);
    }
});