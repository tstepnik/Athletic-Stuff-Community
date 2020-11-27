/**
 * Created by tomas on 26.11.2020.
 */

public with sharing class AS_Community_BasketListController {

    @auraEnabled
    public static List<OpportunityLineItem> getOpportunityProducts() {
        List<OpportunityLineItem> oppProducts = new List<OpportunityLineItem>();

        OpportunityLineItem opp1 = new OpportunityLineItem(Product2Id = '01t7R000007fbU5QAI', UnitPrice=25.5);
        OpportunityLineItem opp2 = new OpportunityLineItem(Product2Id = '01t7R000007fcNFQAY', UnitPrice=52);
        OpportunityLineItem opp3 = new OpportunityLineItem(Product2Id = '01t7R000007fc4eQAA', UnitPrice=18);


        oppProducts.add(opp1);
        oppProducts.add(opp2);
        oppProducts.add(opp3);

        return oppProducts;
    }

}