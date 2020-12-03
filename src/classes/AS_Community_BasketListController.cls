
public with sharing class AS_Community_BasketListController {

    @auraEnabled
    public static List<OrderItem> getOpportunityProducts() {
        return AS_Service.getOpportunityProducts();
    }

    @AuraEnabled
    public static Decimal countSum() {
        return AS_Service.countSum();
    }

    @AuraEnabled
    public static List<OrderItem> getBasketElements() {
        return AS_Service.getBasketElements();
    }

    @auraEnabled
    public static Order createNewOrder() {
        return AS_Service.createNewOrder();
    }

    public static String getContactId() {

        Id userId = UserInfo.getUserId();
        User loggedUser = [SELECT ContactId FROM User WHERE Id = :userId limit 1];
        return loggedUser.ContactId;
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
            basketOrder = createNewOrder();
        }
        return basketOrder;
    }

}