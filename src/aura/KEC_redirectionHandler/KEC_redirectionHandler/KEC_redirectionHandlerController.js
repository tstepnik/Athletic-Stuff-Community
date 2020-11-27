/**
 * Created by BRITENET on 16.01.2020.
 */
({
    onRedirect: function(component, event, helper){
        let params = event.getParam('arguments');
        if(params){
            let urlAddress = params.urlAddress;
            helper.redirect(urlAddress);
        }
    }
})