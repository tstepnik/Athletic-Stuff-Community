/**
 * Created by BRITENET on 16.01.2020.
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