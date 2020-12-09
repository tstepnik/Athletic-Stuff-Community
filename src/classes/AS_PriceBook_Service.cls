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
        return [SELECT Id,Product2.Name,OldPrice__c,UnitPrice FROM PricebookEntry WHERE Pricebook2Id = :pricebookId];
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
        public String oldPrice { get; set; }
        @AuraEnabled
        public String newPrice { get; set; }

        public PbEntryWrapper(PricebookEntry pbEntry) {
            this.name = pbEntry.Product2.Name;
            this.oldPrice = String.valueOf(pbEntry.OldPrice__c);
            this.newPrice = String.valueOf(pbEntry.UnitPrice);
        }
    }
}