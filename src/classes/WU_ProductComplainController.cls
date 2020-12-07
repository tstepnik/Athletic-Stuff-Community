public with sharing class WU_ProductComplainController {
    @AuraEnabled
    public static List<WU_ProductComplainService.ComplainWrapper> getUserCases() {
        return WU_ProductComplainService.getUserCases();
    }
}