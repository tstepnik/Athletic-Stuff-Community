({
    searchOperations: function (component) {
        let inputText = component.get('v.inputText');
        const action = component.get('c.getSearchProductsWrapper');
        action.setParams({inpTxt: inputText});
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let productsBoundle = response.getReturnValue();
                component.set('v.productWrappers', productsBoundle.wrappers);
                component.set('v.productInfoBunch', productsBoundle);
                this.loadProducts(component, productsBoundle);

            } else {
                let error = response.getError();
            }
        });
        $A.enqueueAction(action);
    },


    hidePagination: function (component) {
        let pagination = component.find('pagination-div');
        $A.util.toggleClass(pagination, "hideElement");

    },
    showPagination: function (component) {
        let pagination = component.find('pagination-div');
        $A.util.removeClass(pagination, "hideElement");

    },

    loadProducts: function (component, productInfoBunch) {
        this.setCmpFirstTime(component, productInfoBunch);
        let firstQueryInfo = productInfoBunch;
        let numberOfRecords = firstQueryInfo.numberOfProducts;
        let limit = firstQueryInfo.queryLimit;
        this.setNumberOfPages(component, numberOfRecords, limit);
        let numberOfPages = component.get('v.numberOfPages');
        this.setRange(component, numberOfRecords, firstQueryInfo.offset, limit);
        this.setPageNumbers(component, 0);
        this.colorElement(component, 'pn-m1');
        this.hidePreviousPage(component);
        if (numberOfRecords <= 0) {
            this.hidePagination(component);
        } else if (numberOfPages === 1) {
            this.hideNextPage(component);
        }
    },

    pressPreviousButton: function (component, event) {
        let clickedNbValue = component.get('v.clickedNumber-value');
        let clickedNbAuraId = component.get('v.clickedNumber-auraId');

        if (clickedNbValue > 1) {
            let oldAIdNumber = clickedNbAuraId.substring(clickedNbAuraId.length - 1);
            let oldAIdText = clickedNbAuraId.slice(0, -1);
            let newNumber = parseInt(oldAIdNumber) - 1;
            let newAuraId = oldAIdText + newNumber;

            let offsetSize = component.get('v.offsetSize');
            if (clickedNbAuraId === 'pn-m1') {
                this.decreaseButtons(component);
                newAuraId = component.get('v.clickedNumber-auraId');
            } else {
                this.colorElement(component, newAuraId);
            }

            component.set('v.clickedNumber-value', clickedNbValue - 1);
            component.set('v.clickedNumber-auraId', newAuraId);

            this.showNextPage(component);
            if (1 >= (clickedNbValue - 1)) {

                this.hidePreviousPage(component);
                this.showNextPage(component);
            }

            let offset = component.get('v.offset');
            let newOffset = parseInt(offset) - parseInt(offsetSize);
            component.set('v.offset', newOffset);
            this.changeData(component, event, newOffset);
        }
    },

    pressNextButton: function (component, event) {
        let clickedNbValue = component.get('v.clickedNumber-value');
        let clickedNbAuraId = component.get('v.clickedNumber-auraId');
        const numberOfPages = component.get('v.numberOfPages');

        if (clickedNbValue <= numberOfPages) {
            let oldAIdNumber = clickedNbAuraId.substring(clickedNbAuraId.length - 1); //number
            let oldAIdText = clickedNbAuraId.slice(0, -1); //text
            let newNumber;
            if (parseInt(oldAIdNumber) >= 5) {
                newNumber = 1;
            } else {
                newNumber = parseInt(oldAIdNumber) + 1;
            }
            let newAuraId = oldAIdText + newNumber;
            let offsetSize = component.get('v.offsetSize');

            if (clickedNbAuraId === 'pn-m5') {

                this.increaseButtons(component);
                newAuraId = component.get('v.clickedNumber-auraId');
            } else {
                this.colorElement(component, newAuraId);
            }

            component.set('v.clickedNumber-value', parseInt(clickedNbValue) + 1);
            component.set('v.clickedNumber-auraId', newAuraId);

            this.showPreviousPage(component);
            if ((clickedNbValue + 1) >= numberOfPages) {
                this.hideNextPage(component);
                this.showPreviousPage(component);
            }

            let offset = component.get('v.offset');
            let newOffset = parseInt(offset) + parseInt(offsetSize);

            component.set('v.offset', newOffset);
            this.changeData(component, event, newOffset);
        }

    },

    choosePage: function (component, event) {
        let lastClickedNumber = component.get('v.clickedNumber-value');
        const numberOfPages = component.get('v.numberOfPages');

        let id = event.target.id;
        let fields = id.split(' ');
        let value = fields[0];
        let auraId = fields[1];
        let element = component.find(auraId);
        if (lastClickedNumber != value) {
            component.set('v.clickedNumber-auraId', auraId);
            component.set('v.clickedNumber-value', value);
            this.removeColorFromAll(component);
            $A.util.toggleClass(element, "colorElement");

            let offsetSize = component.get('v.offsetSize');
            let newOffset = (offsetSize * value) - offsetSize;
            component.set('v.offset', newOffset);
            this.changeData(component, event, newOffset);
            if (value > 1) {
                this.showPreviousPage(component);
            } else {
                this.hidePreviousPage(component);
            }

            if (value < numberOfPages) {
                this.showNextPage(component);
            } else {
                this.hideNextPage(component);
            }
        }


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
            this.changeClasses(component, "previousPage-id", "showElement", "hideElement");
        }
    },

    showPreviousPage: function (component) {
        this.changeClasses(component, "previousPage-id", "hideElement", "showElement");
    },

    hideNextPage: function (component) {
        let pageNumber = component.get('v.clickedNumber-value');
        let lastPage = component.get('v.numberOfPages');
        if (pageNumber >= lastPage) {
            this.changeClasses(component, "nextPage-id", "showElement", "hideElement");
        }
    },

    showNextPage: function (component) {
        let clickedPage = component.get('v.clickedNumber-value');
        let numberOfPages = component.get('v.numberOfPages');
        if (clickedPage < numberOfPages) {
            this.changeClasses(component, "nextPage-id", "hideElement", "showElement");
        }
    },

    changeData: function (component, event, offset) {
        let firstQueryInfo = component.get('v.productInfoBunch');
        let action = component.get("c.getNextPageOffset");
        action.setParams({
            inpTxt: firstQueryInfo.queryPhrase,
            offset: offset
        });

        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let productsFromApex = response.getReturnValue();
                component.set("v.productWrappers", productsFromApex);
                let numberOfRecords = firstQueryInfo.numberOfProducts;
                this.setRange(component, numberOfRecords, offset, firstQueryInfo.queryLimit);


            } else if (state === "ERROR") {
                this.handleErrors(component, event, response);
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
        this.setButtons(component, 1, 'pn-m2', 4);

    },

    decreaseButtons: function (component) {
        this.setButtons(component, -1, 'pn-m4', -4);
    },

    setButtons: function (component, changeValue, auraId, changeNumbersValue) {
        let clickedNbValue = component.get('v.clickedNumber-value');
        let newNumber = parseInt(clickedNbValue) + (changeValue);
        component.set('v.clickedNumber-value', newNumber);
        component.set('v.clickedNumber-auraId', auraId);

        this.setPageNumbers(component, (changeNumbersValue));
        this.removeColorFromAll(component);
        this.colorElement(component, auraId);
    },

    hidePagination: function (component) {
        let pagination = component.find('pagination-div');
        $A.util.toggleClass(pagination, "hideElement");
    },

    setCmpFirstTime: function (component, productInfoBunch) {
        let firstQueryInfo = productInfoBunch;
        component.set('v.products', firstQueryInfo.wrappers);
        component.set('v.clickedNumber-value', 1);
        component.set('v.clickedNumber-auraId', 'pn-m1');
        component.set('v.offset', 0);
        component.set('v.recordsNumber', firstQueryInfo.numberOfProducts);
        component.set('v.offsetSize', firstQueryInfo.queryLimit);
        component.set('v.pn_first', 1);
        component.set('v.pn_second', 2);
        component.set('v.pn_third', 3);
        component.set('v.pn_fourth', 4);
        component.set('v.pn_fifth', 5);
    },

    colorElement: function (component, auraId) {
        this.removeColorFromAll(component);
        let element = component.find(auraId);
        $A.util.toggleClass(element, "colorElement");
    },

    changeClasses: function (component, auraId, classToRemove, classToAdd) {
        let toggleText = component.find(auraId);
        $A.util.removeClass(toggleText, classToRemove);
        $A.util.toggleClass(toggleText, classToAdd);
    },

    handleShowToast: function (component, event, title, variant, message) {
        component.find('notification').showToast({
            "title": title,
            "variant": variant,
            "message": message
        });
    },

    handleErrors: function (component, event, response) {
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
    },

    clickTableMainBtn: function (component) {
        let productWrappers = component.get('v.productWrappers');
        let mainBtn = component.find('tableMainBtn');
        let btnWasClicked = $A.util.hasClass(mainBtn, 'colorBtn');
        let list = component.get('v.productWrappers');
        if (!btnWasClicked) {
            $A.util.toggleClass(mainBtn, 'colorBtn');
            for (let i = 0; i < list.length; i++) {
                let elId = i + "tableRowBtn";
                let btnElement = document.getElementById(elId);
                btnElement.classList.add("colorBtn");
                this.addToChosenProducts(component, productWrappers[i]);
            }
        } else {
            $A.util.removeClass(mainBtn, 'colorBtn');
            for (let i = 0; i < list.length; i++) {
                let elId = i + "tableRowBtn";
                let btnElement = document.getElementById(elId);
                btnElement.classList.remove("colorBtn");
                this.removeFromChosenProducts(component, productWrappers[i]);

            }
        }
    },

    consoleLog: function (component, event) {
        let index = event.currentTarget.dataset.index;
        console.log('INDEX');
        console.log(index);
    },

    createPromotion: function (component, event) {
        console.log('wchodzi do promotion');
        //todo
        let discount = event.getParam('discount');
        let startDate = event.getParam('startDate');
        let endDate = event.getParam('endDate');
        let isPercent = event.getParam('isPercent');
        let wrappers = component.get('v.chosenProductWrappers');

        const action = component.get('c.createDiscountApex');
        action.setParams({
            discount: discount,
            isPercent: isPercent,
            startDate: startDate,
            endDate: endDate,
            wrappers: wrappers
        });
        console.log('przed callback');
        action.setCallback(this, function (response) {
            console.log('wchodzi do callback');
            let state = response.getState();
            if (state === "SUCCESS") {
                console.log('wchodzi do success');

                let responseMessage = 'Discount successfully created.'
                let sendToast = component.find('toastMaker');
                sendToast.sendResultToast('Success', responseMessage, 'Success');
                this.fireUpdatePbListEvent();

            } else {
                let errors = response.getError();
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    console.error(JSON.stringify(errors[0].message));
                }

            }
        });
        $A.enqueueAction(action);
    },

    createCustomisedPromotion: function (component, event) {
        console.log('wchodzi do promotion');
        //todo
        let startDate = component.get('v.discountStartDate');
        let endDate = component.get('v.discountEndDate');
        let wrappers = component.get('v.chosenProductWrappers');

        console.log('start date: ' + startDate);
        console.log('end date: ' + endDate);
        const action = component.get('c.createCustomisedDiscountApex');
        action.setParams({
            startDate: startDate,
            endDate: endDate,
            wrappers: wrappers
        });
        console.log('przed callback');
        action.setCallback(this, function (response) {
            console.log('wchodzi do callback');
            let state = response.getState();
            if (state === "SUCCESS") {
                console.log('wchodzi do success');
                let responseMessage = 'Discount successfully created.'
                let sendToast = component.find('toastMaker');
                component.set('v.showNewRecordModal', false);
                sendToast.sendResultToast('Success', responseMessage, 'Success');
                this.fireUpdatePbListEvent();

            } else {
                let errors = response.getError();
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    console.error(JSON.stringify(errors[0].message));
                }

            }
        });
        $A.enqueueAction(action);
    },

    handleNewRecordModal: function (component, event) {
        let selectedWrappers = component.get('v.chosenProductWrappers');

        let discount = event.getParam('discount');
        let startDate = event.getParam('startDate');
        let endDate = event.getParam('endDate');
        let isPercent = event.getParam('isPercent');
        let wrappers = component.get('v.chosenProductWrappers');

        for (let i = 0; i < selectedWrappers.length; i++) {
            selectedWrappers[i].discount = discount;
            selectedWrappers[i].isPercent = isPercent;
            selectedWrappers[i].editBtnClicked = false;
        }

        component.set('v.showNewRecordModal', true);
        component.set('v.discountStartDate', startDate);
        component.set('v.discountEndDate', endDate);

    },

    fireUpdatePbListEvent: function () {
        let eventt = $A.get('e.c:AS_DiscountManager_UpdatePbList_Event');
        eventt.fire();
    },

    handleRowAction: function (component, event) {
        let action = event.getParam('action');
        let row = event.getParam('row');

        switch (action.name) {
            case 'edit':
                alert('Edit: ' + JSON.stringify(row));
                break;
            case 'delete':
                alert('Delete: ' + JSON.stringify(row));
                break;
            case 'debug':
                this.debugSelectedRows(component);
                break;
        }
    },

    debugSelectedRows: function (component) {
        let lines = [];
        lines = component.find('linesTable').getSelectedRows();
        console.log(JSON.stringify(lines));
    },

    selectAllBtnClicked: function (component, event) {
        let selectAllBtn = component.find('table-selectAllBtn');
        let selectAllBtnIsClicked = $A.util.hasClass(selectAllBtn, "selectAllRow-btnSelected");

        if (selectAllBtnIsClicked) {
            $A.util.removeClass(selectAllBtn, 'selectAllRow-btnSelected');
            this.deselectAllButtons(component, event);
        } else {
            $A.util.toggleClass(selectAllBtn, 'selectAllRow-btnSelected');
            this.selectAllButtons(component, event);
        }
        console.log('SelectAll btn pressed: ');
        console.log(component.get('v.chosenProductWrappers'));
    },

    selectAllButtons: function (component, event) {
        let wrappersList = component.get('v.productWrappers');
        let chosenProductWrappers = component.get('v.chosenProductWrappers');

        for (let i = 0; i < wrappersList.length; i++) {
            let buttonAuraId = 'table-selectBtn' + i;
            let buttonSelect = document.getElementById(buttonAuraId);
            buttonSelect.classList.add('selectAllRow-btnSelected');
            chosenProductWrappers.push(wrappersList[i]);
        }

        component.set('v.chosenProductWrappers', chosenProductWrappers);
    },

    deselectAllButtons: function (component, event) {
        let wrappersList = component.get('v.productWrappers');
        let chosenProductWrappers = component.get('v.chosenProductWrappers');

        for (let i = 0; i < wrappersList.length; i++) {
            let buttonAuraId = 'table-selectBtn' + i;
            let buttonSelect = document.getElementById(buttonAuraId);
            buttonSelect.classList.remove('selectAllRow-btnSelected');

            for (let j = 0; j < chosenProductWrappers.length; j++) {
                if (chosenProductWrappers[j].productId === wrappersList[i].productId) {
                    chosenProductWrappers.splice(j, 1);
                }
            }
        }
        component.set('v.chosenProductWrappers', chosenProductWrappers);

    },

    tableRowClicked: function (component, event) {
        let wrappersList = component.get('v.productWrappers');
        let chosenProductWrappers = component.get('v.chosenProductWrappers');
        let index = event.currentTarget.dataset.index;
        let wrapper = wrappersList[index];
        let buttonAuraId = 'table-selectBtn' + index;
        let buttonSelect = document.getElementById(buttonAuraId);
        let isInList;
        for (let i = 0; i < chosenProductWrappers.length; i++) {
            if (chosenProductWrappers[i].productId === wrapper.productId) {
                isInList = true;
                chosenProductWrappers.splice(i, 1);
                buttonSelect.classList.remove('selectAllRow-btnSelected');
                break;
            }
        }
        if (!isInList) {
            chosenProductWrappers.push(wrapper);
            buttonSelect.classList.add('selectAllRow-btnSelected');

        }
        component.set('v.chosenProductWrappers', chosenProductWrappers);
        console.log('Table btn pressed: ');
        console.log(chosenProductWrappers);
    },


    colorSelectedRows: function (component, event) {
        let wrappersList = component.get('v.productWrappers');
        let chosenProductWrappers = component.get('v.chosenProductWrappers');

        for (let i = 0; i < chosenProductWrappers.length; i++) {
            for (let j = 0; j < wrappersList.length; j++) {
                if (wrappersList[j].productId === chosenProductWrappers[i].productId) {
                    console.log('wchodzi do ifa z podwójnej iteracji');
                    let buttonAuraId = 'table-selectBtn' + j;
                    let buttonSelect = document.getElementById(buttonAuraId);
                    buttonSelect.classList.add('selectAllRow-btnSelected');
                }
            }
        }
    },

    clickEditBtn: function (component, event) {
        component.set('v.editBtnClicked', true);
        this.modalTableRowClicked(component,event,true);
    },

    clickSaveBtn: function (component, event) {
        component.set('v.editBtnClicked', false);
        this.modalTableRowClicked(component,event,false);
    },

    modalTableRowClicked: function (component, event, editBtnClicked) {
        console.log('Wchodzi do modalTable');
        let chosenProductWrappers = component.get('v.chosenProductWrappers');
        console.log('chosenProductWrappers ' + chosenProductWrappers);
        let index = event.currentTarget.dataset.index;
        console.log('index ' + index);
        let wrapper = chosenProductWrappers[index];
        console.log('Wrapper before: ' + wrapper);
        wrapper.editBtnClicked = editBtnClicked;
        console.log('Wrapper after: ' + wrapper);
        component.set('v.chosenProductWrappers', chosenProductWrappers);

    },


    modalTableTypeBtnClicked: function (component, event, isPercentBtn) {
        let chosenProductWrappers = component.get('v.chosenProductWrappers');
        console.log('chosenProductWrappers ' + chosenProductWrappers);
        let index = event.currentTarget.dataset.index;
        let wrapper = chosenProductWrappers[index];

        if(isPercentBtn){
            wrapper.isPercent = true;
        }else {
            wrapper.isPercent = false;
        }

        console.log('Wrapper after: ' + wrapper);
        component.set('v.chosenProductWrappers', chosenProductWrappers);

    },

    clickPercentButton: function (component, event) {
        this.modalTableTypeBtnClicked(component,event,true);
    },

    clickCurrencyButton: function (component, event) {
        this.modalTableTypeBtnClicked(component,event,false);
    }



})