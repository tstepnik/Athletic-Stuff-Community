({
    doInit: function (component, event) {
        const columns = [
            {label: 'Product Name', fieldName: 'productName'},
            {label: 'Price', fieldName: 'price'}
        ];
        component.set("v.columns", columns);
    },

    searchOperations: function (component, event) {
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
                component.set('v.productWrappers', data.slice(0, pageSize));
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
            let stateSet = new Set(state.selectedRows);

            let noSelectedIdsSet = this.notSelectedIds(component);
            if (noSelectedIdsSet != null) {
                let noSelectedIds = Array.from(noSelectedIdsSet);

                noSelectedIds.forEach(id => {
                    if (stateSet.has(id)) {
                        stateSet.delete(id);
                    }
                });

                state.selectedRows = Array.from(stateSet);
                component.set("v.state", state);
            }

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


            } else {
                let sendErrorToast = component.find('errorToastMaker');
                sendErrorToast.handleErrors(response.getError());
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
        //todo
        let discount = event.getParam('discount');
        let startDate = event.getParam('startDate');
        let endDate = event.getParam('endDate');
        let isPercent = event.getParam('isPercent');
        let wrappers = this.prepareListForDiscount(component, event);
        const action = component.get('c.createCustomisedDiscountApex');

        for (let i = 0; i < wrappers.length; i++) {
            wrappers[i].discount = discount;
            wrappers[i].isPercent = isPercent;
            wrappers[i].editBtnClicked = false;
        }

        console.log('start date: ' + startDate);
        console.log('end date: ' + endDate);
        console.log('wrappers: ' + wrappers);
        action.setParams({
            startDate: startDate,
            endDate: endDate,
            wrappers: wrappers
        });
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let sendToast = component.find('toastMaker');
                sendToast.sendResultToast('Success', 'Discount successfully created.', 'Success');
                this.fireUpdatePbListEvent();
                component.set('v.productWrappers', null);
                component.set('v.chosenProductWrappers', null);
                component.set('v.allData', null);
                component.set('v.data', null);

            } else {
                let sendErrorToast = component.find('errorToastMaker');
                sendErrorToast.handleErrors(response.getError());
            }
        });
        $A.enqueueAction(action);
    },

    createCustomisedPromotion: function (component, event) {
        //todo
        let startDate = component.get('v.discountStartDate');
        let endDate = component.get('v.discountEndDate');
        let wrappers = this.prepareListForDiscount(component, event);

        const action = component.get('c.createCustomisedDiscountApex');
        action.setParams({
            startDate: startDate,
            endDate: endDate,
            wrappers: wrappers
        });
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let responseMessage = 'Discount successfully created.'
                let sendToast = component.find('toastMaker');
                component.set('v.showNewRecordModal', false);
                sendToast.sendResultToast('Success', responseMessage, 'Success');
                this.fireUpdatePbListEvent();
                component.set('v.productWrappers', null);

            } else {
                let sendErrorToast = component.find('errorToastMaker');
                sendErrorToast.handleErrors(response.getError());

            }
        });
        $A.enqueueAction(action);
    },

    prepareListForDiscount: function (component, event) {
        let allData = component.get('v.allData');
        if (allData != null && Array.isArray(allData) && allData.length > 0) {

            let allDataMap = new Map();
            for (let i = 0; i < allData.length; i++) {
                let wrapper = allData[i];
                allDataMap.set(wrapper.productId, wrapper);
            }

            let uniqueIds = component.get('v.state').selectedRows;
            let choosesWrappers = new Array();
            for (let i = 0; i < uniqueIds.length; i++) {
                if (allDataMap.has(uniqueIds[i])) {
                    choosesWrappers.push(allDataMap.get(uniqueIds[i]));
                }
            }
            component.set('v.chosenProductWrappers', choosesWrappers);
            return choosesWrappers;
        } else {
            component.set('v.chosenProductWrappers', []);
            return new Array();
        }
    },

    handleNewRecordModal: function (component, event) {
        let selectedWrappers = this.prepareListForDiscount(component, event);
        if (selectedWrappers != null && Array.isArray(selectedWrappers) && selectedWrappers.length > 0) {
            let discount = event.getParam('discount');
            let startDate = event.getParam('startDate');
            let endDate = event.getParam('endDate');
            let isPercent = event.getParam('isPercent');

            for (let i = 0; i < selectedWrappers.length; i++) {
                selectedWrappers[i].discount = discount;
                selectedWrappers[i].isPercent = isPercent;
                selectedWrappers[i].editBtnClicked = false;
            }

            component.set('v.showNewRecordModal', true);
            component.set('v.discountStartDate', startDate);
            component.set('v.discountEndDate', endDate);
        } else {
            let sendToast = component.find('toastMaker');
            sendToast.sendResultToast('Error', 'You must choose at least one product', 'Error');
        }
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
        let chosenProductWrappers = component.get('v.chosenProductWrappers');
        let index = event.currentTarget.dataset.index;
        let wrapper = chosenProductWrappers[index];
        wrapper.editBtnClicked = editBtnClicked;
        component.set('v.chosenProductWrappers', chosenProductWrappers);

    },

    modalTableTypeBtnClicked: function (component, event, isPercentBtn) {
        let chosenProductWrappers = component.get('v.chosenProductWrappers');
        let index = event.currentTarget.dataset.index;
        let wrapper = chosenProductWrappers[index];

        if (isPercentBtn) {
            wrapper.isPercent = true;
        } else {
            wrapper.isPercent = false;
        }
        component.set('v.chosenProductWrappers', chosenProductWrappers);

    },

    clickPercentButton: function (component, event) {
        this.modalTableTypeBtnClicked(component, event, true);
    },

    clickCurrencyButton: function (component, event) {
        this.modalTableTypeBtnClicked(component, event, false);
    },

    notSelectedIds: function (component) {
        let allIds = this.allIds(component);
        if (allIds != null && allIds.length > 0) {
            let selectedIds = component.get("v.selectedRows");
            let noSelectedIds = new Set();
            for (let i = 0; i < allIds.length; i++) {
                let contains = false;
                for (let j = 0; j < selectedIds.length; j++) {

                    if (selectedIds[j] === allIds[i]) {
                        contains = true;
                    }
                }
                if (contains === false) {
                    let id = allIds[i];
                    noSelectedIds.add(id);
                }
            }
            return noSelectedIds;
        }
    },

    allIds: function (component) {
        let allData = component.get('v.productWrappers');

        if (allData != null) {
            const allIds = allData.map(record => {
                return record.Id;
            });
            return allIds;
        }

    }
})