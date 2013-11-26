(function (){
  DNA = {};
  DNA.manifest = manifest;
  DNA.registerUser = null; //stub for user_id
  //Initialize for 'Click' interactions capture
  DNA.initialize = function(){
    $.each($('[data-interaction]'), function(index , el){
      var interaction = $(el).data()['interaction'];
      var interactionType = DNA.manifest[interaction]["action"];
      if(interactionType === "click"){
        $(el).bind("click", function(){
          DNA.createInteraction( DNA.manifest[interaction]);
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
      data: $.extend(data, {created_at: new Date().toISOString(), user_id: DNA.registerUser})});
  }
})();