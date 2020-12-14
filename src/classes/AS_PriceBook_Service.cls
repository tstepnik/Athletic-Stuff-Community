public with sharing class AS_PriceBook_Service {

    public static List<PriceBookWrapper> getPriceBookWrappers() {
        List<Pricebook2> pricebooks = getAllPriceBooks();
        List<PriceBookWrapper> wrappers = new List<AS_PriceBook_Service.PriceBookWrapper>();
        for (Pricebook2 p : pricebooks) {
            wrappers.add(new PriceBookWrapper(p));
        }
        return wrappers;
    }

    public static List<Pricebook2> getAllPriceBooks() {
        return [SELECT Id, IsActive, CreatedById,CreatedBy.Name,Description, IsStandard, Name,StartDate__c,EndDate__c FROM Pricebook2];
    }

    public static List<AS_PriceBook_Service.PbEntryWrapper>getPricebookDetails(String pricebookId) {
        List<PricebookEntry> entries = getPbEntries(pricebookId);
        List<AS_PriceBook_Service.PbEntryWrapper> wrappers = new List<AS_PriceBook_Service.PbEntryWrapper>();
        for (PricebookEntry entry : entries) {
            wrappers.add(new PbEntryWrapper(entry));
        }
        return wrappers;
    }

    public static List<PricebookEntry> getPbEntries(String pricebookId) {
        System.debug('PRICEBOOK ID IN GET PB ENTRIES: ' + pricebookId);
        return [SELECT Id,Product2.Name,StandardPrice__c,UnitPrice,IsActive FROM PricebookEntry WHERE Pricebook2Id = :pricebookId];
    }

    public static void createDiscountPricebook(String discount, Boolean isPercent, String startDate, String endDate, List<AS_Product_Service.ProductInfoWrapper> wrappers) {
        System.debug('PRICEBOOK SERVICE');
        Integer randomNumber = Integer.valueof((Math.random() * 1000));
        Pricebook2 discountPricebook = new Pricebook2(Name = 'Discount Price book nr: ' + randomNumber, IsActive = true);
        discountPricebook.StartDate__c = Date.valueOf(startDate);
        discountPricebook.EndDate__c = Date.valueOf(endDate);
        insert discountPricebook;
        List<AS_Product_Service.ProductInfoWrapper> pWrappers = wrappers;
        List<PricebookEntry> pbEntries = new List<PricebookEntry>();
        for (AS_Product_Service.ProductInfoWrapper wrapper : pWrappers) {
            pbEntries.add(createPbEntry(wrapper, isPercent, discount, discountPricebook.Id));
        }
        System.debug('PRICEBOOK ENTRY: ');
        for (PricebookEntry e : pbEntries) {
            System.debug(e);
        }
        insert pbEntries;
    }


    private static PricebookEntry createPbEntry(AS_Product_Service.ProductInfoWrapper wrapper, Boolean isPercent, String discount, String pricebookId) {
        PricebookEntry pricebookEntry = new PricebookEntry();
        Decimal newPrice = countDiscount(isPercent, discount, wrapper.price);
        pricebookEntry.IsActive = true;
        pricebookEntry.UseStandardPrice = false;
        pricebookEntry.Pricebook2Id = pricebookId;
        pricebookEntry.Product2Id = wrapper.productId;
        pricebookEntry.UnitPrice = newPrice.setScale(2);
        pricebookEntry.StandardPrice__c = Decimal.valueOf(wrapper.price);

        return pricebookEntry;
    }

    private static Decimal countDiscount(Boolean isPercent, String discount, String price) {
        Decimal standardPrice = Decimal.valueOf(price);
        Decimal discountAmount = Decimal.valueOf(discount);
        Decimal newPrice;
        if (isPercent) {
            newPrice = standardPrice - (standardPrice * (discountAmount / 100));
        } else {
            newPrice = standardPrice - discountAmount;
        }

        return newPrice;
    }

    public static void activatePricebook(String pricebookId) {
        Pricebook2 pricebook = [
                SELECT
                        Id,
                        IsActive
                FROM Pricebook2
                WHERE Id = :pricebookId
        ];

        if (!pricebook.IsActive) {
            pricebook.IsActive = true;
            try {
                update pricebook;
            } catch (DmlException e) {
                System.debug('DML exception in method activatePricebook in class AS_PriceBook_Service \n Description: ' + e.getMessage());
            }
        }
    }

    public static void deactivatePricebook(String pricebookId) {
        System.debug('WCHODZI DO DEACITAVE');
        System.debug('pricebookId: ' + pricebookId);
        Pricebook2 pricebook = [
                SELECT
                        Id,
                        Name,
                        IsActive
                FROM Pricebook2
                WHERE Id = :pricebookId
                LIMIT 1
        ];
        System.debug('pricebook: ' + pricebook.Name + ' Id: ' + pricebook.Id + ' IsActive: ' + pricebook.IsActive);

        if (pricebook.IsActive) {
            pricebook.IsActive = false;
            try {
                update pricebook;
            } catch (DmlException e) {
                System.debug('DML exception in method deactivatePricebook in class AS_PriceBook_Service \n Description: ' + e.getMessage());
            }
        }
    }

    public static void deletePricebook(String pricebookId) {
        Pricebook2 pricebook = [
                SELECT
                        Id
                FROM Pricebook2
                WHERE Id = :pricebookId
        ];

        try {
            delete pricebook;
        } catch (DmlException e) {
            System.debug('DML exception in method deletePricebook in class AS_PriceBook_Service \n Description: ' + e.getMessage());
        }

    }

    public class PriceBookWrapper {

        @auraenabled
        public String id { get; set; }
        @auraenabled
        public String name { get; set; }
        @auraenabled
        public Boolean isStandard { get; set; }
        @auraenabled
        public Boolean isActive { get; set; }
        @auraenabled
        public String createdBy { get; set; }
        @auraenabled
        public String startDate { get; set; }
        @auraenabled
        public String endDate { get; set; }

        public PriceBookWrapper(String name, Boolean isStandard, Boolean isActive, String createdBy) {

            this.name = name;
            this.isStandard = isStandard;
            this.isActive = isActive;
            this.createdBy = createdBy;
        }
        public PriceBookWrapper(Pricebook2 priceBook) {
            this.id = priceBook.Id;
            this.name = priceBook.Name;
            this.isStandard = priceBook.IsStandard;
            this.isActive = priceBook.IsActive;
            this.createdBy = priceBook.CreatedBy.Name;
            this.startDate = String.valueOf(priceBook.StartDate__c);
            this.endDate = String.valueOf(priceBook.EndDate__c);
        }

    }

    public class PbEntryWrapper {

        @AuraEnabled
        public String name { get; set; }
        @AuraEnabled
        public String standardPrice { get; set; }
        @AuraEnabled
        public String newPrice { get; set; }
        @AuraEnabled
        public Boolean active { get; set; }

        public PbEntryWrapper(PricebookEntry pbEntry) {
            this.name = pbEntry.Product2.Name;
            this.standardPrice = String.valueOf(pbEntry.StandardPrice__c);
            this.newPrice = String.valueOf(pbEntry.UnitPrice);
            this.active = pbEntry.IsActive;
        }
    }

    public static Pricebook2 createPricebookForOrder() {
        Order order = AS_Order_Service.getBasketOrder();
        String pricebookName = 'Pricebook for order nr: ' + order.OrderNumber;
        Pricebook2 pricebook = new Pricebook2(Name = pricebookName);
        insert pricebook;
        return pricebook;
    }

    public static Map<String, PricebookEntry> addPricebookEntriesToPricebook(List<AS_Order_Service.OrderItemWrapper> wrappers, String pricebookId) {
        List<PricebookEntry> pbEntries = new List<PricebookEntry>();
        Map<String, PricebookEntry> pbEntriesMap = new Map<String, PricebookEntry>();
        for (AS_Order_Service.OrderItemWrapper wrapper : wrappers) {
        PricebookEntry pricebookEntry = New PricebookEntry(Product2Id = wrapper.productId, Pricebook2Id = pricebookId, UnitPrice = wrapper.price);
            pbEntries.add(pricebookEntry);
            pbEntriesMap.put(wrapper.productName,pricebookEntry);
        }
        insert pbEntries;
        return pbEntriesMap;
    }
}