({
    getWrappers: function (component, event, helper) {
        helper.searchOperations(component);
        helper.showPagination(component);
    },

    doInit: function (component, event, helper) {
        helper.hidePagination(component);
        helper.setDatatable(component);
    },

    pressPreviousButton: function (component, event, helper) {
        helper.pressPreviousButton(component, event, helper);
    },
    pressNextButton: function (component, event, helper) {
        helper.pressNextButton(component, event, helper);
    },

    choosePage: function (component, event, helper) {
        helper.choosePage(component, event);
    },

    clickTableMainBtn: function (component, event, helper) {
        helper.clickTableMainBtn(component, event);
    },

    tableRowClicked: function (component, event, helper) {
        helper.tableRowClicked(component, event);
    },

    consoleLog: function (component, event, helper) {
        helper.consoleLog(component, event);
    },

    createPromotion: function (component, event, helper) {
        helper.createPromotion(component, event);
    },

    handleRowAction: function (component, event, helper) {
        helper.handleRowAction(component,event);
    },

    debugSelectedRows: function (component,event,helper) {

        console.log('//////////////');
        console.log('SELECTED ROWS');
        // console.log(component.get('v.selectedRows'));
        console.log('//////////////');
    },

    selectAllBtnClicked: function (component, event, helper) {
        helper.selectAllBtnClicked(component,event);
    }


})