({
    handleEvent: function(component, event) {
        let accountWrappers = event.getParam('param');
        component.set('v.accountWrappers', accountWrappers);
    },
    handleDeleteEvent: function(component, event) {

        let recordId = event.getParam('recordId');
        let oldData = component.get('v.accountWrappers');
        let newData = [];
        oldData.forEach((element) => {
            if (element.recordId != recordId) {
                newData.push(element);
            }
        });
        component.set('v.accountWrappers', newData);

    },
    tableRowClicked: function(component, event) {
        let account = event.currentTarget.dataset.id;
        let wrappersList = component.get('v.accountWrappers');
        let index = event.currentTarget.dataset.index;
        let acct = wrappersList[index];
        let rows = component.find("row");
        rows.forEach((element) => {
            $A.util.removeClass(element, "row-highlighted");
        });
        $A.util.addClass(rows[index], "row-highlighted");
        let eventt = $A.get('e.c:AS_DivisionSearch_SelectAccountEvent');
        eventt.setParams({
            "accountWrapper": acct
        });
        eventt.fire();
    },
});