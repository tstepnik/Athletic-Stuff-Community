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

        this.setRange(component, numberOfRecords, firstQueryInfo.offset, limit);
        this.setNumberOfPages(component, numberOfRecords, limit);
        this.hidePreviousPage(component);
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
        component.set('v.offset', offset - 16);
        console.log('OFFSET:');
        console.log(offset);
        this.changeData(component, offset - 16);
    },

    pressNextButton: function (component, event, helper) {
        console.log('NEXT BUTTON PRESSED');
        const numberOfPages = component.get('v.numberOfPages');
        let pageNumber = component.get('v.pageNumber');
        component.set('v.pageNumber', pageNumber + 1);
        this.showPreviousPage(component);
        if ((pageNumber + 1) >= numberOfPages) {
            this.hideNextPage(component);
            this.showPreviousPage(component);
        }

        let offset = component.get('v.offset');
        component.set('v.offset', offset + 16);
        console.log('OFFSET:');
        console.log(offset);
        this.changeData(component, offset + 16);
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
        let toggleText = component.find("nextPage-id");
        $A.util.removeClass(toggleText, "hideElement");
        $A.util.toggleClass(toggleText, "showElement");
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

    }

})