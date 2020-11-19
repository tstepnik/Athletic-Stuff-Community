public with sharing class AS_DivisionSearch_FormController {
    @AuraEnabled
    public static List<AccountWrapper> returnAccounts(String name, String country, String rating, String city, String active) {
     return AS_DivisionSearchService.returnAccounts(name,country,rating,city,active);
    }
}