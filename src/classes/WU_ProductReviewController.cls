public with sharing class WU_ProductReviewController {
    @AuraEnabled
    public static WU_ProductReviewService.ReviewResponse getFirstPageReviews(String productId) {
        return WU_ProductReviewService.setPreviewsPage(productId, 1);
    }
    @AuraEnabled
    public static WU_ProductReviewService.ReviewResponse getNextPageReviews(String productId, Integer currentPage) {
        return WU_ProductReviewService.setPreviewsPage(productId, currentPage + 1);
    }
    @AuraEnabled
    public static WU_ProductReviewService.ReviewResponse getPreviousPageReviews(String productId, Integer currentPage) {
        return WU_ProductReviewService.setPreviewsPage(productId, currentPage - 1);
    }
}