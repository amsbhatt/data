//Allowed options for category are: button, page
//Allowed options for action are: click, visit

/*Interaction coding is as follows
* Three-Five letter acronym that includes the category, object, action and if destination is present include in acronym
* For example, category: 'button', object: 'image', action: 'click', data: {destination: 'Tumblr'} would have an acronym of
*   BICT ('B' for button, 'I' for image, 'C' for click, 'T' for tumblr
* */

//Define interaction custom data below.
manifest = {
  "BLC": { category: "button", object: "hello_link", action: "click", data: {destination: 'yourFace'} },
  "PGV": { category: "page", object: "gallery", action: "visit", data: {} }
};