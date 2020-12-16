({
    doInit: function (component, event) {
        const columns = [
            {label: 'Product Name', fieldName: 'productName'},
            {label: 'Price', fieldName: 'price'}
        ];
        component.set("v.columns", columns);
    },

    searchOperations: function (component,event) {
        let inputText = component.get('v.inputText');
        const action = component.get('c.getSearchProductsWrapper');
        action.setParams({inpTxt: inputText});
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let productsBoundle = response.getReturnValue();
                let data = productsBoundle.wrappers;
                component.set('v.productInfoBunch', productsBoundle);
                component.set("v.allData", data);
                component.set("v.totalRecords", data.length);
                component.set('v.productWrappers', data.slice(0,pageSize));
            } else {
                let error = response.getError();
            }
        });
        $A.enqueueAction(action);
        let pageSize = component.get('v.amountRecordPerPage');
        component.set("v.endPage", pageSize - 1);
        let state = {
            selectedRows: []
        };
        component.set("v.state", state);
    },

    saveToState: function (component, event) {
        let selectedRows = component.get("v.selectedRows");
        let state = component.get("v.state");
        selectedRows.forEach(record => {
            state.selectedRows.push(record)
        });

        const uniqueIds = state.selectedRows.reduce((unique, item) =>
            unique.includes(item) ? unique : [...unique, item], []);
        state.selectedRows = uniqueIds;
        component.set('v.uniqueIds',uniqueIds);

    },

    prepareListForDiscount: function(component,event){
        let allData = component.get('v.allData');
        let allDataMap = new Map();
        for(let i = 0; i < allData.length; i++){
            let wrapper = allData[i];
            allDataMap.set(wrapper.productId,wrapper);
        }

        let uniqueIds = component.get('v.uniqueIds');
        let choosesWrappers = new Array();
        for(let i = 0; i < uniqueIds.length; i++){
            if(allDataMap.has(uniqueIds[i])){
                choosesWrappers.push(allDataMap.get(uniqueIds[i]));
            }
        }
        component.set('v.chosenProductWrappers',choosesWrappers);
        return choosesWrappers;
    },

    rerenderFromState: function (component, event) {
        let newState = component.get("v.state");
        component.set('v.selectedRows', newState.selectedRows);
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
        let wrappers = this.prepareListForDiscount(component,event);

        console.log('createCustomPromotion: ');
        for(let i = 0; i < wrappers.length; i++){
            let wrapper = wrappers[i];
           console.log(wrapper);
        }


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
        this.saveToState(component,event);
        let selectedWrappers = this.prepareListForDiscount(component,event);

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

    clickEditBtn: function (component, event) {
        component.set('v.editBtnClicked', true);
        this.modalTableRowClicked(component, event, true);
    },

    clickSaveBtn: function (component, event) {
        component.set('v.editBtnClicked', false);
        this.modalTableRowClicked(component, event, false);
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

        if (isPercentBtn) {
            wrapper.isPercent = true;
        } else {
            wrapper.isPercent = false;
        }

        console.log('Wrapper after: ' + wrapper);
        component.set('v.chosenProductWrappers', chosenProductWrappers);

    },

    clickPercentButton: function (component, event) {
        this.modalTableTypeBtnClicked(component, event, true);
    },

    clickCurrencyButton: function (component, event) {
        this.modalTableTypeBtnClicked(component, event, false);
    }

})