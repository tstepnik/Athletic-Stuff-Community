
public with sharing class AS_ProductViewController {


    @auraEnabled
    public static List<AS_Document_Service.documentContentWrapper> getProductPictures(String productId) {
        return AS_Document_Service.getProductPictures(productId);
    }

    @auraEnabled
    public static AS_Product_Service.ProductInfoWrapper getProductInfoWrapper(String productId) {
        System.debug('WCHODZI DO APEXA cheapest price details p');
        return AS_Product_Service.getProductInfoWrapperForDetailsPage(productId);
    }

    @auraEnabled
    public static String getCheapestPrice_apex(String productId) {
        return AS_Product_Service.getCheapestPrice(productId);
    }

    @AuraEnabled
    public static Order getBasketOrder() {
       return AS_Order_Service.getBasketOrder();
    }

    @auraEnabled
    public static String addProductToBasket(String productId, String pricebookEntryId,String unitPrice) {
        System.debug('WCHODZI DO APEX CONTROLLER addProductToBasket');
        System.debug('productId: ' + productId);
        System.debug('pricebookId: ' + pricebookEntryId);
        System.debug('unitPrice: ' + unitPrice);
        return AS_Order_Service.addProductToBasket(productId, pricebookEntryId, unitPrice);
    }
}

