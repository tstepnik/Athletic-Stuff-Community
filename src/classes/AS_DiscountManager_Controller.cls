/**
 * Created by tomas on 09.12.2020.
 */

public with sharing class AS_DiscountManager_Controller {

    @auraenabled
    public static List<AS_PriceBook_Service.PriceBookWrapper> getPriceBookWrappers() {
        return AS_PriceBook_Service.getPriceBookWrappers();
    }


    @auraenabled
    public static List<AS_PriceBook_Service.PbEntryWrapper>getPricebookDetails(String pricebookId) {
        return AS_PriceBook_Service.getPricebookDetails(pricebookId);
    }

    @AuraEnabled
    public static List<AS_Product_Service.ProductInfoWrapper> getNextPageOffset(String inpTxt, Integer offset) {

        return AS_Product_Service.productInfoWrappers(inpTxt, offset);
    }

    @AuraEnabled
    public static Integer countProducts(String inpTxt) {
        return AS_Product_Service.countProducts(inpTxt);
    }

    @AuraEnabled
    public static AS_Product_Service.SearchProductsWrapper getSearchProductsWrapper(String inpTxt) {
        return AS_Product_Service.getSearchProductsWrapper(inpTxt, 0);
    }

//    @AuraEnabled
//    public static void createDiscountApex(List<AS_Product_Service.ProductInfoWrapper> wrappers,String discount, String startDate, String endDate, Boolean isPercent) {
//        System.debug('APEX CONTROLLER METHOD:');
//        System.debug(wrappers);
//        System.debug(discount);
//        System.debug(startDate);
//        System.debug(endDate);
//        System.debug(isPercent);
//    }


    @AuraEnabled
    public static void createDiscountApex(String discount, Boolean isPercent, String startDate, String endDate, List<AS_Product_Service.ProductInfoWrapper> wrappers) {
        AS_PriceBook_Service.createDiscountPricebook(discount, isPercent, startDate, endDate, wrappers);


    }


}