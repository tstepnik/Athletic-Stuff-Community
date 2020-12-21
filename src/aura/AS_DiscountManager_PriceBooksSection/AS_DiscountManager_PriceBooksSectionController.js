({

    onInit: function (component, event, helper) {
        helper.doInit(component, event);
    },

    refreshAndDisplayFirstPbInfo: function (component, event, helper) {
        helper.sendFirstPbInfo(component,event);
    },

    tableRowClicked: function (component, event, helper) {
        helper.tableRowClicked(component, event);
    }
})