/**
 * Created by tomas on 09.12.2020.
 */

public with sharing class AS_DiscountManager_Controller {

    @auraenabled
    public static List<AS_PriceBook_Service.PriceBookWrapper> getPriceBookWrappers(){
        return AS_PriceBook_Service.getPriceBookWrappers();
    }

}