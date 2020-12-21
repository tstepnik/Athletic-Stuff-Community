/**
 * Created by tomas on 07.12.2020.
 */
({
    doInit: function (component, event) {
        const action = component.get('c.getCaseWrappers');
        action.setCallback(this, function(response) {
            const status = response.getState();
            if (status === 'SUCCESS') {
                let caseWrapperList = response.getReturnValue();
                component.set('v.caseWrappers',caseWrapperList);
            } else {
                let sendErrorToast = component.find('errorToastMaker');
                sendErrorToast.handleErrors(response.getError());
            }
        });
        $A.enqueueAction(action);
    }
})