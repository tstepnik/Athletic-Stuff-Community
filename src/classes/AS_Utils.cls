/**
 * Created by tomas on 19.11.2020.
 */

public with sharing class AS_Utils {

    public  static AS_GoogleAuth__c authSetting() {
        return AS_GoogleAuth__c.getInstance();
    }
}