({
    handleNewCaseModal: function(component, event) {
        component.set('v.showNewComplainModal', true);
    },
    handleSuccess: function(component, event, helper) {
        helper.handleSuccess(component, event);

    },
    closeModal: function(component, event) {
        console.log('WCHODZI DO CLOSE MODAL');
        component.set('v.showNewComplainModal', false);
        console.log('WYCHODZI DO CLOSE MODAL');
    },

    onInit: function (component, event, helper) {
        helper.onInit(component,event);
    },
    pressBasket: function (component, event, helper) {
        helper.removeProductFromBasket(component,event,helper);
        helper.pressBasket(component,event);
        component.set('v.deleteBtnClicked',false);
    },

    closePopup: function (component) {
        component.set('v.deleteBtnClicked',false);
    },

})