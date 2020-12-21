({
    doInit: function (component, event, helper) {
        helper.doInit(component, event);
    },

    updateSelectedRow: function (component, event, helper) {
        let selectedRows = event.getParam('selectedRows');
        if (!$A.util.isEmpty(selectedRows)) {
            const selectedIds = selectedRows.map(record => {
                return record.Id;
            });
            component.set("v.selectedRows", selectedIds);
        }
        if (selectedRows.length === 0) {
            component.set("v.selectedRows", []);
        }
        helper.saveToState(component, event);
    },
    next: function (component, event, helper) {
        let start = component.get("v.startPage");
        let total = component.get("v.totalRecords");
        let data = component.get("v.allData");
        let size = component.get("v.amountRecordPerPage");
        let end = start + 2 * size > total ? total - 1 : start + 2 * size;
        component.set("v.productWrappers", data.slice(start + size, end));
        component.set("v.startPage", start + size);
        component.set("v.endPage", end);
        helper.rerenderFromState(component, event);

    },
    previous: function (component, event, helper) {
        let start = component.get("v.startPage");
        let data = component.get("v.allData");
        let size = component.get("v.amountRecordPerPage");
        let end = start - size <= 0 ? 0 : start - size;
        component.set("v.productWrappers", data.slice(end, start));
        component.set("v.startPage", end);
        component.set("v.endPage", start);
        helper.rerenderFromState(component, event)
        this.consoleLog(component,event,helper);

    },

    consoleLog:function (component, event, helper) {
        // let data = component.get("v.uniqueIds");
        //
        // console.log('unique ids: ' + data);
        let data2 = component.get("v.selectedRows");

        for(let i=0; i<data2.length();i++){
        }
    },

    getWrappers: function (component, event, helper) {
        helper.searchOperations(component, event);
        // helper.showPagination(component);
    },



    createPromotion: function (component, event, helper) {
        helper.createPromotion(component, event);
    },

    createCustomisedPromotion: function (component, event, helper) {
        helper.createCustomisedPromotion(component, event);
    },
    handleRowAction: function (component, event, helper) {
        helper.handleRowAction(component, event);
    },

    debugSelectedRows: function (component, event, helper) {

        // console.log(component.get('v.selectedRows'));
    },

    selectAllBtnClicked: function (component, event, helper) {
        helper.selectAllBtnClicked(component, event);
    },

    colorSelectedRows: function (component, event, helper) {
        helper.colorSelectedRows(component, event);
    },

    handleNewRecordModal: function (component, event, helper) {
        helper.handleNewRecordModal(component, event);
    },
    closeModal: function (component, event, helper) {
        component.set('v.showNewRecordModal', false);
    },

    clickEditBtn: function (component, event, helper) {
        helper.clickEditBtn(component, event);

    },

    clickSaveBtn: function (component, event, helper) {
        helper.clickSaveBtn(component, event);

    },

    clickPercentButton: function (component, event, helper) {
        helper.clickPercentButton(component, event);
    },

    clickCurrencyButton: function (component, event, helper) {
        helper.clickCurrencyButton(component, event);
    }

})