/* 
HTML5 jQuery Upload Plugin v0.1
Developed By Ken Day
http://www.html5plugin.com
Created: August 2013
*/

jQuery.fn.html5Upload = function(settings){

    // settings
    var config = {
        'drop_area' : $(".drop_area"),
        'uploadFile' : "/var/www/html/upload.php",
        'uploadDir' : "uploads",
        'showProgress' : false,
        'maxUploadSize' : 20480, // 20MB
        'maxUploads' : false,
        'async' : true
    };

    // merge/overwrite settings from function params
    if (settings){
    	$.extend(config, settings);
    }

    // assign the vars we need to do the upload
    var dropArea       = config.drop_area;
    var destinationUrl = config.uploadFile;
    var maxUploadSize  = config.maxUploadSize;
    var maxUploads     = config.maxUploads;
    var uploadDir      = config.uploadDir;
    var async          = config.async;
    var totalSize      = 0;
    var totalProgress  = 0;

    // div to show file info and progress
    var fileInfoDiv    = $("<div/>").attr("class", "fileinfo");
    $(this).append(fileInfoDiv);

    // event listeners
    dropArea[0].addEventListener('drop', handleDrop, false);
    dropArea[0].addEventListener('dragover', handleDragOver, false);
    dropArea[0].addEventListener('dragleave', handleDragOut, false);

    // drag over
    // user has dragged items over our container
    // indicate to the user that they dragged over the container by 
    // showing the 'hover' css class
    function handleDragOver(event) {
       event.stopPropagation();
       event.preventDefault();
       dropArea.addClass("hover");
    }

    // drag out
    // User has dragged off of our drag container 
    // indicate to the user they they did by removing
    // the 'hover' css class
    function handleDragOut(event) {
        event.stopPropagation();
        event.preventDefault();
        dropArea.removeClass("hover");
    }

    // drag drop
    // User has dropped filed inside of our drop container
    // accept the files and being to process them
    function handleDrop(event) {
        event.stopPropagation();
        event.preventDefault();
        dropArea.removeClass("hover");
        processFiles(event.dataTransfer.files);
    }
    
    
     // process a bunch of files
    function processFiles(filelist) {

      // loop through each file indivually
      // add some DOM elements so we can keep track of each file 
      // check the file size to make sure it's not too big
      // If everything complies, send the AJAX request to upload.
      var numFilesAllowed = (!maxUploads || filelist.length < maxUploads) ? filelist.length : maxUploads;

      for(i=0; i<numFilesAllowed; i++)
      {

        totalProgress  = 0;

        var fileInfoDivDetails    = $("<div/>").attr("class", "fileDetails fileDetails" + i);
        fileInfoDiv.append(fileInfoDivDetails);

        // assign some vars from our filelist object
        var filename    = filelist[i].name;
        var filesize    = filelist[i].size;
        var filemoddate = filelist[i].lastModifiedDate;

        // create some DOM elements with the above var values
        var fileNameDiv =  $("<div/>").attr("class", "fileName")
                            .html(filename);
        var filesizeDiv =  $("<div/>").html(filesize);
        var statusDiv   =  $("<div/>").attr("class", "status"+i);

        // Add the new element to the DOM
        fileInfoDivDetails.append(fileNameDiv);
        fileInfoDivDetails.append(filesizeDiv);
        fileInfoDivDetails.append(statusDiv);

        // check if our file is not too big
        if (filesize > maxUploadSize)
        {
          $(".status"+i).html("Error: File is over the max file size allowed");
        }
        else 
        {
          // the file size is ok, so we can beging to upload the file
          uploadFile(filelist[i], i); 
        }
      }
    }// end processFiles


    // actually upload the file
    function uploadFile(file, index) 
    {

        var status    = $(".status" + index);
        var fileDiv   = $(".fileDetails" + index);

        var progress_div = $("<div>").
                                attr("class", "upload_progress upload_progress" + index);

        var progress_percent = $("<div>").
                                attr("class", "upload_percent upload_percent" + index);

        fileDiv.append(progress_div);
        progress_div.append(progress_percent);      

        var fileSize  = file.size;
        totalProgress = 0;

        // prepare XMLHttpRequest
        var xhr = new XMLHttpRequest();
        xhr.open('POST', destinationUrl, async);

        xhr.onload = function() {

            var data = $.parseJSON(this.responseText);
           
            if (this.status != "200") 
            {
                //$(".progress_content").addClass("hide");
                status.html("A " + this.status + " error occured. Try again!");
            }
           
            if (data.status == "error") 
            {
                //$(".progress_content").addClass("hide");
                status.html("Error. " + data.message + " Try again!");
            }
            else 
            {
                // done - no errors
            }
            handleComplete(fileSize, status, index);
        };

        xhr.onerror = function() 
        {
            //handleComplete(fileSize, status, index);
        }

        xhr.upload.onprogress = function(event){
           handleProgress(event, status, fileSize, index);
        }

        xhr.upload.onloadstart = function(event) 
        {

        }
        
        // prepare FormData and send the upload details
        var formData = new FormData();  
        formData.append('myfile', file); 
        formData.append('uploadDir', uploadDir); 
        xhr.send(formData);
        
    }
     // on complete - start next file
    function handleComplete(size, status, index) {
        console.log("completed");
        drawProgress(1, status);
    }

    // update progress
    function handleProgress(event, status, fileSize, index) 
    {
        var progress = totalProgress + event.loaded;
        drawProgress((progress / fileSize), status, index);
    }
    
    // draw progress
    function drawProgress(progress, status, index) 
    {   
        status.html(Math.floor(progress * 100) + '% completed');
        $(".upload_percent" + index).css("width", Math.floor(progress * 100) + "%");
    }
};

