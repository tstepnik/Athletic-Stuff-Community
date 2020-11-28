public with sharing class AS_Community_Service {

    public static List<ProductInfoWrapper> productInfoWrappers(Product2 product) {

        List<Product2> products = getProducts(product);

        List<PricebookEntry> pricebookEntries = getPbEntries(16, 0, products);

        Map<String, String> productPrices = getProductPricesMap(pricebookEntries);

        return getProductInfoWrappers(products, productPrices);

    }

    private static Map<String, String> getProductPricesMap(List<PricebookEntry> pbEntries) {
        Map<String, String> productPrices = new Map<String, String>();

        for (PricebookEntry p : pbEntries) {
            productPrices.put(p.Product2Id, String.valueOf(p.UnitPrice));
        }

        return productPrices;
    }

    public static List<ProductInfoWrapper> getProductInfoWrappers(List<Product2> products, Map<String, String> productPrices) {
        List<ProductInfoWrapper> infoWrappers = new List<ProductInfoWrapper>();

        for (Product2 p : products) {
            String mainPictureId = p.mainPictureId__c;
            String productName = p.Name;
            String price = productPrices.get(p.Id);
            if (price != null) {
                ProductInfoWrapper wrapper = new ProductInfoWrapper(p.Id, mainPictureId, productName, price);
                infoWrappers.add(wrapper);
            }
        }

        return infoWrappers;
    }

    public static List<PricebookEntry> getPbEntries(Integer queryLimit, Integer offset, List<Product2> products) {
        List<String> productIds = new List<String>();
        productIds = extractFromObjList('Id', products);
        List<PricebookEntry> pricebookEntries = new List<PricebookEntry>();
        pricebookEntries = [
                SELECT
                        Id,
                        IsActive,
                        UnitPrice,
                        Product2Id
                FROM PricebookEntry
                WHERE Product2Id IN :productIds
                AND IsActive = true
                LIMIT :queryLimit
                OFFSET :offset
        ];
        return pricebookEntries;
    }


    public static List<Product2> getProducts(Product2 product) {
        List<Product2> products = new List<Product2>();
        String query = queryBuilder(product);
        products = Database.query(query);
        return products;
    }


    public static List<String> extractFromObjList(String extractedField, List<SObject> objList) {
        List<String> extractedFieldList = new List<String>();

        for (SObject obj : objList) {
            extractedFieldList.add(String.valueOf(obj.get(extractedField)));
        }
        return extractedFieldList;
    }


    private static String queryBuilder(Product2 product) {

        String phrase = product.Name;
        AS_QueryBuilder queryBuilder = new AS_QueryBuilder();

        List<String> providedParameters = new List<String>{
                'Name',
                'Family'
        };

        List<String> selectedFields = new List<String>{
                'Name',
                'Id',
                'Family',
                'Description',
                'mainPictureId__c'
        };

        queryBuilder.readyQuery_returnIfFieldsContainPhrase(selectedFields, 'Product2', phrase, providedParameters, 'OR');

        return queryBuilder.returnQuery();

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

    public static String getProductPrice(String productId) {
        Decimal price = [
                SELECT
                        UnitPrice
                FROM PricebookEntry
                WHERE Product2Id = :productId
        ][0].UnitPrice;

        return String.valueOf(price);
    }
}