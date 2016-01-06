angular.module("sportsStoreAdmin")
.directive('ngConfirmClick', [
        function(){
            return {
                link: function (scope, element, attr) {
                    var msg = attr.ngConfirmClick || "Are you sure?";
                    var clickAction = attr.confirmedClick;
                    element.bind('click',function (event) {
                        if ( window.confirm(msg) ) {
                            scope.$eval(clickAction)
                        }
                    });
                }
            };
}])
.directive('fileFeed', [
        function() {
            return {
                restrict: 'A',
                require: 'ngModel',
                scope: {model:'=',error:'='},
                link: function(scope, element, attributes, controller) {
                    element.bind("change", function(changeEvent) {
                        var files = [];
                        scope.model = [];
                        scope.error = null;
                        if (element[0].files.length > 4){
                            scope.error="Toomuch";
                            scope.$apply();
                        }
                        else{
                            for (var i = 0; i < element[0].files.length; i++) {
                                files.push(element[0].files[i]);
                                if (element[0].files[i].size > 1048576){
                                    scope.error="Toomuch1mb";
                                    scope.$apply();
                                }
                                if (element[0].files[i].type.indexOf("image/") !== 0){
                                    scope.error="Type";
                                    scope.$apply();
                                }
                            }
                            if (scope.error == null){
                                fileUploading(0,files[0],files);
                            }
                            /*scope.$apply(function(){
                                controller.$modelValue = files;
                            });*/
                            scope.$apply();
                        }
                        
                    
                    });
                    var fileUploading = function(number,file,files){
                        var error = 0;
                        console.log(file);
                        if (file != undefined){
                            if(!file.type.match('image.*')) {
                                $("#drop-box").html("<p> Images only. Select another file</p>");
                                error = 1;
                            }else if(file.size > 1048576){
                                $("#drop-box").html("<p> Too large Payload. Select another file</p>");
                                error = 1;
                            }else{
                                data = new FormData();
                                data.append('image', file, file.name);
                                if(!error){
                                    var xhr = new XMLHttpRequest();
                                    xhr.open('POST', 'upload.php', true);
                                    xhr.send(data);
                                    xhr.onload = function () {
                                        if (xhr.status === 200) {
                                            console.log(xhr.responseText);
                                            scope.model.push(xhr.responseText);
                                            fileUploading(++number,files[number],files);
                                            $("#drop-box").html("<p> File Uploaded. Select more files</p>");
                                        } else {
                                            $("#drop-box").html("<p> Error in upload, try again.</p>");
                                        }
                                    };
                                }
                            }           
                        }
                        else{
                            scope.$apply();
                        }
                    }
                }
            };
        }
    ]);