console.log("Upload.js file loaded");
$('#uploadForm').submit(function(event) {
  event.preventDefault();      
  var file = document.getElementById('userPhoto').files[0];
  console.log("file",file);      
  var check = checkfile(file.name);
  console.log("check",check);
  if(check){
   $("#status").empty().text("File is uploading...");

      $(this).ajaxSubmit({

          error: function(xhr) {
              status('Error: ' + xhr.status);
          },

          success: function(response) {
        console.log(response)
        $("#status").empty().text(response);
          }
    });        
  }else{
     $("#status").empty().text("Please select valid File...");
  }
  return false;
});

// working code for send excell-sheet
function checkfile(sender) {
  console.log("sender", sender);
  var validExts = new Array(".xlsx", ".xls", '.csv');
  // var fileExt = sender.value;
  var fileExt = sender;
  fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
  if (validExts.indexOf(fileExt) < 0) {
    // alert("Invalid file selected, valid files are of " +
    //          validExts.toString() + " types.");
    // swal({
    //   title: "Cancelled",
    //   text: "Invalid file selected, valid files are of " + validExts.toString() + " types.",
    //   type: "error"
    // });
    return false;
  } else return true;
};