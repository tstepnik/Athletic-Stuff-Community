/**
 * Created by tomas on 16.12.2020.
 */

public with sharing class PaginationTest {
    @AuraEnabled
    public static List<Account> getAccounts() {
        return [
                SELECT
                        Id,Name,AccountNumber,BillingAddress,Type
                FROM Account
        ];
    }

    @AuraEnabled
    public static AS_Product_Service.SearchProductsWrapper getSearchProductsWrapper() {
        String inpTxt = '';
        AS_Product_Service.SearchProductsWrapper wrapper = AS_Product_Service.getSearchProductsWrapperWithStandardPrice(inpTxt, 0);
        return AS_Product_Service.getSearchProductsWrapperWithStandardPrice(inpTxt, 0);
    }
}