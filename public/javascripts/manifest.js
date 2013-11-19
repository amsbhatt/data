var urlPath = window.location.href;
var trackingRegex = urlPath.match(/(t=|tracking_id=)([^&]*)/);
var trackingId = trackingRegex && trackingRegex[2];
var userAgent = navigator.userAgent;
var appVersion = function() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
   return 'mobile';
  } else {
   return 'desktop';
  }
};

//Set default data here
defaultData = {
  tracking_id: trackingId, user_agent: userAgent, app_version: appVersion, url: urlPath
};

//Define interaction custom data below.
manifest = {
  "BLC": {category: "button", object: "hello_link", action: "click", data: {destination: 'yourFace'}},
  "PGV": {category: "page", object: "gallery", action: "visit", data: {}}
};