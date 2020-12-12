/**
 * Created by tomas on 09.12.2020.
 */
({

    doInit: function (component, event) {
        console.log('wchodzi do helpera');
        const action = component.get('c.getPriceBookWrappers');
        console.log('22');
        action.setCallback(this, function(response) {
            console.log('33');
            const status = response.getState();
            if (status === 'SUCCESS') {
                console.log('WCHODZI DO SUCCESS');
                let priceBookWrappers = response.getReturnValue();
                component.set('v.PriceBookWrapper',priceBookWrappers);
            } else {
                console.log('WCHODZI DO ERROR');
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
        let orderNumber = wrapper.orderNumber;
        eventt.setParams({
            "recordId": id,
            "isActive": isActive
        });

        eventt.fire();
        console.log('EVENT się wysyła z id: ' + id);
    }
})