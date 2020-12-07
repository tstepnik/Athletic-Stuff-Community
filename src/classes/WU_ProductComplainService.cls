public with sharing class WU_ProductComplainService {
    public static List<ComplainWrapper> getUserCases() {
        try {
            return wrapCases(getUserCaseList());
        } catch (Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }

    private static List<Case> getUserCaseList() {
        return [
                SELECT Description, Subject, CaseNumber, Status, CreatedDate, ClosedDate,  Reason, ProductLookUp__r.Name
                FROM Case
                WHERE ContactId = :getContactId()
        ];
    }
    private static String getContactId(){
        User userWithContactId = [SELECT ContactId FROM User WHERE Id = :UserInfo.getUserId() LIMIT  1];
        return userWithContactId.ContactId;
    }

    private static List<ComplainWrapper> wrapCases(List<Case> casesToWrap) {
        List<ComplainWrapper> complains = new List<ComplainWrapper>();
        for (Case singleCase : casesToWrap) {
            complains.add(new ComplainWrapper(singleCase));
        }
        return complains;
    }

    public class ComplainWrapper {
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

        public complainWrapper(String description, String subject, String caseNumber, String status, String caseOpen, String caseClosed, String caseReason, String productName, String comments) {
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

        public complainWrapper(Case caseToWrapper) {
            this.description = caseToWrapper.Description;
            this.subject = caseToWrapper.Subject;
            this.caseNumber = caseToWrapper.CaseNumber;
            this.status = caseToWrapper.Status;
            this.caseOpen = String.valueOf(caseToWrapper.CreatedDate);
            this.caseClosed = String.valueOf(caseToWrapper.ClosedDate);
            this.productName = caseToWrapper.ProductLookUp__r.Name;
            this.caseReason = caseToWrapper.Reason;
//            this.comments = caseToWrapper.Comment_for_User__c;
        }
    }
}