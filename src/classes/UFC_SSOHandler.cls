global class UFC_SSOHandler implements Auth.RegistrationHandler {
    global User createUser(Id portalId, Auth.UserData data) {
        Profile communityProfile = [SELECT Id FROM profile WHERE name = 'UFC Community User'];
        User communityUser = new User();
        communityUser.email = data.email;
        communityUser.lastName = data.lastName;
        communityUser.firstName = data.firstName;
        communityUser.username = data.firstName + data.lastName + '@ufccommunity.com';
        String alias = data.firstName + data.lastName;
        communityUser.alias = alias.length() > 8 ? alias.substring(0, 8) : alias;
        communityUser.languagelocalekey = UserInfo.getLanguage();
        communityUser.localesidkey = UserInfo.getLocale();
        communityUser.emailEncodingKey = 'UTF-8';
        communityUser.timeZoneSidKey = 'Europe/Berlin';
        communityUser.profileId = communityProfile.Id;

        if (data.attributeMap.containsKey('sfdc_networkid')) {
            Account communityAccount = [SELECT Id FROM account WHERE name = 'Community Account'];
            Contact communityContact = new Contact(
                    accountId = communityAccount.Id,
                    email = data.email,
                    firstName = data.firstName,
                    lastName = data.lastName
            );
            insert communityContact;

            communityUser.contactId = communityContact.Id;
        }
        return communityUser;
    }

    global void updateUser(Id userId, Id portalId, Auth.UserData data) {
        User u = new User(id = userId);
        u.email = data.email;
        u.lastName = data.lastName;
        u.firstName = data.firstName;
        update(u);
    }
}