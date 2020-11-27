/**
 * Created by tomas on 23.11.2020.
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