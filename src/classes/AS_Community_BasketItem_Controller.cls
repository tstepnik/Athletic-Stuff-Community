public with sharing class AS_Community_BasketItem_Controller {

    @auraEnabled
    public static void removeItemFromOrder(String productId) {
        AS_Order_Service.removeItemFromOrder(productId);
    }

    @AuraEnabled
    public static Order getBasketOrder() {
        return AS_Order_Service.getBasketOrder();
    }

//    @AuraEnabled
//    public static void updateOrderItem(OrderItem orderItem) {
//        update orderItem;
//    }

    @AuraEnabled
    public static void updateOrderItem(String orderItemId, String quantity) {
        OrderItem orderItem = new OrderItem(Id = orderItemId, Quantity = Decimal.valueOf(quantity));
        update orderItem;
    }


}