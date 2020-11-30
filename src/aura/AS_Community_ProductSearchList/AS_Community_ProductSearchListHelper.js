({

    loadProducts: function (component, event, helper) {
        let sessionKey = 'productWrappers';
        let sessionJson = sessionStorage.getItem(sessionKey);
        let firstQueryInfo = JSON.parse(sessionJson);
        component.set('v.products', firstQueryInfo.wrappers);
        component.set('v.pageNumber', 1);
        component.set('v.offset', 0);
        let numberOfRecords = firstQueryInfo.numberOfProducts;
        component.set('v.recordsNumber', numberOfRecords);
        let limit = firstQueryInfo.queryLimit;

        component.set('v.offsetSize', limit);

        this.setRange(component, numberOfRecords, firstQueryInfo.offset, limit);
        this.setNumberOfPages(component, numberOfRecords, limit);
        this.hidePreviousPage(component);
        this.displayPageNumbers(component);
        component.set('v.pn_first', 1);
        component.set('v.pn_second', 2);
        component.set('v.pn_third', 3);
        component.set('v.pn_fourth', 4);
        component.set('v.pn_fifth', 5);
        this.colorElement(component, 'pn-m1');
    },

    setRange: function (component, numberOfRecords, offset, limit) {
        let rangeStart = offset;
        component.set('v.recordsOnPage_start', rangeStart);
        let rangeEnd;
        if ((limit + offset) > numberOfRecords) {
            rangeEnd = numberOfRecords;
        } else {
            rangeEnd = limit + offset;
        }
        component.set('v.recordsOnPage_end', rangeEnd);

    },

    setNumberOfPages: function (component, numberOfRecords, limit) {
        let numberOfPages = Math.floor(numberOfRecords / limit);

        if (numberOfRecords % limit !== 0) {
            numberOfPages += 1;
        }
        component.set('v.numberOfPages', numberOfPages);
    },

    pressPreviousButton: function (component) {
        let pageNumber = component.get('v.pageNumber');
        component.set('v.pageNumber', pageNumber - 1);
        console.log(pageNumber - 1);
        console.log(1 >= (pageNumber - 1));
        this.showNextPage(component);
        if (1 >= (pageNumber - 1)) {
            console.log('WCHODZI DO IFA');
            this.hidePreviousPage(component);
            this.showNextPage(component);
        }

        let offset = component.get('v.offset');
        let offsetSize = component.get('v.offsetSize');
        component.set('v.offset', offset - offsetSize);
        console.log('OFFSET:');
        console.log(offset);
        this.changeData(component, offset - offsetSize);
    },

    pressNextButton: function (component, event, helper) {
        console.log('NEXT BUTTON PRESSED');
        let offsetSize = component.get('v.offsetSize');
        const numberOfPages = component.get('v.numberOfPages');
        let pageNumber = component.get('v.pageNumber');
        component.set('v.pageNumber', pageNumber + 1);
        this.showPreviousPage(component);
        if ((pageNumber + 1) >= numberOfPages) {
            this.hideNextPage(component);
            this.showPreviousPage(component);
        }

        let offset = component.get('v.offset');
        component.set('v.offset', offset + offsetSize);
        console.log('OFFSET:');
        console.log(offset);
        this.changeData(component, offset + offsetSize);
    },

    hidePreviousPage: function (component) {
        console.log('WCHODZI DO HIDE PREVIOUS PAGE');
        let toggleText = component.find("previousPage-id");
        $A.util.removeClass(toggleText, "showElement");
        $A.util.toggleClass(toggleText, "hideElement");
    },

    showPreviousPage: function (component) {
        let toggleText = component.find("previousPage-id");
        $A.util.removeClass(toggleText, "hideElement");
        $A.util.toggleClass(toggleText, "showElement");
    },

    hideNextPage: function (component) {
        let toggleText = component.find("nextPage-id");
        $A.util.removeClass(toggleText, "showElement");
        $A.util.toggleClass(toggleText, "hideElement");
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
        console.log('WCHODZI DO CHANGE DATA');
        let sessionKey = 'productWrappers';
        let sessionJson = sessionStorage.getItem(sessionKey);
        let firstQueryInfo = JSON.parse(sessionJson);
        console.log('QUERY PHRASE: ');
        console.log(firstQueryInfo.queryPhrase);
        let action = component.get("c.getNextPageOffset");
        action.setParams({
            inpTxt: firstQueryInfo.queryPhrase,
            offset: offset
        });

        action.setCallback(this, function (response) {
            console.log('WCHODZI DO SET CALLBACK');
            let state = response.getState();
            if (state === "SUCCESS") {
                console.log('WCHODZI DO SUCCESS');


                let productsFromApex = response.getReturnValue();
                console.log('PRODUKTY:');
                console.log(productsFromApex);
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

    displayPageNumbers: function (component) {
        let numberOfPages = component.get('v.numberOfPages');

        if (numberOfPages < 3) {

            for (let i = numberOfPages + 1; i <= 3; i++) {
                let className = 'pn-m' + i;
                let toggleText = component.find(className);
                $A.util.removeClass(toggleText, "showElement");
                $A.util.toggleClass(toggleText, "hideElement");
            }

        }
    },

    choosePage: function (component, event) {
        let id = event.target.id;
        let fields = id.split(' ');
        let value = fields[0];
        let auraId = fields[1];
        let element = component.find(auraId);
        this.removeColorFromAll(component);
        $A.util.toggleClass(element, "colorElement");
        let offsetSize = component.get('v.offsetSize');
        let offset = (offsetSize * value) - offsetSize;
        this.changeData(component, offset);

        if (auraId === 'pn-m5') {
            console.log('WCHODZI DO IF');
            this.increaseButtons(component);
        }
        if (value > 1) {
            this.showPreviousPage(component);
        } else {
            this.hidePreviousPage(component);
        }
        component.set('v.clickedNumber-auraId', auraId);
        component.set('v.clickedNumber-value', value);
    },

    setPageNumbers: function (component, additionalValue) {
        let c1 = component.get('v.pn_first');
        component.set('v.pn_first', c1 + additionalValue);
        let c2 = component.get('v.pn_second');
        component.set('v.pn_second', c2 + additionalValue);
        let c3 = component.get('v.pn_third');
        component.set('v.pn_third', c3 + additionalValue);
        let c4 = component.get('v.pn_fourth');
        component.set('v.pn_fourth', c4 + additionalValue);
        let c5 = component.get('v.pn_fifth');
        component.set('v.pn_fifth', c5 + additionalValue);

    },

    setPageNumber: function(component, cmpName, cmpAuraId, additionalValue) {
        let numberOfPages = component.get('v.numberOfPages');
        let getCmpName = 'v.' + cmpName;
        let cmpValue = component.get(getCmpName);
        let newValue = cmpValue + additionalValue;
        let element = component.find(cmpAuraId);
        if (newValue <= numberOfPages) {
            component.set(getCmpName, newValue);
            $A.util.removeClass(element, "hideElement");
            $A.util.toggleClass(element, "showElement");
        }else {
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
        this.setPageNumbers(component, 4);
        this.removeColorFromAll(component);
        this.colorElement(component, 'pn-m1');
    },

    decreaseButtons: function (component) {
        let minPageNumber = component.get('v.pn_first');
        if (minPageNumber > 1) {
            this.setPageNumbers(component, (-4));
            this.removeColorFromAll(component);
            this.colorElement(component, 'pn-m5');

        }
    },


})