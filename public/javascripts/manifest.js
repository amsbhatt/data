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
  "PGV": { category: "page", object: "gallery", action: "visit", data: {} },
  "LLC": { category: "link", object: "logo", action: "click", data: {} },
  "TSC": { category: "text_field", object: "search", action: "click", data: {} },
  "LSC": { category: "link", object: "search", action: "click", data: {} },
  "BCCR": { category: "button", object: "carousel", action: "click", data: { direction: 'right'} },
  "BCCL": { category: "button", object: "carousel", action: "click", data: { direction: 'left'} },
  "ICC": { category: "image", object: "carousel", action: "click", data: {} },
  "IGC": { category: "image", object: "gallery", action: "click", data: {} },
  "BSCF": { category: "button", object: "social_icon", action: "click", data: { destination: 'facebook'} },
  "BSCT": { category: "button", object: "social_icon", action: "click", data: { destination: 'twitter'} },
  "BSCA": { category: "button", object: "social_icon", action: "click", data: { destination: 'add_this'} },
  "ISC": { category: "image", object: "screen", action: "click", data: {} }
};

////MILYONI SDK - ENGAGEMENTS & CHAT
////Post to: http://m-dna.herokuapp.com/interactions
//
//blah = {
//  'EOV': { category: "engagement", object: "[ENG TYPE]", action: "view", data: {media_id: "[MEDIA ID]", engagement_id: "[ENG ID]"}},
//  'EOC': {category: "engagement", object: "[ENG TYPE]",  action: "click", data: {media_id: "[MEDIA ID]", engagement_id: "[ENG ID]"}},
//  'EOS': {category: "engagement", object: "[ENG TYPE]", action: "share", data: {media_id: "[MEDIA ID]", engagement_id: "[ENG ID]", destination: "WHICH SOCIAL NETWORK"}}
//Engagement Share Click: {category: “engagement”, object: "share", action: “click”, data: {media_id: [MEDIA ID], engagement_id: [ENG ID]}}
//Engagement Carousel: {category: “engagement”, object: "carousel", action: “click”, data: {media_id: [MEDIA ID], direction: "RIGHT or LEFT"}}
//Engagement Opengraph: {category: “opengraph”, object: [ENG TYPE], action: “share”, data: {media_id: [MEDIA ID], engagement_id: [ENG ID], destination: "facebook"}}
//
//CHAT
//Chat View: {category: “chat”, object: [live, annotated, comments], action: “view”, data: {media_id: [MEDIA ID], chat_id: [CHAT ID]}}, #GOOD FOR POLLING IF NO POLLING THEN DISREGARD
//Chat Click: {category: “chat”, object: "input", action: “click”, data: {media_id: [MEDIA ID]}},
//Chat Scroll: {category: “chat”, object: "live", action: “scroll”, data: {media_id: [MEDIA ID], direction: "RIGHT or LEFT"}},
//Chat Opengraph: {category: “opengraph”, object: "chat", action: “share”, data: {media_id: [MEDIA ID], chat_id: [CHAT ID], destination: "facebook"}},
//Chat Submit: {category: “chat”, object: "input", action: “submit”, data: {media_id: [MEDIA ID], chat_id: [CHAT ID]}},
//Chat Share: {category: “chat”, object: "message", action: “share”, data: {media_id: [MEDIA ID], chat_id: [CHAT ID], destination: "WHICH SOCIAL NETWORK"}},
//
//
//};