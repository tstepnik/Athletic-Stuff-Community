public with sharing class WU_ProductViewService {
    public static ProductViewResponse getProductPictures(String productId) {
        Double productPrice, ratingAvg;
        String mainPictureId;

        try {
            System.debug('wchodzi');
            List<ProductSettings> imageLinks = wrapContentDocumentLinks(getContentDocumentLinks(productId));
            System.debug('imageLinks');
            System.debug(imageLinks);
            List<PricebookEntry> productInfo = getProductInfo(productId);
            if (!productInfo.isEmpty()) {
                productPrice = productInfo[0].UnitPrice;
                mainPictureId = productInfo[0].Product2.Main_picture__c;
            }
            System.debug('productInfo');
            System.debug(productInfo);
            ratingAvg = countAvg(getReviewsRating(productId));
            return new ProductViewResponse(imageLinks, productPrice, ratingAvg, mainPictureId);
        } catch (Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }

    public static String setMainPicture(String pictureToSet, String productId) {
        try {
            Product2 productToUpdate = new Product2(Id = productId, Main_picture__c = pictureToSet);
            System.debug(productToUpdate);
            update productToUpdate;
            return pictureToSet;
        } catch (Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }

    public static void changePublish(String pictureId, String productId) {
        try {
            ContentDocumentLink fileToChange = getContentDocumentLinks(pictureId, productId);
            if (fileToChange.Visibility == 'AllUsers') {
                fileToChange.Visibility = 'InternalUsers';
            } else {
                fileToChange.Visibility = 'AllUsers';
            }
            update fileToChange;
        } catch (Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }

    private static List<ContentDocumentLink> getContentDocumentLinks(String productId) {
        return [
                SELECT
                        ContentDocument.LatestPublishedVersionId,
                        Visibility,
                        ContentDocument.Title
                FROM ContentDocumentLink
                WHERE LinkedEntityId = :productId
                LIMIT 10
        ];
    }
    private static ContentDocumentLink getContentDocumentLinks(String pictureId, String productId) {
        return [
                SELECT
                        ContentDocument.LatestPublishedVersionId,
                        Visibility,
                        ContentDocument.Title
                FROM ContentDocumentLink
                WHERE LinkedEntityId = :productId
                AND ContentDocument.LatestPublishedVersionId = :pictureId
                LIMIT 1
        ];
    }
    private static List<PricebookEntry> getProductInfo(String productId) {
        return [
                SELECT
                        Id, UnitPrice, Product2.Main_picture__c
                FROM PricebookEntry
                WHERE Product2Id = :productId AND IsActive = true
                LIMIT 1
        ];
    }
    private static List<Product_Review__c> getReviewsRating(String productId) {
        return [
                SELECT
                        Rating__c
                FROM Product_Review__c
                WHERE Product__c = :productId
        ];
    }
    private static List<ProductSettings> wrapContentDocumentLinks(List<ContentDocumentLink> contentDocumentLinks) {
        List<ProductSettings> documentContentWrappers = new List<ProductSettings>();
        for (ContentDocumentLink contentDocumentLink : contentDocumentLinks) {
            documentContentWrappers.add(new ProductSettings(contentDocumentLink));
        }
        return documentContentWrappers;
    }
    private static Double countAvg(List<Product_Review__c> reviews) {
        if (reviews.isEmpty()) {
            return 0;
        }
        Decimal sum = 0;
        for (Product_Review__c review : reviews) {
            sum += review.Rating__c;
        }
        sum = sum / (Decimal) reviews.size();
        return sum.setScale(2);
    }

    public class ProductSettings {
        @AuraEnabled
        public String name { set; get; }
        @AuraEnabled
        public String pictureId { set; get; }
        @AuraEnabled
        public String visibility { set; get; }
        public ProductSettings(String name, String pictureId, String visibility) {
            this.name = name;
            this.pictureId = pictureId;
            this.visibility = visibility;
        }
        public ProductSettings(ContentDocumentLink pictureData) {
            this.name = pictureData.ContentDocument.Title;
            this.pictureId = pictureData.ContentDocument.LatestPublishedVersionId;
            this.visibility = pictureData.Visibility;
        }
    }

    public class ProductViewResponse {
        @AuraEnabled
        public List<ProductSettings> pictures { set; get; }
        @AuraEnabled
        public Double productPrice { set; get; }
        @AuraEnabled
        public Double rating { set; get; }
        @AuraEnabled
        public String mainPictureId { set; get; }
        ProductViewResponse(List<ProductSettings> pictures, Double productPrice, Double rating, String mainPictureId) {
            this.pictures = pictures;
            this.productPrice = productPrice;
            this.rating = rating;
            this.mainPictureId = mainPictureId;
        }
    }
}