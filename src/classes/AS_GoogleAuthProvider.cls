global class AS_GoogleAuthProvider implements Auth.RegistrationHandler {

    global User createUser(Id portalId, Auth.UserData data) {

        if (data.attributeMap.containsKey('sfdc_networkid')) {
            Account account = [SELECT Id FROM account WHERE name = 'Community users'];
            Contact contact = new Contact();
            contact.accountId = account.Id;
            contact.email = data.email;
            contact.firstName = data.firstName;
            contact.lastName = data.lastName;
            try {
                insert contact;
            } catch (Exception exc) {
                System.debug(exc);
            }
            return createUser(data, contact, true);
        } else {
            return createUser(data, null, false);
        }
    }

    global void updateUser(Id userId, Id portalId, Auth.UserData data) {
        User user = new User(id = userId);
        user.email = data.email;
        user.lastName = data.lastName;
        user.firstName = data.firstName;
        update(user);
    }




    private User createUser(Auth.UserData data, Contact contact, Boolean isCommunity) {
        User user = new User();
        Profile profile;
        String alias;
        if (isCommunity) {
            profile = [SELECT Id FROM profile WHERE name = 'Customer Community User'];
            user.username = data.email + '.britenet';
            user.contactId = contact.Id;
            alias = data.firstName + data.lastName;
        } else {
            profile = [SELECT Id FROM profile WHERE name = 'Standard User'];
            user.username = data.username + '@myorg.com';
            alias = data.username;
        }
        user.email = data.email;
        user.lastName = data.lastName;
        user.firstName = data.firstName;
        user.alias = alias.length() > 8 ? alias.substring(0, 8) : alias;
        user.languagelocalekey = UserInfo.getLanguage();
        user.localesidkey = UserInfo.getLocale();
        user.emailEncodingKey = 'UTF-8';
        user.timeZoneSidKey = 'America/Los_Angeles';
        user.profileId = profile.Id;
        return user;
    }
}