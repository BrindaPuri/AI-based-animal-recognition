var d = document.getElementById("button");
d.addEventListener('click',function(){
    d.className = d.className + " move";
});


document.getElementById("folder").addEventListener("change", function(event) {
  var output = document.querySelector("ul");
  var files = event.target.files;

  for (var i=0; i<files.length; i++) {
    var item = document.createElement("li");
    item.innerHTHML = files[i].webkitRelativePath;
    output.appendChild(item);
  };
}, false);
