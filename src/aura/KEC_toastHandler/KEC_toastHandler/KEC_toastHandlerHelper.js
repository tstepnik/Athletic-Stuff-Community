/**
 * Created by BRITENET on 15.01.2020.
 */
({
    onFire: function(title, type, message){
        let toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
             "title": title,
             "type": type,
             "message": message
        });
        toastEvent.fire();
    }
})