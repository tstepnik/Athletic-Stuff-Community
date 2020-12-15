({
    onInit: function (component) {
        this.hidePercentSlider(component);
        this.hidePriceInput(component);
    },

    clickCButton: function (component) {
        this.hidePercentSlider(component);
        this.showPriceInput(component);
        component.set('v.isPercent', false);
    },

    clickPercentButton: function (component) {
        this.hidePriceInput(component);
        this.showPercentSlider(component);
        component.set('v.isPercent', true);
    },

    showPriceInput: function (component) {
        let priceInput = component.find('amountInput');
        let hasHideClass = $A.util.hasClass(priceInput, "hideElement");
        let hasShowClass = $A.util.hasClass(priceInput, "showElement");
        if (hasHideClass) {
            $A.util.removeClass(priceInput, 'hideElement');
        }
        if (!hasShowClass) {
            $A.util.toggleClass(priceInput, 'showElement');
        }
    },

    showPercentSlider: function (component) {
        let percentSlider = component.find('slider');
        let hasHideClass = $A.util.hasClass(percentSlider, "hideElement");
        let hasShowClass = $A.util.hasClass(percentSlider, "showElement");
        if (hasHideClass) {
            $A.util.removeClass(percentSlider, 'hideElement');
        }
        if (!hasShowClass) {
            $A.util.toggleClass(percentSlider, 'showElement');
        }
    },

    hidePriceInput: function (component) {
        let priceInput = component.find('amountInput');
        let hasHideClass = $A.util.hasClass(priceInput, "hideElement");
        let hasShowClass = $A.util.hasClass(priceInput, "showElement");
        if (hasShowClass) {
            $A.util.removeClass(priceInput, 'showElement');
        }
        if (!hasHideClass) {
            $A.util.toggleClass(priceInput, 'hideElement');
        }
    },

    hidePercentSlider: function (component) {
        let percentSlider = component.find('slider');
        let hasHideClass = $A.util.hasClass(percentSlider, "hideElement");
        let hasShowClass = $A.util.hasClass(percentSlider, "showElement");
        if (hasShowClass) {
            $A.util.removeClass(percentSlider, 'showElement');
        }
        if (!hasHideClass) {
            $A.util.toggleClass(percentSlider, 'hideElement');
        }
    },

    setEventWithDiscountInfo: function (component) {
        let isPercent = component.get('v.isPercent');
        let discount;
        if (isPercent) {
            discount = component.get('v.discountPercent');
        } else {
            discount = component.get('v.discountAmount');
        }
        let startDate = component.get('v.startDate');
        let endDate = component.get('v.endDate');
        console.log('PRZED WYSLANIEM');
        console.log(discount);
        let event = $A.get('e.c:AS_DiscountManager_BasicPromotionEvent');

        event.setParams({
            "discount": discount,
            "startDate": startDate,
            "endDate": endDate,
            "isPercent": isPercent
        });
        console.log('event się wysyła');
        event.fire();
        console.log('event się wysyła');
    },

    sendHandleModalEvent: function (component) {
        let isPercent = component.get('v.isPercent');
        let discount;
        if (isPercent) {
            discount = component.get('v.discountPercent');
        } else {
            discount = component.get('v.discountAmount');
        }
        let startDate = component.get('v.startDate');
        let endDate = component.get('v.endDate');
        console.log('PRZED WYSLANIEM');
        console.log(discount);
        let event = $A.get('e.c:AS_DiscountManager_OpenModal_Event');

        event.setParams({
            "discount": discount,
            "startDate": startDate,
            "endDate": endDate,
            "isPercent": isPercent
        });
        event.fire();
    }

})