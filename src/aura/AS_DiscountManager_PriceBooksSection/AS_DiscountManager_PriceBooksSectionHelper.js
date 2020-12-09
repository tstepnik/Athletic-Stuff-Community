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
    }
})