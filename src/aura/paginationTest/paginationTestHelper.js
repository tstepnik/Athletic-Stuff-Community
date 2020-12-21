({
    doInit: function (component, event) {
        const columns = [{
            label: 'Account Name', fieldName: 'Name'
        }, {
            label: 'Account Number', fieldName: 'AccountNumber'
        }, {
            label: 'Billing Address', fieldName: 'BillingAddress'
        }, {
            label: 'Type', fieldName: 'Type'
        }];
        let action = component.get("c.getAccounts");
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === 'SUCCESS') {
                const data = response.getReturnValue();
                component.set("v.allData", data);
                component.set("v.totalRecords", data.length);
                component.set("v.data", data.slice(0, pageSize));
            }
        });
        $A.enqueueAction(action);
        let pageSize = component.get('v.amountRecordPerPage');
        component.set("v.columns", columns);
        component.set("v.endPage", pageSize - 1);
        let state = {
            selectedRows: []
        };
        component.set("v.state", state);
    },


    saveToState: function (component, event) {
        let selectedRows = component.get("v.selectedRows");
        let state = component.get("v.state");
        let size = selectedRows.length;
        selectedRows.forEach(record => {
            state.selectedRows.push(record)
        });
        let stateSet = new Set(state.selectedRows);

        let noSelectedIdsSet = this.notSelectedIds(component);

        let noSelectedIds = Array.from(noSelectedIdsSet);

        noSelectedIds.forEach(id =>{
            if(stateSet.has(id)){
                stateSet.delete(id);
            }
        });

        state.selectedRows = Array.from(stateSet);
        component.set("v.state", state);
    },

    rerenderFromState: function (component, event) {
        let newState = component.get("v.state");
        component.set('v.selectedRows', newState.selectedRows);
    },

    notSelectedIds: function (component) {
        let allIds = this.allIds(component);
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
    },

    allIds: function (component) {
        let allData = component.get('v.data');

        const allIds = allData.map(record => {
            return record.Id;
        });
        return allIds;
    }

});