({
    handleNewRecordModal: function(component, event) {
        component.set('v.showNewRecordModal', true);
    },
    handleSuccess: function(component, event, helper) {
        helper.handleSuccess(component, event);
    },
    closeModal: function(component, event) {
        component.set('v.showNewRecordModal', false);
    }

})