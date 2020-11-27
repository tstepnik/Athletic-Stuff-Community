({
    init: function (component, event, helper) {
        this.getFirstPage(component, event, helper);
    },
    sendResultToast: function (title, message, type) {
        let resultsToast = $A.get("e.force:showToast");
        if (resultsToast) {
            resultsToast.setParams({
                "title": title,
                "message": message,
                "type": type
            });
            resultsToast.fire();
        }
    },
    getFirstPage: function (component, event, helper) {
        let action = component.get('c.getFirstPageReviews');
        action.setParams({
            productId: component.get('v.productId')
        });
        action.setCallback(this, response => {
            this.pageReviewCallBack(response, component);
        });
        $A.enqueueAction(action);
    },
    getPreviousPage: function (component, event, helper) {
        let action = component.get('c.getPreviousPageReviews');
        action.setParams({
            productId: component.get('v.productId'),
            currentPage: component.get('v.currentPage')
        });
        action.setCallback(this, response => {
            this.pageReviewCallBack(response, component);
        });
        $A.enqueueAction(action);

    },
    getNextPage: function (component, event, helper) {
        let action = component.get('c.getNextPageReviews');
        action.setParams({
            productId: component.get('v.productId'),
            currentPage: component.get('v.currentPage')
        });
        action.setCallback(this, response => {
            this.pageReviewCallBack(response, component);
        });
        $A.enqueueAction(action);
    },
    pageReviewCallBack: function (response, component) {
        let state = response.getState();
        if (state == 'SUCCESS') {
            component.set('v.response', response.getReturnValue());
            component.set('v.currentPage', response.getReturnValue().currentPage);
        } else if (state == "INCOMPLETE") {
            console.log('Incomplete');
        } else if (state == "ERROR") {
            console.log(response.getError());
        }
    }
})