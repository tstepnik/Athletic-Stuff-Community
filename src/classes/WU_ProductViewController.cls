public with sharing class WU_ProductViewController {
    @auraEnabled
    public static WU_ProductViewService.ProductViewResponse getProductPictures(String productId){
        System.debug(WU_ProductViewService.getProductPictures(productId));
        return WU_ProductViewService.getProductPictures(productId);
    }
    @AuraEnabled
    public static String setMainPicture(String pictureToSet, String productId){
        return WU_ProductViewService.setMainPicture(pictureToSet, productId);
    }
    @AuraEnabled
    public static void changePublish(String pictureId, String productId){
        WU_ProductViewService.changePublish(pictureId, productId);
    }
}