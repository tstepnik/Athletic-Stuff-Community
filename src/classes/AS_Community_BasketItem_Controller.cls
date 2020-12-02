/**
 * Created by tomas on 02.12.2020.
 */

public with sharing class AS_Community_BasketItem_Controller {

    @auraEnabled
    public static void removeItemFromOrder(String productId){
        Order basketOrder = getBasketOrder();
        List<OrderItem> items = [
                select Id,
                        Product2Id,
                        Product2.Name
                from OrderItem
                where OrderId = :basketOrder.Id
        ];
        System.debug('LIST SIZE: ' + items.size());
        for (OrderItem item : items) {
            System.debug('/////////////////');
            System.debug('item id: ' + item.Product2Id);
            System.debug('product id: ' + productId);
            System.debug('/////////////////');
            if (item.Product2Id.equals(productId)) {
                System.debug('WCHODZI DO IFA!');
                delete item;
            }
        }
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

}