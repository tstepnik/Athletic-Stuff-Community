/**
 * Created by tomas on 25.11.2020.
 */

public with sharing class AS_ContentDocumentLink_TriggerHandler {

    private static AS_ContentDocumentLink_TriggerHandler instance;

    public static AS_ContentDocumentLink_TriggerHandler getInstance() {
        if (instance == null) {
            return new AS_ContentDocumentLink_TriggerHandler();
        } else {
            return instance;
        }
    }


    public  void set_FirstAddedImage_AsMain_InProducts (List<ContentDocumentLink> triggerNew, List<ContentDocumentLink> triggerOld){

        List<ContentDocumentLink> newFiles = triggerNew;
        List<ContentDocumentLink> oldFiles = triggerOld;
        Set<String> oldLinkedEntityIds = new Set<String>();


        List<Product2> products = [SELECT Id FROM Product2];
        List<String> productIds = new List<String>();

        List<ContentDocumentLink> attachedToProducts = new List<ContentDocumentLink>();

        for (Product2 pr : products) {
            productIds.add(pr.Id);
        }

        for (ContentDocumentLink doc : oldFiles) {
            if (productIds.contains(doc.LinkedEntityId)) {
                oldLinkedEntityIds.add(doc.LinkedEntityId);
            }
        }

        Boolean attachedToProduct = false;
        Boolean firstAttachedFileToProduct = false;

        for (ContentDocumentLink doc : newFiles) {
            if (productIds.contains(doc.LinkedEntityId)) {
                attachedToProduct = true;
                if (!oldLinkedEntityIds.contains(doc.LinkedEntityId)) {
                    firstAttachedFileToProduct = true;
                    attachedToProducts.add(doc);
                }
            }
        }

        if (firstAttachedFileToProduct) {
            List<Product2> productsToUpdate = new List<Product2>();

            for (ContentDocumentLink file : attachedToProducts) {
                Product2 product = new Product2(Id = file.LinkedEntityId);
                product.mainPictureId__c = file.ContentDocument.LatestPublishedVersionId;
                productsToUpdate.add(product);
            }

            try {
                Database.update(productsToUpdate);
            } catch (Exception e) {
                System.debug(e.getMessage());
            }
        }
    }

}