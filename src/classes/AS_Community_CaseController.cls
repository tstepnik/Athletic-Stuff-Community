/**
 * Created by tomas on 07.12.2020.
 */

public with sharing class AS_Community_CaseController {

    @AuraEnabled
    public static void createComplaint(String orderNumber, String caseSubject, String caseDescriptionString) {

        Case c = new Case();
        c.Status = 'New';
        c.Priority = 'Medium';
        c.Origin = 'Web';
        c.ContactId = AS_Order_Service.getContactId();
        c.AccountId = '0017R00002GUT1OQAX';
        c.Subject = caseSubject;
        c.Description = caseDescriptionString;
        c.Comments = 'Order Number: ' + orderNumber;

        insert c;
    }

}