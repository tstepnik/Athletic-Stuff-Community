({
    doInit: function(component, helper) {
        component.set('v.isRecordEdited', false);
        component.set('v.isRecordClicked', false);
        component.set('v.wrapperIsNotNull', true);
    },
    handler: function(component, event, helper) {
        helper.handler(component, event);
    },
    showEditForm: function(component, event, helper) {
        component.set('v.isRecordEdited', true);
    },
    hideEditForm: function(component, event, helper) {
        component.set('v.isRecordEdited', false);

    },

    saveEdit: function(component, event, helper) {
        helper.saveEdit(component, event);
    },

    handleConfirmDialog: function(component, event, helper) {
        component.set('v.showConfirmDialog', true);
    },

    handleConfirmDialogYes: function(component, event, helper) {
        helper.removeItem(component);


    },

    handleConfirmDialogNo: function(component, event, helper) {
        component.set('v.showConfirmDialog', false);
    },
})