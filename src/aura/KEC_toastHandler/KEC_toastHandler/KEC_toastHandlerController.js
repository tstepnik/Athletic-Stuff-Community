/**
 * Created by BRITENET on 15.01.2020.
 */
({
    fireToast: function(component, event, helper){
        let params = event.getParam('arguments');
        if(params){
            let title = params.title;
            let type = params.type;
            let message = params.message;
            helper.onFire(title, type, message);
        }
    }
})