/**
 * Created by tomas on 23.11.2020.
 */
({

    redirect: function(urlAddress){
        let urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": urlAddress
        });
        urlEvent.fire();
    }
})