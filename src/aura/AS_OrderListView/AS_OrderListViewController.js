/**
 * Created by tomas on 04.12.2020.
 */
({

    onInit: function (component, event, helper) {
        helper.loadOrders(component,event);
        // console.log('//////////');
        // console.log('CONTROLLER');
        // console.log('11');
        // let ord = component.get('v.orderWrappers');
        // console.log('22');
        // console.log(ord[0]);
        // console.log('33');
        // console.log(ord[0].numberOfProducts);
        // console.log('44');
        // console.log('//////////');
    },
    printWrapper: function (component) {
        console.log('//////////');
        console.log('CONTROLLER');
        console.log('11');
        let ord = component.get('v.orderWrappers');
        console.log('22');
        console.log(ord[0]);
        console.log('33');
        console.log(ord[0].numberOfProducts);
        console.log('44');
        console.log('//////////');
    }
})