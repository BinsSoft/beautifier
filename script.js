String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function saveTextAsFile(downloadText,fileName,fileType)
{
    var textToWrite = downloadText; //Your text input;
    var textFileAsBlob = new Blob([textToWrite], {type:fileType});
    var fileNameToSaveAs = fileName;

    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null)
    {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else
    {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
       // downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}

var fileType = {};
fileType.css = 'text/css';
fileType.js = 'application/javascript';
fileType.html = 'text/html';
fileType.json = 'application/json';
var text ='';
$(function(){

	$("#minfiyfile").change(function() {
		var file = document.getElementById("minfiyfile").files[0];
		if (file) {
			var file_type = file.type ;
			var selectFileType = $('input[name=texttype]:checked').val();
			if (fileType[selectFileType] == file_type) {
				var reader = new FileReader();
			    reader.readAsText(file, "UTF-8");
			    reader.onload = function (evt) {
			        $(".minifierContainer").val( evt.target.result);
			    }
			    reader.onerror = function (evt) {
			        //document.getElementById("fileContents").innerHTML = "error reading file";
			    }
			} else {
				alert("Please select any file with ext "+selectFileType+" or change the option");
				return false;
			}
		    
		}
	})

	$("#beautyfile").change(function() {
		var file = document.getElementById("beautyfile").files[0];
		if (file) {
			var file_type = file.type ;
			var selectFileType = $('input[name=texttype]:checked').val();
			if (fileType[selectFileType] == file_type) {
				var reader = new FileReader();
			    reader.readAsText(file, "UTF-8");
			    reader.onload = function (evt) {
			        $(".beautifierContainer").val( evt.target.result);
			    }
			    reader.onerror = function (evt) {
			        //document.getElementById("fileContents").innerHTML = "error reading file";
			    }
			} else {
				alert("Please select any file with ext "+selectFileType+" or change the option");
				return false;
			}
		    
		}
	})

	$(".modifyBtn").click(function(){
		
		//try {
			$(".downloadBtn").attr("data-type", $(this).attr('data-type'));

			if ($(this).attr('data-type') == 'beautify') {
				text = $(".minifierContainer").val();
			} else if($(this).attr('data-type') == 'minify') {
				text = $(".beautifierContainer").val();
			}
			
			/* CSS */

			if ($('input[name=texttype]:checked').val() == 'css') {
				if ($(this).attr('data-type') == 'beautify') {
						
					 var default_opts = {
					        indent_size: 4,
					        indent_char: ' ',
					        preserve_newlines: true,
					        jslint_happy: false,
					        keep_array_indentation: false,
					        brace_style: 'collapse',
					        space_before_conditional: true,
					        break_chained_methods: false,
					        selector_separator: '\n',
					        end_with_newline: false
					    };

					   text =  css_beautify(text, default_opts);

				} else if($(this).attr('data-type') == 'minify') {

					text = cssmin(text,0);
				}
				

			}
			/* HTML */
			else if ($('input[name=texttype]:checked').val() == 'html') {
				if ($(this).attr('data-type') == 'beautify') {
					
					var default_opts = {
				        indent_size: 4,
				        indent_char: ' ',
				        preserve_newlines: true,
				        jslint_happy: false,
				        keep_array_indentation: false,
				        brace_style: 'collapse',
				        space_before_conditional: true,
				        break_chained_methods: false,
				        selector_separator: '\n',
				        end_with_newline: false
				    };
				    text = html_beautify(text, default_opts);

				} else if($(this).attr('data-type') == 'minify') {

					text= text.replace(/>\s+</g,'><');
					
				}

			} 

			/* JS */
			else if ($('input[name=texttype]:checked').val() == 'js') {
				if ($(this).attr('data-type') == 'beautify') {
					
					var default_opts = {
				        indent_size: 4,
				        indent_char: ' ',
				        preserve_newlines: true,
				        jslint_happy: false,
				        keep_array_indentation: false,
				        brace_style: 'collapse',
				        space_before_conditional: true,
				        break_chained_methods: false,
				        selector_separator: '\n',
				        end_with_newline: false
				    };
				    text = js_beautify(text, default_opts);

				} else if($(this).attr('data-type') == 'minify') {
					text = jsmin(text);
				}

			} 
			/* JSON */
			else if ($('input[name=texttype]:checked').val() == 'json') {
				text = JSON.parse(text);
			
				if ($(this).attr('data-type') == 'beautify') {
					text = JSON.stringify(text, null, 4);
				} else if($(this).attr('data-type') == 'minify') {
					text = JSON.stringify(text, null, 0);
				}
			}
			
		/*} catch(err) {
			var text = err.message;
		}*/
		if ($(this).attr('data-type') == 'beautify') {
			$(".beautifierContainer").val(text);
		} else if($(this).attr('data-type') == 'minify') {
			$(".minifierContainer").val(text);
		}
		
		
	});

	$(".optionBtn input[type=radio]").click(function() {
		$(".optionBtn").removeClass("btn-danger");
		$(this).parents(".optionBtn").addClass("btn-danger");
	});

	$(".downloadBtn").click(function(){
		var type = $(this).attr("data-type");
		var fileName = "download";
		var fType = $('input[name=texttype]:checked').val();
		if ((fType=='css' || fType == 'js') &&type == 'minify') {
			fileName +=".min";
		}
		fileName += "."+fType;
		$("input[name=downloadfilename]").val(fileName);
		$("#downloadModal").modal("show");
			
	});

	$(".downloadMainBtn").click(function(){
		var fType = $('input[name=texttype]:checked').val();
		var filename = $("input[name=downloadfilename]").val();
		if (filename == '' ){
			alert("Please Enter any name");
			return false;
		}
		saveTextAsFile(text,filename,fileType[fType]);
		$("#downloadModal").modal("hide");
	})
});

