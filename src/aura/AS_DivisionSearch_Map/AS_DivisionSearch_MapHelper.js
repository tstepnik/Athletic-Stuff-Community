({
    handleEvent: function(component, event) {
        let listOfPointers = [];
        let iter = 0;
        let data = event.getParam('param');
        data.forEach((element) => {
            listOfPointers[iter++] = {
                location: {
                    City: element.city,
                    Country: element.country,
                    Street: element.street
                },
                description: element.name
            };
        });
        component.set('v.mapMarkers', listOfPointers);
    },
    showChosenRecord: function(component, event) {
        let listOfPointers = [{
            location: {
                City: event.getParam('accountWrapper').city || '',
                Country: event.getParam('accountWrapper').country || '',
                Street: event.getParam('accountWrapper').street || ''
            },
            value: event.getParam('accountWrapper').street || '',
            icon: 'custom:custom26',
            title: event.getParam('accountWrapper').name || ''
        }];
        component.set('v.mapMarkers', listOfPointers);
    }
})