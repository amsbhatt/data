(function (){
  var DNA = {};
  DNA.setting = {};
  DNA.manifest = {
    "ABC":{object:"button" , action:"click"}
  };
  DNA.initialize = function(){
    $('[data-interaction]').forEach(function(el){
      var interactionType = DNA.manifest[el.data("interaction")]["action"];
      if(interactionType === "click"){
        el.bind("click", function(){
          DNA.createInteraction( DNA.manifest[el.data("interaction")]);
        })
      }
    })
  };
  DNA.createInteraction = function(data){
    $.post("http://localhost:3000/interactions", data);
  }
})();