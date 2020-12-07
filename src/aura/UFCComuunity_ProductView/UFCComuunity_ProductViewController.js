({
    init : function(component, event, helper){
        helper.init(component, event, helper);
    },
    // handleRecords : function(component, event, helper){
    //     let size = component.get('v.product.Product_Size__c');
    //     component.set('v.sizes', size.toString().split(';'));
    //
    //     console.log(component.get('v.product.Product_Size__c'));
    // }
    addElementToBasket : function(component, event, helper){
        helper.addElementToBasket(component, event);
    },
})