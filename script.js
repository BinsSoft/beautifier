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
var resultText ='';
var renderError = function(text) {
	$(".err-panel")
		.html(text)
		.slideDown('slow');
	setTimeout(function(){
		$(".err-panel").slideUp();
	},3000)
}
$(function(){
	$(".upload-file-control").click(function(){
		var selectFileType = $('input[name=texttype]:checked').val();
		if(selectFileType == undefined) {
			renderError('Please Select Any Of File Type');
			return false;
		}
		
	})
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
				renderError("Please select any file with ext "+selectFileType+" or change the option");
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
				renderError("Please select any file with ext "+selectFileType+" or change the option");
				return false;
			}
		    
		}
	})

	$(".modifyBtn").click(function(){
		
		//try {
			const fileType = $('input[name=texttype]:checked').val();
			if (fileType == undefined) {
				renderError("Please select any file type.");
				return false;
			}
			$(".downloadBtn").attr("data-type", $(this).attr('data-type'));

			if ($(this).attr('data-type') == 'beautify') {
				resultText = $(".minifierContainer").val();
			} else if($(this).attr('data-type') == 'minify') {
				resultText = $(".beautifierContainer").val();
			}
			
			/* CSS */

			if (fileType == 'css') {
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

					   resultText =  css_beautify(resultText, default_opts);

				} else if($(this).attr('data-type') == 'minify') {

					resultText = cssmin(resultText,0);
				}
				

			}
			/* HTML */
			else if (fileType == 'html') {
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
				    resultText = html_beautify(resultText, default_opts);

				} else if($(this).attr('data-type') == 'minify') {

					resultText= resultText.replace(/>\s+</g,'><');
					
				}

			} 

			/* JS */
			else if (fileType == 'js') {
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
				    resultText = js_beautify(resultText, default_opts);

				} else if($(this).attr('data-type') == 'minify') {
					resultText = jsmin(resultText);
				}

			} 
			/* JSON */
			else if (fileType == 'json') {
				resultText = JSON.parse(resultText);
			
				if ($(this).attr('data-type') == 'beautify') {
					resultText = JSON.stringify(resultText, null, 4);
				} else if($(this).attr('data-type') == 'minify') {
					resultText = JSON.stringify(resultText, null, 0);
				}
			}
			
		/*} catch(err) {
			var resultText = err.message;
		}*/
		if ($(this).attr('data-type') == 'beautify') {
			$(".beautifierContainer").val(resultText);
		} else if($(this).attr('data-type') == 'minify') {
			$(".minifierContainer").val(resultText);
		}
		
		
	});

	$(".optionBtn input[type=radio]").click(function() {
		$(".optionBtn").removeClass("btn-danger");
		$(this).parents(".optionBtn").addClass("btn-danger");
	});

	$(".downloadBtn").click(function(){
		const fileType = $('input[name=texttype]:checked').val();
		const type = $(this).attr("data-type");
		if (fileType == undefined) {
			renderError("Please select any file type.");
			return false;
		} else if(type == undefined || resultText == '') {
			renderError("Please do any minify or beautify first");
			return false;
		}

		var fileName = "download";
		if ((fileType=='css' || fileType == 'js') && type == 'minify') {
			fileName +=".min";
		}
		fileName += "."+fileType;
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
		saveTextAsFile(resultText,filename,fileType[fType]);
		$("#downloadModal").modal("hide");
	})
});

