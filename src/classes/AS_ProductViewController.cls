
public with sharing class AS_ProductViewController {


    @auraEnabled
    public static List<AS_Community_Service.documentContentWrapper> getProductPictures(String productId) {
        return AS_Community_Service.getProductPictures(productId);
    }
}