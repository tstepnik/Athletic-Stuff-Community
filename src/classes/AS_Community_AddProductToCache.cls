/**
 * Created by tomas on 20.11.2020.
 */

public with sharing class AS_Community_AddProductToCache {

    private Cache.SessionPartition sessionPartition;

    sessionPartition = Cache.Session.getPartition('local.ModernHospitalSystem');


    //put

    sessionPartition.put('token', requestToken);

    //get
    cachedToken = (String) sessionPartition.get('token');
}