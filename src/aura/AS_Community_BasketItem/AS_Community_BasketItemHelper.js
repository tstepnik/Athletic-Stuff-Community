
({

    setDetails: function (component, event, helper) {
        let numberOfProducts = 1;
        let price = component.get('v.opportunityProduct');

        component.set('v.numberOfUnits', numberOfProducts);
        component.set('v.productPrice', price.UnitPrice);
        component.set('v.priceSum', price.UnitPrice);
    },

    increaseProductsNumber: function (component, event, helper) {
        let price = component.get('v.productPrice');
        let cmpNumber = component.get('v.numberOfUnits') + 1;
        let newPrice = price * cmpNumber;
        component.set('v.numberOfUnits', cmpNumber);
        component.set('v.priceSum',newPrice)
    },

    decreaseProductsNumber: function (component, event, helper) {
        let price = component.get('v.productPrice');
        let cmpNumber = component.get('v.numberOfUnits');
        if (cmpNumber > 1) {
            let cmpDecreasedNumber = cmpNumber - 1;
            let newPrice = price * cmpDecreasedNumber;
            component.set('v.numberOfUnits', cmpDecreasedNumber);
            component.set('v.priceSum',newPrice)
        }
    }

})