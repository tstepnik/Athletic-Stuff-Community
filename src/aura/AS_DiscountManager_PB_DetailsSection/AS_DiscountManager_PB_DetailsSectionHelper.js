({

    loadOrders: function (component, event) {

        this.setDatatable(component);

        let pricebookId = event.getParam('recordId');
        let isActive = event.getParam('isActive');
        component.set('v.pricebookId', pricebookId);
        component.set('v.isActive', isActive);
        let pbEntryWrappers;
        const action = component.get('c.getPricebookDetails');
        action.setParams({pricebookId: pricebookId});
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                pbEntryWrappers = response.getReturnValue();
                component.set('v.PbEntryWrappers', pbEntryWrappers);

            } else if (state === "ERROR") {

                    let sendErrorToast = component.find('errorToastMaker');
                    sendErrorToast.handleErrors(response.getError());
            }
        });
        $A.enqueueAction(action);

    },

    setDatatable: function (component) {

        let actions = [
            {label: 'Edit', name: 'edit'},
            {label: 'Delete', name: 'delete'}
        ];

        component.set('v.columns', [
            {label: 'Product Name', fieldName: 'name', type: 'text'},
            {label: 'Standard Price', fieldName: 'standardPrice', type: 'text'},
            {label: 'Price', fieldName: 'newPrice', type: 'text'},
            {label: 'Active', fieldName: 'active', type: 'boolean'},
            {type: 'action', typeAttributes: {rowActions: actions}}
        ]);
    },

    handleRowAction: function (component, event) {
        let action = event.getParam('action');
        let row = event.getParam('row');

        switch (action.name) {
            case 'edit':
                alert('Edit: ' + JSON.stringify(row));
                break;
            case 'delete':
                alert('Delete: ' + JSON.stringify(row));
                break;
        }
    },

    activatePb: function (component, event) {
        let pricebookId = component.get('v.pricebookId');
        const action = component.get('c.activatePricebook');
        action.setParams({pricebookId: pricebookId});
        this.apexCallback(component, event, action, false);
        component.set('v.isActive', true);
    },

    deactivatePb: function (component, event) {
        let pricebookId = component.get('v.pricebookId');
        const action = component.get('c.deactivatePricebook');
        action.setParams({pricebookId: pricebookId});
        this.apexCallback(component, event, action, false);
        component.set('v.isActive', false);

    },

    deletePb: function (component, event) {
        let pricebookId = component.get('v.pricebookId');
        const action = component.get('c.deletePricebook');
        action.setParams({pricebookId: pricebookId});
        this.apexCallback(component, event, action, true);
        component.set('v.PbEntryWrappers', null);

    },


    apexCallback: function (component, event, action, isDelete) {
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                this.fireUpdatePbListEvent(isDelete);
            } else if (state === "ERROR") {
                    let sendErrorToast = component.find('errorToastMaker');
                    sendErrorToast.handleErrors(response.getError());
            }
        });
        $A.enqueueAction(action);
    },

    fireUpdatePbListEvent: function (isDelete) {
        let eventt = $A.get('e.c:AS_DiscountManager_UpdatePbList_Event');
        eventt.setParams({"isDelete": isDelete});
        eventt.fire();
    }
})