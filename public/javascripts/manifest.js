//Allowed options for category are: button, page
//Allowed options for action are: click, visit

/*Interaction coding is as follows
* Three-Five letter acronym that includes the category, object, action and if destination is present include in acronym
* For example, category: 'button', object: 'image', action: 'click', data: {destination: 'Tumblr'} would have an acronym of
*   BICT ('B' for button, 'I' for image, 'C' for click, 'T' for tumblr
*
* To trigger manual interactions - make a call to DNA.interaction(DNA.manifest[insert_identifier here])
* For example, a call to PGV would be DNA.interaction(DNA.manifest['PGV'])
*
* */

//Define interaction custom data below.
manifest = {
  "BLC": { category: "button", object: "hello_link", action: "click", data: {direction: 'yourFace'} },
  "PGV": { category: "page", object: "gallery", action: "visit", data: {} }
};