({

    setDetails: function (component, event, helper) {
        let numberOfProducts = 1;
        let price = component.get('v.opportunityProduct');

        component.set('v.numberOfUnits', numberOfProducts);
        component.set('v.productPrice', price.ListPrice);
        component.set('v.priceSum', price.ListPrice);
        this.hideUnitPrice(component);
    },

    increaseProductsNumber: function (component, event, helper) {
        let price = component.get('v.productPrice');
        let number = component.get('v.numberOfUnits');
        let cmpNumber = parseInt(number) + 1;
        let newPrice = price * cmpNumber;
        component.set('v.numberOfUnits', cmpNumber);
        component.set('v.priceSum', newPrice.toFixed(2));
        if (cmpNumber > 1) {
            this.showUnitPrice(component);
        } else {
            this.hideUnitPrice(component);
        }
    },

    decreaseProductsNumber: function (component, event, helper) {
        let price = component.get('v.productPrice');
        let cmpNumber = component.get('v.numberOfUnits');
        if (cmpNumber > 1) {
            let cmpDecreasedNumber = cmpNumber - 1;
            let newPrice = price * cmpDecreasedNumber;
            component.set('v.numberOfUnits', cmpDecreasedNumber);
            component.set('v.priceSum', newPrice.toFixed(2));
        }
        if (cmpNumber === 2) {
            this.hideUnitPrice(component);
        }
    },

    showUnitPrice: function (component) {
        let element = component.find('unitPrice');
        $A.util.removeClass(element, "hideElement");
        $A.util.toggleClass(element, "showElement");
    },

    hideUnitPrice: function (component) {
        let element = component.find('unitPrice');
        $A.util.removeClass(element, "showElement");
        $A.util.toggleClass(element, "hideElement");
    },

    changeNumber: function (component, event) {
        let input = component.get('v.numberOfUnits');
        if (input === 0 || input < 1){
            input = 1;
        }
        let price = component.get('v.productPrice');
        let cmpNumber = input;
        let newPrice = price * cmpNumber;
        component.set('v.numberOfUnits', cmpNumber);
        component.set('v.priceSum', newPrice.toFixed(2));
        if (cmpNumber > 1) {
            this.showUnitPrice(component);
        } else {
            this.hideUnitPrice(component);
        }
    },

    pressBasket: function (component, event) {
        let element = component.find('mainContainer');
        $A.util.toggleClass(element, "hideElement");

    },



    removeProductFromBasket: function (component, event, helper) {
        console.log('WCHODZI DO REMOVE PRODUCT FROM BASKET');
        let productId = component.get('v.opportunityProduct.Product2Id');
        console.log('1');
        const action = component.get('c.removeItemFromOrder');
        action.setParams({productId: productId});
        console.log('2');
        action.setCallback(this, function (response) {
            console.log('3');
            let state = response.getState();
            if (state === "SUCCESS") {
                console.log('4');
                this.handleShowToast(component, event, 'Success', 'Success', 'PRODUCT successfully deleted');

            }      else if (state === "ERROR") {
                this.handleShowToast(component, event, 'Error', 'Error', 'Error while processing loading data');
                let errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +
                            errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },

    handleShowToast: function(component, event, title, variant, message) {
        component.find('notification').showToast({
            "title": title,
            "variant": variant,
            "message": message
        });
    },


})