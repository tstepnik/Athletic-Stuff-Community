/**
 * Created by tomas on 09.12.2020.
 */
({

    loadOrders: function (component,event) {
        let pricebookId = event.getParam('recordId');
        let pbEntryWrappers;
        const action = component.get('c.getPricebookDetails');
        action.setParams({pricebookId: pricebookId});
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                pbEntryWrappers = response.getReturnValue();
                component.set('v.PbEntryWrappers',pbEntryWrappers);

            } else if (state === "ERROR") {
                this.handleErrors(component, response);
            }
        });
        $A.enqueueAction(action);

    },

    handleErrors: function (component,response) {
        let sendErrorToast = component.find('errorToastMaker');
        let errors = response.getErrors();
        sendErrorToast.handleErrors('Error', 'Error while processing loading data', 'Error', errors);
    },
})