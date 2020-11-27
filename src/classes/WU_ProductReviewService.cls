public with sharing class WU_ProductReviewService {
    private static List<ProductReviewsWrapper> wrapReviews(List<Product_Review__c> productReviews) {
        List<ProductReviewsWrapper> reviewsWrappers = new List<ProductReviewsWrapper>();
        for (Product_Review__c review : productReviews) {
            reviewsWrappers.add(new ProductReviewsWrapper(review));
        }
        return reviewsWrappers;
    }
    private static List<Product_Review__c> queryProductReviews(String productId, Integer offsetNumber, Integer size) {
        return [
                SELECT Name,
                        Comment__c,
                        CreatedBy.Name,
                        CreatedBy.SmallPhotoUrl,
                        CreatedBy.CompanyName,
                        CreatedBy.Id,
                        Rating__c,
                        LastModifiedDate
                FROM Product_Review__c
                WHERE Product__c = :productId
                ORDER BY LastModifiedDate DESC
                LIMIT :size
                OFFSET :offsetNumber
        ];
    }

    public static ReviewResponse setPreviewsPage(String productId, Integer currentPage) { // 0 w offsecie
        ReviewResponse response = new ReviewResponse();
        Integer reviewsNumber, pageSize, offsetNumber;
        try {
            reviewsNumber = countProductReview(productId);
            pageSize = getNumberOfReviewToShow();
            offsetNumber = currentPage * pageSize - pageSize;
            if (offsetNumber <= 0) {
                offsetNumber = 0;
            }
        }catch (Exception ex){
            response.error = ex.getMessage();
            return response;
        }
        if (reviewsNumber <= 0){
            response.error = 'We didn\'t find any comments';
            return response;
        }
        if (offsetNumber < reviewsNumber) {
            response.reviews = wrapReviews(queryProductReviews(productId, offsetNumber, pageSize));
        }else{
            response.error = 'There was some issues, please refresh page';
            return response;
        }
        if (offsetNumber + pageSize < reviewsNumber) {
            response.nextPage = currentPage + 1;
        }
        if (offsetNumber > 0) {
            response.previousPage = currentPage - 1;
        }
        response.currentPage = currentPage;
        response.allPages = reviewsNumber/5 + 1;
        return response;
    }
    private static Integer getNumberOfReviewToShow(){
        WU_Community_Settings__c newUserCredentials = WU_Community_Settings__c.getInstance('Main Settings');
        return (Integer)newUserCredentials.Number_Of_Review_To_Show__c;
    }
    private static Integer countProductReview(String productId){
        return [
                SELECT count()
                FROM Product_Review__c
                WHERE Product__c = :productId
        ];
    }

    public class ReviewResponse {
        @AuraEnabled
        public Integer currentPage { set; get; }
        @AuraEnabled
        public Integer nextPage { set; get; }
        @AuraEnabled
        public Integer previousPage { set; get; }
        @AuraEnabled
        public Integer allPages { set; get; }
        @AuraEnabled
        public List<ProductReviewsWrapper> reviews { set; get; }
        @AuraEnabled
        public String error { set; get; }

        public ReviewResponse(List<ProductReviewsWrapper> reviews, Integer currentPage, Integer nextPage, Integer previousPage, String error) {
            this.reviews = reviews;
            this.currentPage = currentPage;
            this.nextPage = nextPage;
            this.previousPage = previousPage;
            this.error = error;
        }
        public ReviewResponse() {
            this.reviews = new List<ProductReviewsWrapper>();
            this.currentPage = null;
            this.nextPage = null;
            this.previousPage = null;
            this.error = ' ';
        }

    }

    public class ProductReviewsWrapper {
        @AuraEnabled
        public String name { set; get; }
        @AuraEnabled
        public String comment { set; get; }
        @AuraEnabled
        public String createdByName { set; get; }
        @AuraEnabled
        public String createdBySmallPhotoUrl { set; get; }
        @AuraEnabled
        public String createdByCompanyName { set; get; }
        @AuraEnabled
        public String createdById { set; get; }
        @AuraEnabled
        public Decimal rating { set; get; }
        @AuraEnabled
        public String  commentDate { set; get; }
        public ProductReviewsWrapper(String name, String comment, String createdBySmallPhotoUrl,
                String createdByName, String createdByCompanyName, String createdById, Decimal rating, Datetime commentDate) {
            this.name = name;
            this.comment = comment;
            this.createdByName = createdByName;
            this.createdBySmallPhotoUrl = createdBySmallPhotoUrl;
            this.createdByCompanyName = createdByCompanyName;
            this.createdById = createdById;
            this.rating = rating;
            this.commentDate = String.valueOf(commentDate);
        }
        public ProductReviewsWrapper(Product_Review__c review) {
            this.name = review.Name;
            this.comment = review.Comment__c;
            this.createdByName = review.CreatedBy.Name;
            this.createdBySmallPhotoUrl = review.CreatedBy.SmallPhotoUrl;
            this.createdByCompanyName = review.CreatedBy.CompanyName;
            this.createdById = review.CreatedBy.Id;
            this.rating = review.Rating__c;
            this.commentDate = String.valueOf(review.LastModifiedDate);
        }
    }
}