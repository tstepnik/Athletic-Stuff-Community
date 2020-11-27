public with sharing class AS_Community_SearchEngineController {

    @AuraEnabled
    public static List<AS_Community_Service.ProductInfoWrapper> searchProducts(String inpTxt) {
       List<AS_Community_Service.ProductInfoWrapper> products = new List<AS_Community_Service.ProductInfoWrapper>();
        Product2 product = new Product2(Name=inpTxt);
       products = AS_Community_Service.productInfoWrappers(product);
       return products;
    }

}