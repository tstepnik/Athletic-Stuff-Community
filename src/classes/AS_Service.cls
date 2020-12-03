/**
 * Created by tomas on 02.12.2020.
 */

public with sharing class AS_Service {

        public static FirstQueryInfo getFirstQueryInfo(String searchPhrase, Integer queryLimit, Integer offset) {

            List<ProductInfoWrapper> wrappers = productInfoWrappers(searchPhrase, queryLimit, offset);

            Integer numberOfProducts = countProducts(searchPhrase);

            return new FirstQueryInfo(wrappers, numberOfProducts,queryLimit,searchPhrase,offset);
        }

        public static List<ProductInfoWrapper> productInfoWrappers(String phrase, Integer queryLimit, Integer offset) {

            List<PricebookEntry> productsInfo = new List<PricebookEntry>();

            productsInfo = Database.query(pricebookEntryQuery(phrase, queryLimit, offset));

            System.debug(pricebookEntryQuery(phrase, queryLimit, offset));

            return convertToInfoWrappers(productsInfo);

        }

        private static List<ProductInfoWrapper> convertToInfoWrappers(List<PricebookEntry> pbEntries) {

            List<ProductInfoWrapper> wrappers = new List<ProductInfoWrapper>();

            for (PricebookEntry p : pbEntries) {
                ProductInfoWrapper wrapper = new ProductInfoWrapper(p.Product2Id, p.Product2.mainPictureId__c, p.Product2.Name, String.valueOf(p.UnitPrice));
                wrappers.add(wrapper);
            }

            return wrappers;
        }

        private static String pricebookEntryQuery(String phrase, Integer queryLimit, Integer offset) {

            AS_QueryBuilder queryBuilder = new AS_QueryBuilder();

            List<String> providedParameters = new List<String>{
                    'Product2.Name',
                    'Product2.Family'
            };

            List<String> selectedFields = new List<String>{
                    'Id',
                    'UnitPrice',
                    'Product2Id',
                    'Product2.Name',
                    'Product2.Family',
                    'Product2.Description',
                    'Product2.mainPictureId__c'
            };

            queryBuilder.readyQuery_PricebookEntry_standardPB_returnIfFieldsContainPhrase_andIsActive
                    (selectedFields, 'PricebookEntry', phrase, providedParameters, 'OR');
            queryBuilder.addLimit(queryLimit);
            queryBuilder.addOffset(offset);
            System.debug('QUERY:');
            queryBuilder.printQuery();
            return queryBuilder.returnQuery();

        }

        public static Integer countProducts(String phrase) {

            AS_QueryBuilder queryBuilder = new AS_QueryBuilder();

            List<String> providedParameters = new List<String>{
                    'Product2.Name',
                    'Product2.Family'
            };

            List<String> selectedFields = new List<String>{
                    'count()'
            };

            queryBuilder.readyQuery_PricebookEntry_standardPB_returnIfFieldsContainPhrase_andIsActive
                    (selectedFields, 'PricebookEntry', phrase, providedParameters, 'OR');

            String query = queryBuilder.returnQuery();
            return Database.countQuery(query);

        }

        public static List<documentContentWrapper> getProductPictures(String productId) {
            try {
                System.debug(productId);
                List<ContentDocumentLink> contentDocumentLinks = getContentDocumentLinkIds(productId);
                return wrapContentDocumentLinks(contentDocumentLinks);
            } catch (Exception ex) {
                throw new AuraHandledException('Exception: ' + ex.getMessage());
            }
        }

        private static List<ContentDocumentLink> getContentDocumentLinkIds(String productId) {
            return [
                    SELECT ContentDocument.LatestPublishedVersionId
                    FROM ContentDocumentLink
                    WHERE LinkedEntityId = :productId
                    LIMIT 10
            ];
        }

        private static List<DocumentContentWrapper> wrapContentDocumentLinks(List<ContentDocumentLink> contentDocumentLinks) {
            List<DocumentContentWrapper> documentContentWrappers = new List<DocumentContentWrapper>();
            for (ContentDocumentLink contentDocumentLink : contentDocumentLinks) {
                documentContentWrappers.add(new DocumentContentWrapper(contentDocumentLink.ContentDocument.LatestPublishedVersionId));
            }
            return documentContentWrappers;
        }

        public class DocumentContentWrapper {
            @auraEnabled
            public String documentId { set; get; }

            public documentContentWrapper(String documentId) {
                this.documentId = documentId;
            }
        }

        public class ProductInfoWrapper {
            @auraEnabled
            public String productId { get; set; }
            @auraEnabled
            public String mainPictureId { get; set; }
            @auraEnabled
            public String productName { get; set; }
            @auraEnabled
            public String price { get; set; }

            ProductInfoWrapper(String productId, String mainPicId, String productName, String price) {
                this.productId = productId;
                this.mainPictureId = mainPicId;
                this.productName = productName;
                this.price = price;
            }
        }

        public class FirstQueryInfo {
            @auraEnabled
            public List<ProductInfoWrapper> wrappers { get; set; }
            @auraEnabled
            public Integer numberOfProducts { get; set; }

            @auraEnabled
            public Integer queryLimit { get; set; }

            @auraEnabled
            public String queryPhrase { get; set; }

            @auraEnabled
            public Integer offset { get; set; }

            public FirstQueryInfo(List<ProductInfoWrapper> wrappers, Integer numberOfProducts, Integer queryLimit, String queryPhrase, Integer offset) {
                this.wrappers = wrappers;
                this.numberOfProducts = numberOfProducts;
                this.queryLimit = queryLimit;
                this.queryPhrase = queryPhrase;
                this.offset = offset;
            }
        }

        public static String getProductPrice(String productId) {
            Decimal price = [
                    SELECT
                            UnitPrice
                    FROM PricebookEntry
                    WHERE Product2Id = :productId
            ][0].UnitPrice;

            return String.valueOf(price);
        }

    //BASKET

    public static String getContactId() {

        Id userId = UserInfo.getUserId();
        User loggedUser = [SELECT ContactId FROM User WHERE Id = :userId limit 1];

//        return loggedUser.ContactId;

        return '0037R00002do2KGQAY';

    }

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

    public static Order createNewOrder() {//todo still testing
        //'8007R0000070AS7QAM'
        Id contactId = getContactId();
        Contract myContract = [select id, StartDate from Contract where id = :contactId];
        Order newOrder = new Order(BillToContactId = contactId, ContractId = myContract.Id, Status = 'Draft', AccountId = '0017R00002GUT1OQAX', EffectiveDate = myContract.StartDate, Pricebook2Id = getStandardPricebook().Id);
        upsert newOrder;
        return newOrder;
    }

    public static pricebook2 getStandardPricebook() {//todo still testing
        return [select id from pricebook2 where name = 'Standard'];
    }

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


    //BASKET
    }