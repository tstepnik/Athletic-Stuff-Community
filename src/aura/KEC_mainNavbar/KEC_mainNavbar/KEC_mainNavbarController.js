/**
 * Created by BRITENET on 16.01.2020.
 */
({
    toHome: function(component, event, helper){
        helper.redirectToSite(component, "/");
    },
    toSearch: function(component, event, helper){
        helper.redirectToSite(component, "/searchproducts");
    },
    toOrders: function(component, event, helper){
        helper.redirectToSite(component, "/customerorders");
    },
    toFavorites: function(component, event, helper){
        helper.redirectToSite(component, "/favoriteslist");
    },
    toBasket: function(component, event, helper){
        helper.redirectToSite(component, "/basket");
    },
    toLoyaltyProgram: function(component, event, helper){
        helper.redirectToSite(component, "/loyaltyprogram");
    },
    onInit: function(component, event, helper){
        helper.getCartItems(component);
    },
    openPop: function(component, event, helper){
        helper.open(component);
    },
    closePop: function(component, event, helper){
        helper.close(component);
    }
})