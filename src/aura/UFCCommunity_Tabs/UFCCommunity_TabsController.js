
({
    redirect: function(component, event, helper){
        let eUrl= $A.get("e.force:navigateToURL");
        eUrl.setParams({
            "url": "/orders"
        });
        eUrl.fire();
    }

})