({
    handleSuccess: function(component, event) {
        component.set('v.showNewRecordModal', false);
        component.find('notifLib').showToast({
            "variant": "success",
            "title": "Account Created",
            "message": "Record ID: " + event.getParam("id")
        });
    }
})