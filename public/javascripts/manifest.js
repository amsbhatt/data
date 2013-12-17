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
//blah = {
//  'WEV': {category: "widget", object: "engagement", action: "view", data: {media_id: "[MEDIA ID]"}},
//  'EV': {category: "impression", object: "engagement", action: "view", data: {media_id: "[MEDIA ID]", engagement_id: "[ENG ID]"}},
//  'EC': {category: "engagement", object: "[ENG TYPE]",  action: "click", data: {media_id: "[MEDIA ID]", engagement_id: "[ENG ID]"}},
//  'EA': {category: "engagement", object: "POLL or TRIVIA",  action: "answer", data: {media_id: "[MEDIA ID]", engagement_id: "[ENG ID]", engagement_answer_id: "[EA ID]"}},
//  'ES': {category: "engagement", object: "[ENG TYPE]", action: "share", data: {media_id: "[MEDIA ID]", engagement_id: "[ENG ID]", destination: "WHICH SOCIAL NETWORK"}},
//  'ESC': {category: "engagement", object: "share", action: "click", data: {media_id: "[MEDIA ID]", engagement_id: "[ENG ID]"}},
//  'ECC': {category: "engagement", object: "carousel", action: "click", data: {media_id: "[MEDIA ID]", engagement_id: "[ENG ID]", direction: "RIGHT or LEFT"}},
//  'EOS': {category: "opengraph", object: "[ENG TYPE]", action: "share", data: {media_id: "[MEDIA ID]", engagement_id: "[ENG ID]", destination: "facebook"}},
////CHAT
//  'WCV': {category: "widget", object: "chat", action: "view", data: {media_id: "[MEDIA ID]"}},
//  'TCC': {category: "text_field", object: "chat", action: "click", data: {media_id: "[MEDIA ID]"}},
//  'SCC': {category: "scroll", object: "chat", action: "click", data: {media_id: "[MEDIA ID]", direction: "UP or DOWN"}},
//  'OCS': {category: "opengraph", object: "chat", action: "share", data: {media_id: "[MEDIA ID]", chat_id: "[CHAT ID]", destination: "facebook"}},
//  'TCS': {category: 'text_field', object: "chat", action: "submit", data: {media_id: "[MEDIA ID]", chat_id: "[CHAT ID]"}},
//  'MCS': {category: 'message', object: "chat", action: "share", data: {media_id: "[MEDIA ID]", chat_id: "[CHAT ID]", destination: "WHICH SOCIAL NETWORK"}},
////VIDEO
//  'OWS': {category: 'opengraph', object: 'watch', action: 'share', data: {media_id: "[MEDIA_ID]", destination: "facebook"}},
//  'PS': {category: 'player', object: 'watch', action: 'click', data: {media_id: "[MEDIA_ID]"}},
////LOGIN
//  'LOC': {category: 'login', object: 'oauth', action: 'click', data: {media_id: "[MEDIA_ID]", destination: "WHAT PORTAL"}},
//  'LTOC': {category: 'logout', object: 'oauth', action: 'click', data: {media_id: "[MEDIA_ID]", destination: "facebook"}},
////AVATAR
//  'WAV': {category: 'widget', object: 'avatar', action: 'view', data: {media_id: "[MEDIA_ID]"}},
//  'TAC': {category: 'button', object: 'activity_feed', action: 'click', data: {media_id: "[MEDIA_ID]", state: "ON or OFF"}},
//  'TSC': {category: 'button', object: 'auto_post', action: 'click', data: {media_id: "[MEDIA_ID]", state: "ON or OFF"}}
//};