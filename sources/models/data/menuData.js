import { components } from "models/referential/genReferentials";
import { getUrl } from "models/utils/general/utils";
export const menuData = new webix.DataCollection({
  url: getUrl("menudata"),
  id: "menudata",
});

export const exportData = [
  { id: "i", value: '<span class ="mdi mdi-image"></span>Image' },
  { id: "p", value: '<span class ="mdi mdi-file-pdf"></span>PDF' },
  { id: "c", value: '<span class ="mdi mdi-file-delimited"></span>CSV' },
];

menuData.waitData.then(() => {
  for (const elm of menuData.getRange().map((d) => d.id)) {
    components[elm] = [];
  }
  console.log(components);
});
