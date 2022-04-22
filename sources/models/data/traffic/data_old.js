import {getUrl} from "models/utils/general/utils";

// 

export const trafficstat = new webix.DataCollection({

    'url' : getUrl('trafficstat'),
	'id' : 'trafficstat'
});

export const trafficvoix = new webix.DataCollection({

    'url' : getUrl('trafficvoix'),
	'id' : 'trafficvoix'
});

export const trafficsms = new webix.DataCollection({

    'url' : getUrl('trafficsms'),
	'id' : 'trafficsms'
});

export const traffdata = new webix.DataCollection({

    'url' : getUrl('traffdata'),
	'id' : 'traffdata'
});


