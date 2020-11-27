({
    loadProducts: function (component, event, helper) {
        let sessionKey = 'products';
        let sessionJson = sessionStorage.getItem(sessionKey);
        let products = JSON.parse(sessionJson);
        component.set('v.products', products);
    }



















//     loadProducts: function (component,event, helper) {
// console.log("1");
//         let action = component.get('c.products');
//
//         console.log("2");
//         action.setCallback(this, function(response){
//             let state = response.getState();
//             if(state ===  "SUCCESS"){
//                 let products = response.getReturnValue();
//                 console.log("PRODUCTS:");
//                 console.log(products);
//                 component.set("v.products",products);
//             }else {
//                 console.log('ERROR');
//                 console.log('ERROR');
//             }
//         });
//         $A.enqueueAction(action);
//     }
})