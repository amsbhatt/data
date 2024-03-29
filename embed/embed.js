(function (){
  DNA = {};
  DNA.manifest = manifest;
  //User id information if present
  DNA.registerUser = {
    uid: "892",
    suid: "100002407031588",
    uat: "CAACEdEose0cBADZBZCuuQ6CzKf4zskPZC2ZBasPZCJ7pi7U8IoKtLq9VcZBnbhx19TFvMK5CT48Ay4TZAfNm6hDhMWlvi33NNTwGZBzN9uMUFA2kRnlFD3p0EZCUOTOo4Q9HfN3lrfGZBKodDdlOJBwnrzgXe10xEr7PZB1r8Dgth3yjzexxqnAlQhYOUOXe1501ugZD"
  };
  //Initialize for 'Click' interactions capture
  DNA.initialize = function(){
    $.each($('[data-dna-interaction]'), function(index , el){
      var dataValues = {}
      $.each($(el).data(), function(key, value) {
        if (!!key.match('dna')) {
          dataValues[key] = value
        }
      });
      var interaction = dataValues.dnaInteraction;
      var interactionType = DNA.manifest[interaction]["action"];
      if(interactionType === "click"){
        $(el).bind("click", function(){
          DNA.createInteraction($.extend(DNA.manifest[interaction], {
            media_id: 123
          }), $.extend(DNA.manifest[interaction].data, dataValues))
        })
      }
    })
  };
  //Visit interactions
  $(document).ready(function(){
    DNA.createInteraction(DNA.manifest['PGV']);
    DNA.initialize();
  });
  DNA.createInteraction = function(data){
    $.ajax("/interactions", {
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      },
      type: 'POST',
      data: $.extend(data, {created_at: new Date().toISOString(), userInfo: DNA.registerUser})});
  }
})();