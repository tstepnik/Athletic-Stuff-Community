({
    init: function (component, event, helper) {
        let action = component.get("c.getProductPictures");
        action.setParams({productId: component.get("v.recordId")});
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                component.set('v.response', response.getReturnValue());
                console.log(response.getReturnValue());
            } else if (state === "ERROR") {
                let errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +
                            errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },
    setMainPicture: function (component, event, helper) {
        let action = component.get("c.setMainPicture");
        action.setParams({
            productId: component.get("v.recordId"),
            pictureToSet : event.getSource().get('v.value')
        });
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                component.set('v.response.mainPictureId', response.getReturnValue());
                console.log(response.getReturnValue());
            } else if (state === "ERROR") {
                let errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +
                            errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },
    changePublish : function (component, event, helper) {
        let action = component.get("c.changePublish");
        let pictureId = event.getSource().get('v.value').pictureId;
        action.setParams({
            pictureId : pictureId,
            productId: component.get("v.recordId")
        });
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                console.log('change publish');
                let response = component.get('v.response');
                response.pictures.forEach(element=>{
                    if (element.pictureId == pictureId && element.visibility == 'AllUsers'){
                        element.visibility = 'InternalUsers'
                    }else if (element.pictureId == pictureId && element.visibility == 'InternalUsers') {
                        element.visibility ='AllUsers';
                    }
                });
                component.set('v.response', response);
            } else if (state === "ERROR") {
                let errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +
                            errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);

    }
});