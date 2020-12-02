public with sharing class UFCCommunity_Controller {
    @AuraEnabled
    public static String getUserId() {
        return UserInfo.getUserId();
//        Id userId = UserInfo.getUserId();
//        return [SELECT IsActive FROM User WHERE Id = :userId].IsActive;
    }

    @AuraEnabled
    public static String getContactId() {
        Id userId = UserInfo.getUserId();
        User myUser = [SELECT ContactId FROM User WHERE Id = :userId limit 1];
//        return myUser.ContactId;//todo for testing
        return '0037R00002fjrmsQAA';
    }

    @AuraEnabled
    public static List<OrderItem> getBasketElements() {
        Id contactId = getContactId();
        Order basketOrder = getBasketOrder();
        List<OrderItem> basketItems = [select Product2.Name, Product2.Description, Quantity, ListPrice from OrderItem where OrderId = :basketOrder.Id];
        return basketItems;
    }

    @AuraEnabled
    public static Order getBasketOrder() {
        Id contactId = getContactId();
        Order basketOrder;
        try{//todo still testing
            basketOrder = [select Id, Status from order where BillToContactId = :contactId and Status ='Draft' order by CreatedDate desc limit 1];
        }catch (QueryException e){
            basketOrder = createNewOrder();
        }
        return basketOrder;
    }

    @AuraEnabled
    public static void removeBasketElement (String sObjectId) {
        OrderItem myOrderItem = new OrderItem(Id = sObjectId);
        delete myOrderItem;
    }

    @auraEnabled
    public static List<UFCCommunity_ProductViewService.documentContentWrapper> getProductPictures(String productId){
        return UFCCommunity_ProductViewService.getProductPictures(productId);
    }

    @auraEnabled
    public static void addProductToBasket (String productId, Integer quantity){
        Id contactId = getContactId();
        Order basketOrder = getBasketOrder();
        PricebookEntry myPricebookEntry = [select id, UnitPrice from PricebookEntry where Product2Id = :productId and Pricebook2.Name = 'Standard'];
        OrderItem myOrderItem = new OrderItem(Product2Id = productId, OrderId = basketOrder.Id, Quantity = quantity, PricebookEntryId = myPricebookEntry.Id, UnitPrice = myPricebookEntry.UnitPrice);
        upsert myOrderItem;
    }

    @auraEnabled
    public static void changeProductQuantity (String orderProductId, Integer quantity){
        OrderItem myOrderItem = [select quantity from OrderItem where id = :orderProductId];
        myOrderItem.Quantity = quantity;
        upsert myOrderItem;
    }

    @auraEnabled
    public static void completeExistingOrder(){//todo still testing
        Order oldOrder = getBasketOrder();
        oldOrder.Status = 'Activated';
        upsert oldOrder;
        Order newOrder = createNewOrder();
    }

    @auraEnabled
    public static Order createNewOrder (){//todo still testing
        Id contactId = getContactId();
        Contract myContract = [select id, StartDate from Contract where id = '8007R0000070AS7QAM'];
        Order newOrder = new Order(BillToContactId = contactId, ContractId = myContract.Id, Status = 'Draft', AccountId = '0017R00002CqVWOQA3', EffectiveDate = myContract.StartDate, Pricebook2Id = getStandardPricebook().Id);
        upsert newOrder;
        return newOrder;
    }

    @auraEnabled
    public static List<Order> fetchActivatedOrders (){//todo still testing
        Id contactId = getContactId();
        List<Order> activatedOrders = [
                select id, TotalAmount, (Select id, Product2.Name from OrderItems)
                from Order
                where BillToContactId = :contactId and status = 'Activated'
                order by CreatedDate desc
        ];
        return activatedOrders;
    }

    @auraEnabled
    public static pricebook2 getStandardPricebook() {//todo still testing
        return [select id from pricebook2 where name = 'Standard'];
    }
}