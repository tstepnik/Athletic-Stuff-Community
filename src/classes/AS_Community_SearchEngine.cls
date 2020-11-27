/**
 * Created by tomas on 23.11.2020.
 */

public with sharing class AS_Community_SearchEngine {

    @AuraEnabled
    public static List<Product2> products() {

        return [SELECT Id,Name FROM Product2 LIMIT 25];
    }

}