({

    loadProducts: function (component, event, helper) {
        let sessionKey = 'productWrappers';
        let sessionJson = sessionStorage.getItem(sessionKey);
        let firstQueryInfo = JSON.parse(sessionJson);
        component.set('v.products', firstQueryInfo.wrappers);
        component.set('v.clickedNumber-value', 1);
        component.set('v.clickedNumber-auraId', 'pn-m1');
        component.set('v.offset', 0);
        let numberOfRecords = firstQueryInfo.numberOfProducts;
        component.set('v.recordsNumber', numberOfRecords);
        let limit = firstQueryInfo.queryLimit;

        component.set('v.offsetSize', limit);

        this.setRange(component, numberOfRecords, firstQueryInfo.offset, limit);
        this.setNumberOfPages(component, numberOfRecords, limit);
        component.set('v.pn_first', 1);
        component.set('v.pn_second', 2);
        component.set('v.pn_third', 3);
        component.set('v.pn_fourth', 4);
        component.set('v.pn_fifth', 5);
        this.setPageNumbers(component,0);
        this.colorElement(component, 'pn-m1');
        let numberOfPages = component.get('v.numberOfPages');
        this.hidePreviousPage(component);
        if(numberOfRecords <= 0){
            this.hidePagination(component);
        }else if(numberOfPages === 1){
            this.hideNextPage(component);
        }
    },

    pressPreviousButton: function (component) {
        console.log(' ');
        console.log(' ');
        console.log('//////////PREVIOUS BTN ////////////////');
        console.log(' ');
        console.log(' ');
        let clickedNbValue = component.get('v.clickedNumber-value'); /// gdy przeskakuje na inne strony to z powrotem wyrzuca NaN
        let clickedNbAuraId = component.get('v.clickedNumber-auraId');
        console.log('Było na stronie ' + (clickedNbValue) + ' a teraz jest na ' + (clickedNbValue - 1));
        console.log(' ');
        console.log('clockenNbVale: ' + clickedNbValue);
        console.log('clockenNbAuraId: ' + clickedNbAuraId);

        if (clickedNbValue > 1) {
            let oldAIdNumber = clickedNbAuraId.substring(clickedNbAuraId.length - 1); //number
            let oldAIdText = clickedNbAuraId.slice(0, -1); //text
            let newNumber = parseInt(oldAIdNumber) - 1;
            let newAuraId = oldAIdText + newNumber;

            console.log('oldAidNumber: ' + oldAIdNumber);
            console.log('oldAIdText: ' + oldAIdText);
            console.log('newNumber: ' + newNumber);
            console.log('newAuraId: ' + newAuraId);


            let offsetSize = component.get('v.offsetSize');
            console.log('offsetSize: ' + offsetSize);
            if (clickedNbAuraId === 'pn-m1') {
                console.log('pn-m1 i wchodzi do ifa');
                this.decreaseButtons(component);
                newAuraId = component.get('v.clickedNumber-auraId');
                console.log('auraId sie poprawia: ' + newAuraId);
            } else {
                console.log('wchodzi do elsa i koloruje element');
                this.colorElement(component, newAuraId);
            }

            component.set('v.clickedNumber-value', clickedNbValue - 1);
            component.set('v.clickedNumber-auraId', newAuraId);

            this.showNextPage(component);
            console.log('clickedNbValue: ' + clickedNbValue);
            if (1 >= (clickedNbValue - 1)) {
                console.log('1 >= (clickedNbValue - 1)');
                console.log('wchodzi do ifa');

                this.hidePreviousPage(component);
                this.showNextPage(component);
            }


            let offset = component.get('v.offset');
            console.log('offset: ' + offset);
            let newOffset = parseInt(offset) - parseInt(offsetSize);
            console.log('newOffset: ' + newOffset);
            component.set('v.offset', newOffset);
            this.changeData(component, newOffset);

        }
        console.log(' ');
        console.log(' ');
        console.log('//////////PREVIOUS BTN ////////////////');
        console.log(' ');
        console.log(' ');

    },

    pressNextButton: function (component, event, helper) {
        console.log(' ');
        console.log(' ');
        console.log('//////////NEXT BTN ////////////////');
        console.log(' ');
        console.log(' ');
        let increseNumbers = false;
        let clickedNbValue = component.get('v.clickedNumber-value');
        let clickedNbAuraId = component.get('v.clickedNumber-auraId');
        const numberOfPages = component.get('v.numberOfPages');
        console.log('Było na stronie ' + (clickedNbValue) + ' a teraz jest na ' + (clickedNbValue + 1));
        console.log(' ');
        console.log('clockenNbVale: ' + clickedNbValue);
        console.log('clockenNbAuraId: ' + clickedNbAuraId);

        if (clickedNbValue <= numberOfPages) {
            let oldAIdNumber = clickedNbAuraId.substring(clickedNbAuraId.length - 1); //number
            let oldAIdText = clickedNbAuraId.slice(0, -1); //text
            let newNumber;
            if (parseInt(oldAIdNumber) >= 5){
                newNumber = 1;
            } else {
                newNumber = parseInt(oldAIdNumber) + 1;
            }
            let newAuraId = oldAIdText + newNumber;
            let offsetSize = component.get('v.offsetSize');

            console.log('oldAidNumber: ' + oldAIdNumber);
            console.log('oldAIdText: ' + oldAIdText);
            console.log('newNumber: ' + newNumber);
            console.log('newAuraId: ' + newAuraId);
            console.log('offsetSize: ' + offsetSize);

            if (clickedNbAuraId === 'pn-m5') {
                console.log('wchodzi do ifa: (clickedNbAuraId === \'pn-m5\')');
                console.log('metoda increaseButtons');
                console.log('///////////////////');
                console.log('///////////////////');
                console.log('BEFORE INCREASE BTNS');
                this.printButtons(component);
                this.increaseButtons(component);
                console.log('AFTER INCREASE BTNS');
                this.printButtons(component);
                console.log('///////////////////');
                console.log('///////////////////');
                increseNumbers = true;
                newAuraId = component.get('v.clickedNumber-auraId');
                console.log('newAuraId: ' + newAuraId);
            } else {
                console.log('coloruje element');
                this.colorElement(component, newAuraId);
            }

            component.set('v.clickedNumber-value', parseInt(clickedNbValue) + 1);
            component.set('v.clickedNumber-auraId', newAuraId);

            this.showPreviousPage(component);
            if ((clickedNbValue + 1) >= numberOfPages) {
                console.log('wchodzi do ifa: ((clickedNbValue + 1) >= numberOfPages)');
                this.hideNextPage(component);
                this.showPreviousPage(component);
            }

            let offset = component.get('v.offset');
            let newOffset = parseInt(offset) + parseInt(offsetSize);
            console.log('offset: ' + offset);
            console.log('newOffset: ' + newOffset);

            component.set('v.offset', newOffset);
            this.changeData(component, newOffset);

        }
        console.log(' ');
        console.log(' ');
        console.log('//////////NEXT BTN ////////////////');
        console.log(' ');
        console.log(' ');
    },

    choosePage: function (component, event) {

        let clickedNbValue = component.get('v.clickedNumber-value');
        let clickedNbAuraId = component.get('v.clickedNumber-auraId');
        const numberOfPages = component.get('v.numberOfPages');

        let id = event.target.id;
        let fields = id.split(' ');
        let value = fields[0];
        let auraId = fields[1];
        let element = component.find(auraId);
        component.set('v.clickedNumber-auraId', auraId);
        component.set('v.clickedNumber-value', value);
        this.removeColorFromAll(component);
        $A.util.toggleClass(element, "colorElement");

        let offsetSize = component.get('v.offsetSize');
        let newOffset = (offsetSize * value) - offsetSize;
        component.set('v.offset', newOffset);
        this.changeData(component, newOffset);

        component.set('v.clickedNumber-auraId', auraId);
        component.set('v.clickedNumber-value', value);

        if (value > 1) {
            this.showPreviousPage(component);
        } else {
            this.hidePreviousPage(component);
        }
        ;

        if (value < numberOfPages) {
            this.showNextPage(component);
        } else {
            this.hideNextPage(component);
        }
        ;
    },

    setNumberOfPages: function (component, numberOfRecords, limit) {
        let numberOfPages = Math.floor(numberOfRecords / limit);

        if (numberOfRecords % limit !== 0) {
            numberOfPages += 1;
        }
        component.set('v.numberOfPages', numberOfPages);
    },


    hidePreviousPage: function (component) {
        let pageNumber = component.get('v.clickedNumber-value');
        if (pageNumber <= 1) {
            let toggleText = component.find("previousPage-id");
            $A.util.removeClass(toggleText, "showElement");
            $A.util.toggleClass(toggleText, "hideElement");
        }
    },

    showPreviousPage: function (component) {
        let toggleText = component.find("previousPage-id");
        $A.util.removeClass(toggleText, "hideElement");
        $A.util.toggleClass(toggleText, "showElement");
    },

    hideNextPage: function (component) {
        let pageNumber = component.get('v.clickedNumber-value');
        let lastPage = component.get('v.numberOfPages');
        if (pageNumber >= lastPage) {
            let toggleText = component.find("nextPage-id");
            $A.util.removeClass(toggleText, "showElement");
            $A.util.toggleClass(toggleText, "hideElement");
        }
    },

    showNextPage: function (component) {
        let element = component.find("nextPage-id");
        $A.util.removeClass(element, "hideElement");
        $A.util.toggleClass(element, "showElement");
    },

    colorElement: function (component, auraId) {
        this.removeColorFromAll(component);
        let element = component.find(auraId);
        $A.util.toggleClass(element, "colorElement");
    },

    changeData: function (component, offset) {

        let sessionKey = 'productWrappers';
        let sessionJson = sessionStorage.getItem(sessionKey);
        let firstQueryInfo = JSON.parse(sessionJson);
        let action = component.get("c.getNextPageOffset");
        action.setParams({
            inpTxt: firstQueryInfo.queryPhrase,
            offset: offset
        });

        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {

                let productsFromApex = response.getReturnValue();
                component.set("v.products", productsFromApex);
                let numberOfRecords = firstQueryInfo.numberOfProducts;
                this.setRange(component, numberOfRecords, offset, firstQueryInfo.queryLimit);


            } else if (state === "ERROR") {
                let errors = response.getError();
                let message,
                    title = 'Error';
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        message = errors[0].message
                        console.log(message);
                    }
                } else {
                    message = 'Unknow error';
                    console.log(message);
                }
            }
        });
        $A.enqueueAction(action);

    },

    setRange: function (component, numberOfRecords, offset, limit) {
        let rangeStart = offset + 1;
        component.set('v.recordsOnPage_start', rangeStart);
        let rangeEnd;
        if ((limit + offset) > numberOfRecords) {
            rangeEnd = numberOfRecords;
        } else {
            rangeEnd = limit + offset;
        }
        component.set('v.recordsOnPage_end', rangeEnd);

    },

    setPageNumbers: function (component, additionalValue) {
        this.setPageNumber(component, 'pn_first', 'pn-m1', additionalValue);
        this.setPageNumber(component, 'pn_second', 'pn-m2', additionalValue);
        this.setPageNumber(component, 'pn_third', 'pn-m3', additionalValue);
        this.setPageNumber(component, 'pn_fourth', 'pn-m4', additionalValue);
        this.setPageNumber(component, 'pn_fifth', 'pn-m5', additionalValue);
    },

    setPageNumber: function (component, cmpName, cmpAuraId, additionalValue) {
        let numberOfPages = component.get('v.numberOfPages');
        let getCmpName = 'v.' + cmpName;
        let cmpValue = component.get(getCmpName);
        let newValue = cmpValue + additionalValue;
        let element = component.find(cmpAuraId);
        component.set(getCmpName, newValue);
        if (newValue <= numberOfPages && newValue > 0) {
            $A.util.removeClass(element, "hideElement");
            $A.util.toggleClass(element, "showElement");
        } else {
            $A.util.removeClass(element, "showElement");
            $A.util.toggleClass(element, "hideElement");
        }
    },

    removeColorFromAll: function (component) {
        for (let i = 1; i < 6; i++) {
            let auraId = "pn-m" + i;
            let toggleText = component.find(auraId);
            $A.util.removeClass(toggleText, "colorElement");

        }
    },

    increaseButtons: function (component) {

        let clickedNbValue = component.get('v.clickedNumber-value');

        let newNumber = parseInt(clickedNbValue) + 1;
        //todo check is is changed to String
        component.set('v.clickedNumber-value', newNumber);
        component.set('v.clickedNumber-auraId', 'pn-m2');

        this.setPageNumbers(component, 4);
        this.removeColorFromAll(component);
        this.colorElement(component, 'pn-m2');

    },

    printButtons: function(component){
        console.log('//////////NUMBERS////////////');
        console.log(component.get('v.pn_first'));
        console.log(component.get('v.pn_second'));
        console.log(component.get('v.pn_third'));
        console.log(component.get('v.pn_fourth'));
        console.log(component.get('v.pn_fifth'));

        console.log('//////////NUMBERS////////////');
    },

    decreaseButtons: function (component) {

        let clickedNbValue = component.get('v.clickedNumber-value');

        let newNumber = parseInt(clickedNbValue) - 1;
        //todo check is is changed to String
        component.set('v.clickedNumber-value', newNumber);
        component.set('v.clickedNumber-auraId', 'pn-m4');

        this.setPageNumbers(component, (-4));
        this.removeColorFromAll(component);
        this.colorElement(component, 'pn-m4');
    },

    hidePagination: function (component) {
        let pagination = component.find('pagination-div');
        $A.util.toggleClass(pagination, "hideElement");
    }


})