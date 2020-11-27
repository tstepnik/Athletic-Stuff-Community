/**
 * Created by tomas on 25.11.2020.
 */
({

    redirect: function(component, event, helper){
        let p = component.get("v.product");
        let eUrl= $A.get("e.force:navigateToURL");
        eUrl.setParams({
            "url": "/cart"
        });
        eUrl.fire();
    }
})