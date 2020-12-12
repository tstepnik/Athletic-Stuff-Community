public with sharing class AS_Product_Service {

    public static AS_Product_Service.SearchProductsWrapper getSearchProductsWrapper(String searchPhrase, Integer offset) {
        Integer queryLimit = Integer.valueOf(System.Label.AS_Community_SearchLimit);

        List<ProductInfoWrapper> wrappers = productInfoWrappers(searchPhrase, offset);

        Integer numberOfProducts = countProducts(searchPhrase);

        return new SearchProductsWrapper(wrappers, numberOfProducts, queryLimit, searchPhrase, offset);
    }

    public static List<ProductInfoWrapper> productInfoWrappers(String phrase, Integer offset) {
        Integer queryLimit = Integer.valueOf(System.Label.AS_Community_SearchLimit);
        List<PricebookEntry> productsInfo = new List<PricebookEntry>();

        productsInfo = Database.query(pricebookEntryQuery(phrase, queryLimit, offset));

        return convertToInfoWrappers(productsInfo);

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
        System.debug('QUERY:');
        queryBuilder.printQuery();
        return queryBuilder.returnQuery();

    }

    private static List<ProductInfoWrapper> convertToInfoWrappers(List<PricebookEntry> pbEntries) {
        System.debug('WCHODZI DO : convertToInfoWrappers' );
        List<ProductInfoWrapper> wrappers = new List<ProductInfoWrapper>();

        Map<String, List<PricebookEntry>> pbMap = new Map<String, List<PricebookEntry>>();
        System.debug('WCHODZI DO : convertToInfoWrappers 11' );

        for (PricebookEntry p : pbEntries) {
            System.debug('WCHODZI DO : convertToInfoWrappers 22' );

            String productName = p.Product2.Name;
            System.debug('WCHODZI DO : convertToInfoWrappers 33' );

            if (pbMap.containsKey(productName)) {
                System.debug('WCHODZI DO : convertToInfoWrappers 44' );

                List<PricebookEntry> entries = new List<PricebookEntry>();
                entries = pbMap.get(productName);
                entries.add(p);
                pbMap.put(productName, entries);
            } else {
                System.debug('WCHODZI DO : convertToInfoWrappers 55' );

                List<PricebookEntry> entries = new List<PricebookEntry>();
                entries.add(p);
                pbMap.put(productName, entries);
            }
        }
        System.debug('WCHODZI DO : convertToInfoWrappers 66' );

        for (String key : pbMap.keySet()) {
            List<PricebookEntry> entries = pbMap.get(key);
            ProductInfoWrapper wrapper = returnCheapestWrapper(entries);
            wrappers.add(wrapper);
        }

        return wrappers;
    }

    public static ProductInfoWrapper returnCheapestWrapper(List<PricebookEntry> entries) {
        System.debug('WCHODZI DO : returnCheapestWrapper' );

        PricebookEntry pbe = entries[0];
        String productId = pbe.Product2Id;
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
            }
        }
        return new ProductInfoWrapper(productId, mainPicture, productName, String.valueOf(price), String.valueOf(standardPrice));
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

    public static String getProductPrice(String productId) {
        Decimal price = [
                SELECT
                        UnitPrice
                FROM PricebookEntry
                WHERE Product2Id = :productId
        ][0].UnitPrice;

        return String.valueOf(price);
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
        public String productId { get; set; }
        @auraEnabled
        public String mainPictureId { get; set; }
        @auraEnabled
        public String productName { get; set; }
        @auraEnabled
        public String price { get; set; }
        @auraEnabled
        public String standardPrice { get; set; }

        public ProductInfoWrapper() {
        }

        public ProductInfoWrapper(String productId, String mainPicId, String productName, String price) {
            this.productId = productId;
            this.mainPictureId = mainPicId;
            this.productName = productName;
            this.price = price;
        }
        public ProductInfoWrapper(String productId, String mainPicId, String productName, String price, String standardPrice) {
            this.productId = productId;
            this.mainPictureId = mainPicId;
            this.productName = productName;
            this.price = price;
            this.standardPrice = standardPrice;
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