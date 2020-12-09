/**
 * Created by tomas on 09.12.2020.
 */

public with sharing class AS_PriceBook_Service {


    public static List<PriceBookWrapper> getPriceBookWrappers() {
        List<Pricebook2> pricebooks = getAllPriceBooks();
        List<PriceBookWrapper> wrappers = new List<AS_PriceBook_Service.PriceBookWrapper>();
        for (Pricebook2 p : pricebooks) {
            wrappers.add(new PriceBookWrapper(p));
        }
        System.debug('WRAPPERS PB');
        System.debug(wrappers);
        return wrappers;
    }


    public static List<Pricebook2> getAllPriceBooks() {
        return [SELECT Id, IsActive, CreatedById,CreatedBy.Name,Description, IsStandard, Name FROM Pricebook2];
    }


    public class PriceBookWrapper {

        @auraenabled
        public String name { get; set; }
        @auraenabled
        public Boolean isStandard {
            get;
            set;
        }
        @auraenabled
        public Boolean isActive {
            get;
            set;
        }
        @auraenabled
        public String createdBy {
            get;
            set;
        }


        public PriceBookWrapper(String name, Boolean isStandard, Boolean isActive, String createdBy) {

            this.name = name;
            this.isStandard = isStandard;
            this.isActive = isActive;
            this.createdBy = createdBy;
        }
        public PriceBookWrapper(Pricebook2 priceBook) {

            this.name = priceBook.Name;
            this.isStandard = priceBook.IsStandard;
            this.isActive = priceBook.IsActive;
            this.createdBy = priceBook.CreatedBy.Name;
        }

    }

}