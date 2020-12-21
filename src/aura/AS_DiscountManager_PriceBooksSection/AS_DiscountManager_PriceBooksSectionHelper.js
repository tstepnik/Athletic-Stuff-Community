({

    doInit: function (component, event) {
        const action = component.get('c.getPriceBookWrappers');
        action.setCallback(this, function (response) {
            const status = response.getState();
            if (status === 'SUCCESS') {
                let priceBookWrappers = response.getReturnValue();
                component.set('v.PriceBookWrapper', priceBookWrappers);
            } else {
            }
        });
        $A.enqueueAction(action);
    },

    tableRowClicked: function (component, event) {
        let wrappersList = component.get('v.PriceBookWrapper');
        let index = event.currentTarget.dataset.index;
        let wrapper = wrappersList[index];
        let rows = component.find("row");

        let eventt = $A.get('e.c:AS_DiscountManager_PriceBook_Event');
        let id = wrapper.id;
        let isActive = wrapper.isActive;
        eventt.setParams({
            "recordId": id,
            "isActive": isActive
        });

        eventt.fire();
    },


    sendFirstPbInfo: function (component, event) {
        let isDelete = event.getParam('isDelete');
        const action = component.get('c.getPriceBookWrappers');
        action.setCallback(this, function (response) {
            const status = response.getState();
            if (status === 'SUCCESS') {
                let priceBookWrappers = response.getReturnValue();
                component.set('v.PriceBookWrapper', priceBookWrappers);

                let wrapper = priceBookWrappers[0];
                let id = wrapper.id;
                let isActive = wrapper.isActive;
                if (!isDelete) {
                    let eventt = $A.get('e.c:AS_DiscountManager_PriceBook_Event');
                    eventt.setParams({
                        "recordId": id,
                        "isActive": isActive
                    });
                    eventt.fire();
                }
            } else {
            }
        });
        $A.enqueueAction(action);
    }
})