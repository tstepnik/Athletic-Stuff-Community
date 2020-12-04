/**
 * Created by tomas on 04.12.2020.
 */

public with sharing class AS_Community_OrderController {


    @auraEnabled
    public static List<AS_Order_Service.OrderWrapper> getOrderWrappers(){
        System.debug('WCHODZI DO ORDER CONTROLLER');
        System.debug(AS_Order_Service.getOrderWrappers());
        return AS_Order_Service.getOrderWrappers();
    }
}