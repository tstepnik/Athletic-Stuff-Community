/**
 * Created by tomas on 26.11.2020.
 */

public with sharing class AS_Community_BasketListController {

    @auraEnabled
    public static List<OrderItem> getOpportunityProducts() {
        List<OrderItem> orderItems = new List<OrderItem>();
        orderItems = getBasketElements();

        System.debug('ORDER ITEMS:');
        for(OrderItem o : orderItems){
            System.debug(o);
            System.debug(o.Product2);
        }
        return orderItems;
    }






    @AuraEnabled
    public static List<OrderItem> getBasketElements() {
        Id contactId = getContactId();
        Order basketOrder = getBasketOrder();
        System.debug('xwerewrwrwrre');
        List<OrderItem> basketItems = [
                select Product2.Id,Product2.mainPictureId__c,Product2.Family,
                        Product2.Name, Product2.Description, Quantity, ListPrice
                from OrderItem
                where OrderId = :basketOrder.Id
        ];
        System.debug('xwetwerewrew');
        return basketItems;
    }

    @auraEnabled
    public static Order createNewOrder() {//todo still testing
        Id contactId = getContactId();
        Contract myContract = [select id, StartDate from Contract where id = '8007R0000070AS7QAM'];
        Order newOrder = new Order(BillToContactId = contactId, ContractId = myContract.Id, Status = 'Draft', AccountId = '0017R00002CqVWOQA3', EffectiveDate = myContract.StartDate, Pricebook2Id = getStandardPricebook().Id);
        upsert newOrder;
        return newOrder;
    }


    @AuraEnabled
    public static void removeBasketElement(String sObjectId) {
        OrderItem myOrderItem = new OrderItem(Id = sObjectId);
        delete myOrderItem;
    }


    @auraEnabled
    public static pricebook2 getStandardPricebook() {//todo still testing
        return [select id from pricebook2 where name = 'Standard'];
    }


    public static String getContactId() {

        Id userId = UserInfo.getUserId();
        User loggedUser = [SELECT ContactId FROM User WHERE Id = :userId limit 1];

//        return loggedUser.ContactId;

        return '0037R00002do2KGQAY';

    }

    @AuraEnabled
    public static Order getBasketOrder() {
        Id contactId = getContactId();
        Order basketOrder;
        System.debug('x');
        try {//todo still testing
            basketOrder = [
                    select Id,
                            Status
                    from order
                    where BillToContactId = :contactId
                    and Status = 'Draft'
                    order by
                            CreatedDate desc
                    limit 1
            ];
            System.debug('x');
        } catch (QueryException e) {
            System.debug('QUERY EXCEPTION FROM AS_COMMUNITY_BASKETLISTCONTROOLLER LINE 49');
//            basketOrder = createNewOrder();
        }
        return basketOrder;
    }

    @auraEnabled
    public static void addProductToBasket (String productId, Integer quantity){
        Id contactId = getContactId();
        Order basketOrder = getBasketOrder();
        PricebookEntry myPricebookEntry = [select id, UnitPrice from PricebookEntry where Product2Id = :productId and Pricebook2.Name = 'Standard'];
        OrderItem myOrderItem = new OrderItem(Product2Id = productId, OrderId = basketOrder.Id, Quantity = quantity, PricebookEntryId = myPricebookEntry.Id, UnitPrice = myPricebookEntry.UnitPrice);
        upsert myOrderItem;
    }

    @AuraEnabled
    public static Decimal countSum(){
        Decimal sum =  0;

        Order basketOrder = getBasketOrder();

        List<OrderItem> items = [
                select Id,
                        ListPrice,
                        Quantity
                from OrderItem
                where OrderId = :basketOrder.Id
        ];

        if(items.isEmpty() || items == null){
            return 0;
        }

        for(OrderItem item : items){
            sum += (item.Quantity * item.ListPrice);
        }

        return sum.setScale(2,RoundingMode.HALF_UP);
    }

}