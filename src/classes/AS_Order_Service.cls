public with sharing class AS_Order_Service {

    public static String getContactId() {

        return AS_User_Service.getLoggedUserContactId();
    }

    public static List<Order> fetchActivatedOrders() {
        Id contactId = getContactId();
        List<Order> activatedOrders = [
                select id, TotalAmount,OrderNumber,EffectiveDate, (Select id, Product2.Name, ListPrice, Quantity, Description from OrderItems)
                from Order
                where BillToContactId = :contactId and status = 'Activated'
                order by CreatedDate desc
        ];
        return activatedOrders;
    }

    public static List<OrderWrapper> getOrderWrappers() {
        List<OrderWrapper> wrappers = new List<OrderWrapper>();

        List<Order> orders = fetchActivatedOrders();

        for (Order order : orders) {
            wrappers.add(new OrderWrapper(order));
        }
        return wrappers;
    }

    public class OrderWrapper {

        @auraEnabled
        public String orderId { get; set; }

        @auraEnabled
        public String orderNumber { get; set; }

        @auraEnabled
        public String createdDate { get; set; }

        @auraEnabled
        public String sum { get; set; }

        @auraEnabled
        public Decimal numberOfProducts { get; set; }

        @auraEnabled
        public Decimal numberOfUnits { get; set; }

        public OrderWrapper(Order order) {
            this.orderId = order.Id;
            this.orderNumber = order.OrderNumber;
            this.createdDate = String.valueOf(order.EffectiveDate);
            this.sum = String.valueOf(order.TotalAmount);
            this.numberOfProducts = order.OrderItems.size();
            this.numberOfUnits = countNumberOfUnits(order.OrderItems);
        }

        private Decimal countNumberOfUnits(List<OrderItem> items) {
            Decimal sum = 0;

            for (OrderItem orderItem : items) {
                sum += orderItem.Quantity;
            }
            return sum;
        }
    }

    public static void removeItemFromOrder(String productId) {
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
                delete item;
            }
        }
    }

    public static List<OrderItem> getOrderItems() {
        List<OrderItem> orderItems = new List<OrderItem>();
        orderItems = getBasketElements();
        return orderItems;
    }

//    public static List<OrderItem> getOrderItemWrappers(){
//
//    }

//    public static Decimal countOrderAmount() {
//        Decimal sum = 0;
//
//        Order basketOrder = getBasketOrder();
//
//        List<OrderItem> items = [
//                select Id,
//                        ListPrice,
//                        Quantity
//                from OrderItem
//                where OrderId = :basketOrder.Id
//        ];
//
//        if (items.isEmpty() || items == null) {
//            return 0;
//        }
//
//        for (OrderItem item : items) {
//            sum += (item.Quantity * item.ListPrice);
//        }
//
//        return sum.setScale(2, RoundingMode.HALF_UP);
//    }

    public static Decimal countOrderAmount() {
        Decimal sum = 0;

        List<OrderItemWrapper> orderItemWrappers = getBasketItemWrappers();


        if (orderItemWrappers.isEmpty() || orderItemWrappers == null) {
            return 0;
        }

        for (OrderItemWrapper item : orderItemWrappers) {
            sum += (item.quantity * item.price);
        }

        return sum.setScale(2, RoundingMode.HALF_UP);
    }

    public static List<OrderItem> getBasketElements() {
        Id contactId = getContactId();
        Order basketOrder = getBasketOrder();
        List<OrderItem> basketItems = [
                select Product2.Id,Product2.mainPictureId__c,Product2.Family,
                        Product2.Name, Product2.Description, Quantity, ListPrice
                from OrderItem
                where OrderId = :basketOrder.Id
        ];
        return basketItems;
    }

    public static pricebook2 getStandardPricebook() {
        return [select id from pricebook2 where name = 'Standard'];
    }

    public static Order createNewOrder() {
        Id contactId = getContactId();
        Contract myContract = [select id, StartDate from Contract where id = :System.Label.AS_Community_ContractId];
        Order newOrder = new Order(BillToContactId = contactId, ContractId = myContract.Id, Status = 'Draft', AccountId = System.Label.AS_Community_AccountId, EffectiveDate = myContract.StartDate, Pricebook2Id = getStandardPricebook().Id);
        upsert newOrder;
        return newOrder;
    }

    public static Order getBasketOrder() {
        Id contactId = getContactId();
        Order basketOrder;
        try {
            basketOrder = [
                    select Id,
                            Status,
                            OrderNumber
                    from order
                    where BillToContactId = :contactId
                    and Status = 'Draft'
                    order by
                            CreatedDate desc
                    limit 1
            ];
        } catch (QueryException e) {
            basketOrder = createNewOrder();
        }
        return basketOrder;
    }

    public static String addProductToBasket(String productId, String pricebookEntryId, String unitPrice) {
        System.debug('WCHODZI DO addProductToBasket SERVICE');

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
        System.debug('////////////////////////////');
        System.debug('BEFORE ADD PRODUCT TO BASKET');

        if (!alreadyInBasket) {
            PricebookEntry myPricebookEntry = [select id, UnitPrice from PricebookEntry where Product2Id = :productId and Pricebook2.Name = 'Standard'];
            OrderItem myOrderItem = new OrderItem(Product2Id = productId, OrderId = basketOrder.Id, Quantity = 1, PricebookEntryId = myPricebookEntry.Id, UnitPrice = Decimal.valueOf(unitPrice));
            System.debug(myOrderItem);
            upsert myOrderItem;
            return 'Product successfully added to basket. Click basket icon to change product amount.';
        }
        return 'Something wrong, contact Admin';
    }

    public static List<OrderItemWrapper> getOrderItemWrappers(String orderId) {
        List<OrderItem> orderItems = [
                select Product2.Id,Product2.mainPictureId__c,Product2.Family,
                        Product2.Name, Product2.Description, Quantity, ListPrice
                from OrderItem
                where OrderId = :orderId
        ];

        List<OrderItemWrapper> wrappers = new List<OrderItemWrapper>();
        if (orderItems == null || orderItems.isEmpty()) {
            return wrappers;
        }

        for (OrderItem item : orderItems) {
            wrappers.add(new OrderItemWrapper(item));
        }
        return wrappers;
    }

    public static Map<String, OrderItemWrapper> getMapProductNameOrderItemWrapperFromList(List<OrderItemWrapper> wrappers) {
        Map<String, AS_Order_Service.OrderItemWrapper> wrapperMap = new Map<String, AS_Order_Service.OrderItemWrapper>();
        for (AS_Order_Service.OrderItemWrapper w : wrappers) {
            wrapperMap.put(w.productName, w);
        }
        return wrapperMap;
    }


    public static List<OrderItemWrapper> getBasketItemWrappers() {
        List<OrderItemWrapper> wrapperPreparedToBasket = new List<AS_Order_Service.OrderItemWrapper>();
        Order order = getBasketOrder();
        List<OrderItemWrapper> wrappers = getOrderItemWrappers(order.Id);

        Map<String, OrderItemWrapper> wrapperMap = getMapProductNameOrderItemWrapperFromList(wrappers);

        Set<String> ids = getIdsFromOrderItemWrappers(wrappers);
        List<PricebookEntry> pbEntries = getPbEntryListFromProductIds(ids);
        Map<String, List<PricebookEntry>> pbMap = groupPbEntryByName(pbEntries);

        for (String key : pbMap.keySet()) {
            List<PricebookEntry> entries = pbMap.get(key);
            OrderItemWrapper wrapper = returnCheapestOrderItemWrapper(entries);
            OrderItemWrapper wrapperFromMap = wrapperMap.get(wrapper.productName);
            wrapperFromMap.price = wrapper.price;
            wrapperPreparedToBasket.add(wrapperFromMap);
        }
        return wrapperPreparedToBasket;
    }


    public static Map<String, List<PricebookEntry>> groupPbEntryByName(List<PricebookEntry> pbEntries) {
        Map<String, List<PricebookEntry>> pbMap = new Map<String, List<PricebookEntry>>();

        for (PricebookEntry p : pbEntries) {
            String productName = p.Product2.Name;

            if (pbMap.containsKey(productName)) {

                List<PricebookEntry> entries = new List<PricebookEntry>();
                entries = pbMap.get(productName);
                entries.add(p);
                pbMap.put(productName, entries);
            } else {

                List<PricebookEntry> entries = new List<PricebookEntry>();
                entries.add(p);
                pbMap.put(productName, entries);
            }
        }

        return pbMap;

    }


    public static List<PricebookEntry> getPbEntryListFromProductIds(Set<String> ids) {
        return [
                SELECT Id,
                        UnitPrice,
                        StandardPrice__c,
                        Product2Id,
                        Product2.Name,
                        Product2.Family,
                        Product2.Description,
                        Product2.mainPictureId__c
                FROM PricebookEntry
                WHERE IsActive = true
                AND Pricebook2.IsActive = true
                AND Product2Id IN :ids
        ];
    }

    public static Set<String> getIdsFromOrderItemWrappers(List<OrderItemWrapper> wrappers) {
        Set<String> ids = new Set<String>();

        for (OrderItemWrapper w : wrappers) {
            ids.add(w.productId);
        }
        return ids;
    }

    public static OrderItemWrapper returnCheapestOrderItemWrapper(List<PricebookEntry> entries) {

        PricebookEntry pbe = entries[0];
        String productId = pbe.Product2Id;
        String productName = pbe.Product2.Name;
        Decimal price = pbe.UnitPrice;

        for (PricebookEntry p : entries) {
            if (p.UnitPrice < price) {
                price = p.UnitPrice;
                productId = p.Product2Id;
                productName = p.Product2.Name;
            }
        }
        return new OrderItemWrapper(productName, productId, price);
    }

    public static void completeExistingOrder() {

        Order oldOrder = getBasketOrder();
        List<OrderItemWrapper> wrappers = getBasketItemWrappers();

        Pricebook2 pricebook = AS_PriceBook_Service.createPricebookForOrder();
        removeAllItemsFromOrder();
        oldOrder.Pricebook2Id = pricebook.Id;
        upsert oldOrder;
        Map<String, PricebookEntry> pricebookEntryMap = AS_PriceBook_Service.addPricebookEntriesToPricebook(wrappers, pricebook.Id);


        addNewItemsToOrder(wrappers, oldOrder.Id, pricebookEntryMap);
        oldOrder = getBasketOrder();
        oldOrder.Status = 'Activated';
        upsert oldOrder;
        Order newOrder = createNewOrder();
    }

    public static void addNewItemsToOrder(List<OrderItemWrapper> wrappers, String orderId, Map<String, PricebookEntry> pbEntryMap) {
        List<OrderItem> items = new List<OrderItem>();

        for (OrderItemWrapper w : wrappers) {
            PricebookEntry pbEntry = pbEntryMap.get(w.productName);
            items.add(new OrderItem(OrderId = orderId, Quantity = w.quantity, Product2Id = w.productId, PricebookEntryId = pbEntry.Id, UnitPrice = w.price));
        }
        insert items;
    }

    public static void removeAllItemsFromOrder() {
        Order basketOrder = getBasketOrder();
        List<OrderItem> items = [
                select Id,
                        Product2Id,
                        Product2.Name
                from OrderItem
                where OrderId = :basketOrder.Id
        ];
        delete items;
    }


    public class OrderItemWrapper {

        @auraEnabled
        public String productName { get; set; }

        @auraEnabled
        public String orderItemId { get; set; }

        @auraEnabled
        public String productId { get; set; }

        @auraEnabled
        public Decimal quantity { get; set; }

        @auraEnabled
        public Decimal price { get; set; }

        @auraEnabled
        public Decimal totalAmount { get; set; }

        public OrderItemWrapper(OrderItem item) {
            this.orderItemId = item.Id;
            this.productId = item.Product2Id;
            this.productName = item.Product2.Name;
            this.quantity = item.Quantity;
            this.price = item.ListPrice;
            this.totalAmount = (this.quantity * this.price).setScale(2);
        }

        public OrderItemWrapper(String productName, String productId, Decimal price) {
            this.productName = productName;
            this.productId = productId;
            this.price = price;
        }

    }


}