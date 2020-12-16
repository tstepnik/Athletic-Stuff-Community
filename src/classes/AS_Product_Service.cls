public with sharing class AS_Product_Service {

    public static AS_Product_Service.SearchProductsWrapper getSearchProductsWrapper(String searchPhrase, Integer offset) {
        Integer queryLimit = Integer.valueOf(System.Label.AS_Community_SearchLimit);

        List<ProductInfoWrapper> wrappers = productInfoWrappers(searchPhrase, offset);

        Integer numberOfProducts = countProducts(searchPhrase);

        return new SearchProductsWrapper(wrappers, numberOfProducts, queryLimit, searchPhrase, offset);
    }

    public static AS_Product_Service.SearchProductsWrapper getSearchProductsWrapperWithStandardPrice(String searchPhrase, Integer offset) {
        Integer queryLimit = Integer.valueOf(System.Label.AS_Community_SearchLimit);

        List<ProductInfoWrapper> wrappers = productInfoWrappersStandardPrice(searchPhrase, offset);

        Integer numberOfProducts = countProducts(searchPhrase);

        System.debug(wrappers);
        return new SearchProductsWrapper(wrappers, numberOfProducts, queryLimit, searchPhrase, offset);
    }


    public static List<ProductInfoWrapper> productInfoWrappers(String phrase, Integer offset) {
        Integer queryLimit = Integer.valueOf(System.Label.AS_Community_SearchLimit);
        List<PricebookEntry> productsInfo = new List<PricebookEntry>();

        productsInfo = Database.query(pricebookEntryQuery(phrase));

        List<ProductInfoWrapper> cheapestInfoWrappers = convertToInfoWrappers(productsInfo);
        return returnListWithLimitAndOffset(cheapestInfoWrappers, queryLimit, offset);
    }

    public static List<ProductInfoWrapper> productInfoWrappersStandard(String phrase, Integer offset) {
        Integer queryLimit = Integer.valueOf(System.Label.AS_Community_SearchLimit);
        List<PricebookEntry> productsInfo = new List<PricebookEntry>();

        productsInfo = Database.query(pricebookEntryQueryStandardPrice(phrase,queryLimit,offset));

        List<ProductInfoWrapper> cheapestInfoWrappers = convertToInfoWrappers(productsInfo);
        return returnListWithLimitAndOffset(cheapestInfoWrappers, queryLimit, offset);
    }


    public static List<ProductInfoWrapper> returnListWithLimitAndOffset(List<ProductInfoWrapper> wrappers, Integer queryLimit, Integer offset) {
        System.debug('/////////////////////////////////////');
        System.debug('/////////////////////////////////////');
        System.debug('WRAPPERS');
        for (ProductInfoWrapper w : wrappers) {
            System.debug(w);
        }

        System.debug('/////////////////////////////////////');
        List<ProductInfoWrapper> limitedList = new List<AS_Product_Service.ProductInfoWrapper>();

        Integer startLoop;
        Integer endLoop;
        if (offset < wrappers.size()) {
            startLoop = offset;
        } else {
            startLoop = 0;
        }

        if ((offset + queryLimit) < wrappers.size()) {
            endLoop = (offset + queryLimit);
        } else {
            endLoop = wrappers.size();
        }

        for (Integer i = startLoop; i < endLoop; i++) {
            ProductInfoWrapper wrapper = wrappers.get(i);
            limitedList.add(wrapper);
        }

        System.debug('WRAPPER WITH OFFSET');
        for (ProductInfoWrapper w : limitedList) {
            System.debug(w);
        }
        System.debug('/////////////////////////////////////');
        System.debug('/////////////////////////////////////');
        return limitedList;
    }


    public static List<ProductInfoWrapper> productInfoWrappersStandardPrice(String phrase, Integer offset) {

        Integer queryLimit = Integer.valueOf(System.Label.AS_Community_SearchLimit);
        List<PricebookEntry> productsInfo = new List<PricebookEntry>();

        productsInfo = Database.query(pricebookEntryQueryStandardPrice(phrase, queryLimit, offset));

        return convertToInfoWrappers(productsInfo);

    }

    private static String pricebookEntryQuery(String phrase) {

        AS_QueryBuilder queryBuilder = new AS_QueryBuilder();

        List<String> providedParameters = new List<String>{
                'Product2.Name',
                'Product2.Family'
        };

        List<String> selectedFields = new List<String>{
                'Id',
                'UnitPrice',
                'StandardPrice__c',
                'Product2Id',
                'Product2.Name',
                'Product2.Family',
                'Product2.Description',
                'Product2.mainPictureId__c'
        };

        queryBuilder.readyQuery_PricebookEntry_cheapestPrice_returnIfFieldsContainPhrase_andIsActive
                (selectedFields, 'PricebookEntry', phrase, providedParameters, 'OR');
        System.debug('QUERY:');
        queryBuilder.printQuery();
        return queryBuilder.returnQuery();

    }

    private static String pricebookEntryQueryStandardPrice(String phrase, Integer queryLimit, Integer offset) {
        System.debug('WCHODZI DO pricebookEntryQueryStandardPrice STD');


        AS_QueryBuilder queryBuilder = new AS_QueryBuilder();

        List<String> providedParameters = new List<String>{
                'Product2.Name',
                'Product2.Family'
        };

        List<String> selectedFields = new List<String>{
                'Id',
                'UnitPrice',
                'StandardPrice__c',
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
        System.debug('QUERY STANDARD:');
        queryBuilder.printQuery();
        return queryBuilder.returnQuery();

    }

    private static List<ProductInfoWrapper> convertToInfoWrappers(List<PricebookEntry> pbEntries) {
        List<ProductInfoWrapper> wrappers = new List<ProductInfoWrapper>();

        Map<String, List<PricebookEntry>> pbMap = groupPbEntryByName(pbEntries);

        for (String key : pbMap.keySet()) {
            List<PricebookEntry> entries = pbMap.get(key);
            ProductInfoWrapper wrapper = returnCheapestWrapper(entries);
            wrappers.add(wrapper);
        }

        return wrappers;
    }

    public static Map<String, List<PricebookEntry>> groupPbEntryByName(List<PricebookEntry> pbEntries){
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

    public static ProductInfoWrapper returnCheapestWrapper(List<PricebookEntry> entries) {
        PricebookEntry pbe = entries[0];
        String productId = pbe.Product2Id;
        String pricebookEntryId = pbe.Id;
        Decimal price = pbe.UnitPrice;
        Decimal standardPrice = pbe.StandardPrice__c;
        String mainPicture = pbe.Product2.mainPictureId__c;
        String productName = pbe.Product2.Name;
        for (PricebookEntry p : entries) {
            if (p.UnitPrice < price) {
                price = p.UnitPrice;
                productId = p.Product2Id;
                standardPrice = p.StandardPrice__c;
                mainPicture = p.Product2.mainPictureId__c;
                productName = p.Product2.Name;
                pricebookEntryId = p.Id;
            }
        }
        return new ProductInfoWrapper(productId, mainPicture, productName, String.valueOf(price), String.valueOf(standardPrice),pricebookEntryId);
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

    public static AS_Product_Service.ProductInfoWrapper getProductInfoWrapperForDetailsPage(String productId) {
        List<PricebookEntry> pricesEntries = [
                SELECT
                        UnitPrice,
                        StandardPrice__c,
                        Pricebook2Id,
                        Name,
                        Id,
                        Product2.Name,
                        Product2.mainPictureId__c
                FROM PricebookEntry
                WHERE Product2Id = :productId
                AND IsActive = true
                AND Pricebook2.IsActive = true
        ];

        return returnCheapestWrapper(pricesEntries);
    }

    public static String getCheapestPrice(String productId) {
        List<PricebookEntry> pricebookEntries = [
                SELECT
                        UnitPrice
                FROM PricebookEntry
                WHERE Product2Id = :productId
                AND Pricebook2.IsActive = true
        ];

        List<Decimal> prices = new List<Decimal>();

        for (PricebookEntry entry : pricebookEntries) {
            prices.add(entry.UnitPrice);
        }

        Decimal cheapestPrice = prices[0];

        for (Decimal p : prices) {
            if (cheapestPrice > p) {
                cheapestPrice = p;
            }
        }

        return String.valueOf(cheapestPrice);

    }

    public class ProductInfoWrapper {
        @auraEnabled
        public String Id { get; set; }
        @auraEnabled
        public String productId { get; set; }
        @auraEnabled
        public String pricebookEntryId { get; set; }
        @auraEnabled
        public String mainPictureId { get; set; }
        @auraEnabled
        public String productName { get; set; }
        @auraEnabled
        public String price { get; set; }
        @auraEnabled
        public String standardPrice { get; set; }
        @auraEnabled
        public String discount { get; set; }
        @auraEnabled
        public Boolean isPercent { get; set; }
        @auraEnabled
        public Boolean editBtnClicked { get; set; }




        public ProductInfoWrapper() {
        }

        public ProductInfoWrapper(String productId, String mainPicId, String productName, String price) {
            this.productId = productId;
            this.mainPictureId = mainPicId;
            this.productName = productName;
            this.price = price;
            this.Id = productId;
        }
        public ProductInfoWrapper(String productId, String mainPicId, String productName, String price, String standardPrice) {
            this.productId = productId;
            this.mainPictureId = mainPicId;
            this.productName = productName;
            this.price = price;
            this.standardPrice = standardPrice;
            this.Id = productId;

        }

        public ProductInfoWrapper(String productId, String mainPicId, String productName, String price, String standardPrice, String pricebookEntryId) {
            this.productId = productId;
            this.mainPictureId = mainPicId;
            this.productName = productName;
            this.price = price;
            this.standardPrice = standardPrice;
            this.pricebookEntryId = pricebookEntryId;
            this.Id = productId;

        }

    }

    public class SearchProductsWrapper {
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

        public SearchProductsWrapper(List<ProductInfoWrapper> wrappers, Integer numberOfProducts, Integer queryLimit, String queryPhrase, Integer offset) {
            this.wrappers = wrappers;
            this.numberOfProducts = numberOfProducts;
            this.queryLimit = queryLimit;
            this.queryPhrase = queryPhrase;
            this.offset = offset;
        }
    }

}