public with sharing class AS_Community_SearchEngineController {

    @AuraEnabled
    public static List<Product2> searchProducts(String inpTxt) {
       List<Product2> products = new List<Product2>();
        Product2 product = new Product2(Name=inpTxt);
       products = AS_Community_Service.getProducts(product);
       return products;
    }

}