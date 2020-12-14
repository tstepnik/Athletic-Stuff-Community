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

    @auraenabled
    public static void activatePricebook(String pricebookId) {
        AS_PriceBook_Service.activatePricebook(pricebookId);
    }

    @auraenabled
    public static void deactivatePricebook(String pricebookId) {
        AS_PriceBook_Service.deactivatePricebook(pricebookId);
    }

    @auraenabled
    public static void deletePricebook(String pricebookId) {
        AS_PriceBook_Service.deletePricebook(pricebookId);
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
        System.debug('WCHODZI DO CONTROLLERA STD');
        return AS_Product_Service.getSearchProductsWrapperWithStandardPrice(inpTxt, 0);
    }

    @AuraEnabled
    public static void createDiscountApex(String discount, Boolean isPercent, String startDate, String endDate, List<AS_Product_Service.ProductInfoWrapper> wrappers) {
        System.debug('WCHODZI DO DISCOUNT CONTROLLER');
        AS_PriceBook_Service.createDiscountPricebook(discount, isPercent, startDate, endDate, wrappers);
    }



}