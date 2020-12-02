({
    init : function(component, event, helper){
        helper.fetchContactId(component);
        helper.fetchBasketElements(component);
    },
    removeItem: function(component, event, helper) {
        helper.removeItem(component, event);
    },
    showConfirmDeleteDialog: function(component, event, helper) {
        var elementIndex = event.getSource().get('v.value');
        component.set('v.clickedItemIndex', elementIndex);
        component.set('v.isConfirmDeleteDialogVisible', true);
    },
    handleConfirmDialogYes: function(component, event, helper) {
        helper.removeItem(component, event);
        component.set('v.isConfirmDeleteDialogVisible', false);
    },
    handleConfirmDialogNo: function(component, event, helper) {
        component.set('v.isConfirmDeleteDialogVisible', false);
    },
    makeOrder: function(component, event, helper) {
        helper.makeOrder(component);
    }
});