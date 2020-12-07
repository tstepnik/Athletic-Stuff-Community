public with sharing class AS_Case_Service {

    public static void createCase(String productName, String orderNumber, String caseSubject, String description) {
        System.debug('WCHODZI DO SERWISUUU');
        Case c = new Case();
        c.Status = 'New';
        c.Priority = 'Medium';
        c.Origin = 'Web';
        c.ContactId = AS_Order_Service.getContactId();
        c.AccountId = '0017R00002GUT1OQAX';
        c.Subject = caseSubject;
        c.Description = description;
        c.ProductName__c = productName;
        c.OrderNumber__c = Integer.valueOf(orderNumber);
        insert c;
    }

    public static List<CaseWrapper> getWrappers() {
        List<Case> cases = [
                SELECT Id,Description,Subject,CaseNumber,Status,CreatedDate,ClosedDate,Reason,ProductName__c,OrderNumber__c
                FROM Case
                WHERE ContactId = :AS_Order_Service.getContactId()
        ];

        List<CaseWrapper> wrappers = new List<CaseWrapper>();
        if (cases != null && !cases.isEmpty()) {
            for (Case c : cases) {
                wrappers.add(new CaseWrapper(c));

            }
        }
        return wrappers;
    }

    public class CaseWrapper {
        @AuraEnabled
        public String subject { set; get; }
        @AuraEnabled
        public String description { set; get; }
        @AuraEnabled
        public String caseNumber { set; get; }
        @AuraEnabled
        public String status { set; get; }
        @AuraEnabled
        public String caseOpen { set; get; }
        @AuraEnabled
        public String caseClosed { set; get; }
        @AuraEnabled
        public String productName { set; get; }
        @AuraEnabled
        public String caseReason { set; get; }
        @AuraEnabled
        public String comments { set; get; }
        @AuraEnabled
        public String orderNumber { get; set; }


        public CaseWrapper(String description, String subject, String caseNumber, String status, String caseOpen, String caseClosed, String caseReason, String productName, String comments) {
            this.description = Description;
            this.subject = subject;
            this.caseNumber = caseNumber;
            this.status = status;
            this.caseOpen = caseOpen;
            this.caseClosed = caseClosed;
            this.productName = productName;
            this.caseReason = caseReason;
            this.comments = comments;
        }
        public CaseWrapper(Case caseToWrapper) {
            this.description = caseToWrapper.Description;
            this.subject = caseToWrapper.Subject;
            this.caseNumber = caseToWrapper.CaseNumber;
            this.status = caseToWrapper.Status;
            this.caseOpen = String.valueOf(caseToWrapper.CreatedDate);
            this.caseClosed = String.valueOf(caseToWrapper.ClosedDate);
            this.caseReason = caseToWrapper.Reason;
            this.productName = caseToWrapper.ProductName__c ;
            this.orderNumber = String.valueOf(caseToWrapper.OrderNumber__c) ;
        }
    }

    public class ServiceResponseWrapper {

        @AuraEnabled
       public String createdAt { get; set; }
        @AuraEnabled
        public  String owner { get; set; }
        @AuraEnabled
        public  String message { get; set; }

        public ServiceResponseWrapper(String createdAt, String owner, String message) {
            this.createdAt = createdAt;
            this.owner = owner;
            this.message = message;
        }
    }

}