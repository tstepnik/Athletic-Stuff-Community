/**
 * Created by tomas on 23.11.2020.
 */

public with sharing class AS_Community_Service {

    public static List<Product2> getProducts(Product2 product) {
        List<Product2> products = new List<Product2>();
        String query = queryBuilder(product);
        System.debug(query);
        products = Database.query(query);
        return products;
    }

    private static String queryBuilder(Product2 product) {
        String jsonProduct = JSON.serialize(product);
        Map<String, Object> productMap = (Map<String, Object>) JSON.deserializeUntyped(jsonProduct);

        /**
        * You set query parameters only in this place
        */
        List<String> providedParameters = new List<String>{
                'Name',
                'Family'
        };

        /**
* Only in this list put field which you are expected to use form object
*/
        List<String> searchedParameters = new List<String>{
                'Name',
                'Id',
                'Family',
                'Description',
                'mainPictureId__c'
        };

        String searchedFields = searchedFields(searchedParameters);
        String condition = providedConditions(productMap, providedParameters, 'OR');
        String query = 'SELECT ';
        query += searchedFields;
        query += ' FROM Product2';
        query += ' WHERE ' + condition;

        return query;
    }

    private static String searchedFields(List<String> fields) {
        String searchedFields = '';
        Boolean firsTime = true;
        for (String field : fields) {
            if (firsTime) {
                searchedFields += field;
                firsTime = false;
            } else {
                searchedFields += ',' + field;
            }
        }
        return searchedFields;
    }

    //todo handle case when each field is null
    private static String providedConditions(Map<String, Object> fieldsMap, List<String> conditions, String andOr) {
        String query = '';
        if (andOr != 'OR' && andOr != 'AND') {
            andOr = ' OR ';
        } else {
            andOr = ' ' + andOr + ' ';
        }


        Boolean firstQuery = true;

        for (String key : conditions) {
            if (fieldsMap.containsKey(key) && key != null) {
                if (!firstQuery) {
                    if (key == 'id') {
                        query += andOr + key + ' = \'' + fieldsMap.get(key) + '\'';

                    } else {
                        query += andOr + key + ' LIKE \'' + fieldsMap.get(key) + '%\'';
                    }
                } else {
                    if (key == 'id') {
                        query += key + ' = \'' + fieldsMap.get(key) + '\'';
                    } else {
                        query += key + ' LIKE \'' + fieldsMap.get(key) + '%\'';
                    }
                    firstQuery = false;
                }
            }
        }
        return query;
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

    private static List<ContentDocumentLink> getContentDocumentLinkIds(String productId){
        return [
                SELECT ContentDocument.LatestPublishedVersionId
                FROM ContentDocumentLink
                WHERE LinkedEntityId = :productId
                LIMIT 10
        ];
    }
    private static List<DocumentContentWrapper> wrapContentDocumentLinks(List<ContentDocumentLink> contentDocumentLinks){
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

}