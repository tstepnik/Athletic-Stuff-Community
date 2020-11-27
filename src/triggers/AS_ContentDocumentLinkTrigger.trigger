trigger AS_ContentDocumentLinkTrigger on ContentDocumentLink (after insert) {


    List<ContentDocumentLink> newFiles = Trigger.new;
    List<ContentDocumentLink> oldFiles;

    if (Trigger.old != null) {
        List<ContentDocumentLink> oldFiles = Trigger.old;
    } else {
        oldFiles = new List<ContentDocumentLink>();
    }


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
            String pictureId = file.ContentDocument.LatestPublishedVersionId;

            ContentDocumentLink searchedId = [
                    SELECT ContentDocument.LatestPublishedVersionId
                    FROM ContentDocumentLink
                    WHERE LinkedEntityId = :file.LinkedEntityId
                    LIMIT 1
            ][0];

            List<ContentDocumentLink> q = [SELECT Id,ContentDocumentId, ContentDocument.LatestPublishedVersionId FROM ContentDocumentLink WHERE LinkedEntityId = :file.LinkedEntityId];

            if (q.size() < 2) {
                String LId = q[0].ContentDocument.LatestPublishedVersionId;

                Product2 product = new Product2(Id = file.LinkedEntityId);
                product.mainPictureId__c = LId;
                productsToUpdate.add(product);

            }
        }

        if (productsToUpdate.size() > 0) {
            try {
                Database.update(productsToUpdate);
            } catch (Exception e) {
                System.debug(e.getMessage());
            }
        }
    }
}