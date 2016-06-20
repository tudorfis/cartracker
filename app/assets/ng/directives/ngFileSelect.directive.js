define([], function(){
    return function(fileReader, $rootScope) {
        return {
            link: function(s, el, atts){
                el.bind("change", function(e){

                    s.getFile = function () {
                        s.progress = 0;
                        fileReader.readAsDataUrl(s.file, s)
                            .then(function(result) {
                                if (atts.tp && atts.ts) {
                                    if (atts.ir) {
                                        $rootScope[atts.tp][atts.ts] = result;
                                    } else {
                                        s[atts.tp][atts.ts] = result;
                                    }
                                } else {
                                    s.imageSrc = result;
                                }
                            });
                    };

                    s.$on("fileProgress", function(e, progress) {
                        s.progress = progress.loaded / progress.total;
                    });

                    s.file = (e.srcElement || e.target).files[0];
                    s.getFile();
                })
            }
        }
    }
});