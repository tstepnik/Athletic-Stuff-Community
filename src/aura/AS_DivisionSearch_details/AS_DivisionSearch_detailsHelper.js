({
    removeItem: function (component) {
        const action = component.get('c.deleteAccount');
        action.setParams({
            id: component.get('v.wrapper.recordId')
        });
        action.setCallback(this, function (response) {

            const status = response.getState();
            var resultMessage = response.getReturnValue();
            if (status === 'SUCCESS') {

                if (resultMessage.includes('Success')) {
                    component.find('notification').showToast({
                        "title": 'Success',
                        "variant": 'success',
                        "message": 'Account successfully deleted'
                    });


                    let event = $A.get('e.c:AS_DivisionSearch_DeleteRecordEvent');
                    event.setParams({
                        "recordId": component.get('v.accountIdd')

                    });
                    event.fire();

                } else {
                    component.find('notification').showToast({
                        "variant": "error",
                        "title": "Error",
                        "message": resultMessage,
                    });
                }
            } else {
                component.find('notification').showToast({
                    "variant": "error",
                    "title": "Error",
                    "message": 'There has been a problem processing your request',
                });
            }
        });

        $A.enqueueAction(action);
        component.set('v.showConfirmDialog', false);
        component.set('v.wrapper.recordId', null);
        component.set('v.wrapperIsNotNull', false);
    },
    refreshTable: function (component) {
        let event = $A.get('e.c:AS_DivisionSearch_RefreshTableEvent');
        event.fire();

    },
    editItem: function (component) {
    },

    handler: function (component, event) {
        let id = event.getParam('accountWrapper');
        component.set('v.wrapper', id);
        component.set('v.accountIdd', id.recordId);
        component.set('v.isRecordClicked', true);
        component.set('v.wrapperIsNotNull', true);
    },
    saveEdit: function (component, event) {
        let hideEditFormAction = component.get('c.hideEditForm');
        $A.enqueueAction(hideEditFormAction);
        this.refreshTable(component);
        component.find('notification').showToast({
            "title": 'Success',
            "variant": 'success',
            "message": 'Account successfully updated'
        });

    }
})