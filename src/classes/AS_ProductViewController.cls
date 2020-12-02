
public with sharing class AS_ProductViewController {


    @auraEnabled
    public static List<AS_Service.documentContentWrapper> getProductPictures(String productId) {
        return AS_Service.getProductPictures(productId);
    }

    @auraEnabled
    public static String getProductPrice_apex(String productId) {
        System.debug('WCHODZ IDO APEX CONTROLLER');
        return AS_Service.getProductPrice(productId);
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
    public static String addProductToBasket(String productId) {
        System.debug('WCHODZI DO METODY addProductToBasket');

        Boolean alreadyInBasket = false;

        Id contactId = getContactId();
        Order basketOrder = getBasketOrder();
        List<OrderItem> items = [
                select Id,
                        Product2Id,
                        Product2.Name
                from OrderItem
                where OrderId = :basketOrder.Id
        ];

        for (OrderItem item : items) {
            if (item.Product2Id.equals(productId)) {
                alreadyInBasket = true;
                return 'Product is already in basket. You can change his amount by click basket icon.';
            }
        }

        if (!alreadyInBasket) {
            PricebookEntry myPricebookEntry = [select id, UnitPrice from PricebookEntry where Product2Id = :productId and Pricebook2.Name = 'Standard'];
            OrderItem myOrderItem = new OrderItem(Product2Id = productId, OrderId = basketOrder.Id, Quantity = 1, PricebookEntryId = myPricebookEntry.Id, UnitPrice = myPricebookEntry.UnitPrice);
            upsert myOrderItem;
            return 'Product successfully added to basket. Click basket icon to change product amount.';
        }
        return 'Something wrong, contact Admin';
    }
}

