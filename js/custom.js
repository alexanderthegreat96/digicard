$(document).ready(function () {

    /**
     * Load images for the first time
     */

    loadImages();


    /**
     * Generate token on body load
     */

    generateCsrfToken();

    // /**
    //  * Generate a new CSRF Token
    //  * every 10 mins
    //  */
    //
    // setInterval(generateCsrfToken, 600000);


    /**
     * gets the defined app settings
     */

    /**
     *
     * @returns {Promise<unknown>}
     */
    function get_app_settings()
    {
        return new Promise((resolve, reject) => {
            $.get("php/get_app_settings.php", function(response) {
                try {
                    const data = JSON.parse(response);

                    if (data.status) {
                        if (data.settings) {
                            resolve(data.settings);
                        } else {
                            load_default_settings()
                                .then(resolve)
                                .catch(reject);
                        }
                    } else {
                        reject("Error in app settings response.");
                    }
                } catch (error) {
                    // Handle parsing error
                    reject("Error parsing app settings response.");
                }
            });
        });

    }

    function generateCsrfToken() {
        $.get("php/csrf.php", function(response) {
            let data = null;
            try {
                data = JSON.parse(response);
                if (data.status) {
                    $("#csrf_token").val(data.token);
                }
            } catch (error) {
            }
        });
    }


    /**
     * Load image in series
     */

    function loadNextImage(imageUrls, imageGrid, currentImage) {
        if (currentImage >= imageUrls.length) {
            return; // All images loaded
        }

        var imageUrl = imageUrls[currentImage];
        var imageElement = new Image();

        var loadingAnimation = `
        <div class="column" style="flex: 33.3%;">
            <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    `;
        var $loadingAnimation = $(loadingAnimation);
        var $imageContainer = $('<div class="column" style="flex: 33.3%;"></div>');

        // Attach click event to select image and open modal
        $imageContainer.click(function() {
            openModal(imageUrl);
        });

        imageGrid.append($imageContainer.append($loadingAnimation));

        $(imageElement).on('load', function() {
            var gridItem = `
            <div class="column" style="flex: 33.3%;">
                <img src="${imageUrl}" class="loadedImage img-thumbnail" alt="Image">
            </div>
        `;
            $loadingAnimation.replaceWith(gridItem);

            // Load the next image
            loadNextImage(imageUrls, imageGrid, currentImage + 1);
        });

        $(imageElement).on('error', function() {
            // Handle error loading image
            loadNextImage(imageUrls, imageGrid, currentImage + 1);
        });

        imageElement.src = imageUrl;
    }
    /**
     * Loads / reloads all images
     */

    function loadImages() {
        $.get("php/load_images.php", function(imageUrls) {
            var imageGrid = $("#imageGrid");
            var totalImages = imageUrls.length;
            var currentImage = 0;

            if (totalImages === 0) {
                imageGrid.append('<div class="text-center alert alert-warning mt-4"><i class="fa-solid fa-magnifying-glass"></i> Nu s-au găsit imagini</div>');
            } else {
                // Start loading the first image
                loadNextImage(imageUrls, imageGrid, currentImage);
            }
        });
    }


    /**
     * Reload images
     */

    $("#refreshImages").click(function() {
        $("#imageGrid").empty();
        loadImages();
    });

    /**
     * Launches Image Editor Modal
     * @param imageUrl
     */

    function openModal(imageUrl) {

        var modal = $("#myImageModal");
        var modalImage = $("#modalImage");
        var textOverlay = $("#textOverlay");
        var textArea = $("#textArea");
-
        modalImage.attr("src", imageUrl);
        textArea.val("");

        let enable_editor = true;
        let enable_image_class = "loadedImage";

        get_app_settings()
            .then(function(settings) {

                if (settings.enable_image_editor === false) {
                    enable_editor = false;
                }

                modal.modal("toggle");

                /**
                 * Image maker stuff
                 * */

                if(enable_editor) {
                    $('#imageMakerContainer').remove();
                    $('#myImageModal .modal-body').append('<div id="imageMakerContainer"><div id="imageMaker"></div></div>');
                    $('#imageMaker').imageMaker({
                        text_boxes_count: 1,
                        merge_image_thumbnail_width: 'auto',
                        merge_image_thumbnail_height: 50,
                        template_thumbnail_width: 50,
                        template_thumbnail_height: 50,
                        templates: [{'url': imageUrl, 'title': 'Imagine Selectata'}],
                        i18n: {
                            fontFamilyText: 'Alege font',
                            shadowText: 'Umbra',
                            enterTextText: 'Introdu textul',
                            topText: 'Text Deasupra',
                            bottomText: 'Text Dedesupt',
                            sizeText: 'Dimensiune',
                            uperCaseText: 'Litera mare',
                            addTemplateText: 'Adauga template',
                            imageGeneratorText: 'Salveaza modificari',
                            addTextBoxText: 'Adauga text'
                        },
                        downloadGeneratedImage: false,
                        onGenerate: function(data, formData) {
                            // Handle the onGenerate event here
                            // You can customize the behavior when generating the image
                            $.ajax({
                                type: 'POST',
                                url: 'php/save_image.php',
                                data: formData,
                                processData: false,
                                contentType: false,
                                success: function(data) {
                                    try {
                                        var result = $.parseJSON(data);
                                        if (result.status === true) {
                                            appendImageToForm(result.image);
                                        } else {
                                            fireInfoModal(result.error, 'error');
                                        }
                                    } catch (e) {
                                        fireInfoModal('Backend-ul nu a raspuns cum trebuie.', 'error');
                                    }

                                },
                                complete: function() {},
                                error: function(jqXHR, textStatus, errorThrown) {
                                    if (jqXHR.status === 404) {
                                        // Handle not found (404) error
                                        fireInfoModal('Eroare: Nu s-a putut accesa backend-ul.', 'error');
                                    } else if (jqXHR.status === 500) {
                                        // Handle internal server error (500) error
                                        fireInfoModal('Eroare interna de server.', 'error');
                                    } else {
                                        // Handle other error cases
                                        fireInfoModal('A aparut o eroare: ' + errorThrown, 'error');
                                    }
                                },
                            });
                        },
                        alterFontFamilies: function(All_FontFamilies) {
                            All_FontFamilies.push('Roboto');
                            All_FontFamilies.push('Scriptin');
                            All_FontFamilies.push('Scripalt');
                            All_FontFamilies.push('AlexBrush');
                            All_FontFamilies.push('GreatVibes');
                        },
                        alterTextInfo: function(text_info) {
                            text_info.fontFamily = 'AlexBrush';
                            text_info.text = 'Salutari din Bucovina!';
                            text_info.toUpperCase = false;
                        },
                    });

                } else {
                    $("#modalImage").show();
                    $(".trigger-save-image").removeClass('trigger-save-image').addClass('trigger-save-image-basic').attr('data-bs-dismiss', 'modal');
                    $(".trigger-save-image-basic").on('click', function () {
                        appendUploadedImageToForm(imageUrl);
                        $("#myImageModal").modal('toggle');
                    });
                }

            })
            .catch(function(error) {
                console.log("Error:", error);
            });


        /**
         * Not proud of this but
         * boostrap doesn't want to close
         * it's own modal for some reason
         * */

        var spanClose = $(".close-btn")[0];
        if (spanClose) {
            spanClose.onclick = function () {
                $("." + enable_image_class).removeClass("border border-danger border-3");
                modal.css("display", "none");
            };
        }

        var span = $(".close")[0];
        if (span) {
            span.onclick = function () {
                $("." + enable_image_class).removeClass("border border-danger border-3");
                modal.css("display", "none");
            };
        }

        window.onclick = function (event) {
            if (event.target === modal[0]) {
                modal.css("display", "none");
            }
        };


        /**
         * Handle image clicking
         * */


        $(document).on("click", ".loadedImage", function () {
            $("." + enable_image_class).removeClass("border border-danger border-3");
            $(this).addClass("border border-danger border-3");
        });

    }



    $(".trigger-save-image").on("click", function (){
        $(".generate_meme").trigger("click");
    });

    /**
     * Append genereated data
     * @param image
     */

    function appendImageToForm(image) {
        if (image !== "") {
            $("#generated-image").empty();

            htmlToAppend = '';
            htmlToAppend += '<div class="form-group">';
            htmlToAppend += '<b><label>Atasament:</label></b>';
            htmlToAppend += '<p><img src="generated_images/'+image+'" style="object-fit: contain: width: 50%" class="img-thumbnail"/></p>';
            htmlToAppend += '<input type="hidden" readonly="" value="'+image+'" class="form-control form-control-sm"/>';
            htmlToAppend += '</div>';

            $('#generated_image_filename').val(image);

            $("#generated-image").append(htmlToAppend);

            $(".generated-image-div").show();
            var imageModal = $("#myImageModal");
            imageModal.modal("toggle");
        }
    }

    /**
     *
     * @param image
     */
    function appendUploadedImageToForm(image) {
        if (image !== "") {
            $("#generated-image").empty();

            htmlToAppend = '';
            htmlToAppend += '<div class="form-group">';
            htmlToAppend += '<b><label>Atasament:</label></b>';
            htmlToAppend += '<p><img src="'+image+'" style="object-fit: contain: width: 50%" class="img-thumbnail"/></p>';
            htmlToAppend += '<input type="hidden" readonly="" value="'+image.split('/').pop()+'" class="form-control form-control-sm"/>';
            htmlToAppend += '</div>';

            $('#generated_image_filename').val(image.split('/').pop());
            $("#generated-image").append(htmlToAppend);

            $(".generated-image-div").show();
            var imageModal = $("#myImageModal");
            imageModal.modal("toggle");
        }
    }

    function isValidEmail(email) {
        // Regular expression for email validation
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailPattern.test(email);
    }

    function validateInputs(inputIds) {
        let proceed = true;
        inputIds.forEach(function (inputId) {
            var inputElement = document.getElementById(inputId);

            if (inputElement && inputElement.value.trim() === "") {
                inputElement.classList.add("border", "border-danger");
                proceed = false;
            } else {
                inputElement.classList.remove("border", "border-danger");
            }
        });

        return proceed;
    }

    /**
     * Handle contact form
     */
    function submitCardForm() {

        $("#sendMailFormResult").empty();

        let name = $("#send_to_name").val();
        let email = $("#send_to_email").val();
        let body = $("#send_to_body").val();
        let subject = $("#send_to_subject").val();
        let from = $("#send_from_name").val();
        let image = $("#generated_image_filename").val();
        let csrf_token = $("#csrf_token").val();

        let terms_check = $("#terms_check").val();


        let proceed = validateInputs(['send_to_name', 'send_to_email', 'send_to_subject','send_to_body', 'send_from_name', 'terms_check']);

        if (proceed) {

            /**
             * check if the image was selected
             */

            if (isValidEmail(email)) {
                if ($("#terms_check").prop('checked')) {
                    if (image !== "") {
                        $.ajax({
                            type: "POST",
                            url: "php/send_mail.php",
                            data:  {
                                csrf_token: csrf_token,
                                from_name: from,
                                to_name: name,
                                to_email: email,
                                message: body,
                                image: image,
                                subject: subject
                            },
                            dataType: "text", // Set the expected data type as text
                            beforeSend: function (response) {
                                $("#sendMailFormResult").append('<div class="alert alert-info">Se trimite...</div>');
                            },
                            success: function(response) {

                                $(".loadedImage").removeClass('border-danger');

                                $("#sendMailFormResult").empty();

                                $("#send_to_name").val(null);
                                $("#send_from_name").val(null);
                                $("#send_to_email").val(null);
                                $("#send_to_body").val(null);
                                $("#send_to_subject").val(null);
                                $("#generated_image_filename").val(null);
                                $("#generated-image").empty();
                                $("#terms_check").prop('checked', false);

                                try {
                                    var data = JSON.parse(response);

                                    if (data.status === true) {
                                        if (data.new_token) {
                                            $("#csrf_token").val(data.new_token);
                                        }

                                        $("#sendMailFormResult").append('<div class="alert alert-success">Mailul a fost trimis cu succes.</div>');
                                    } else {

                                        $("#sendMailFormResult").append('<div class="alert alert-danger">'+data.error+'</div>');
                                    }
                                } catch (error) {
                                    $("#sendMailFormResult").append('<div class="alert alert-warning">Backend Error: '+error.message+'</div>"');
                                }
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                if (jqXHR.status === 404) {
                                    // Handle not found (404) error
                                    $("#sendMailFormResult").append('<div class="alert alert-warning">Backend Error: Send Mail callback not found.</div>');
                                } else if (jqXHR.status === 500) {
                                    // Handle internal server error (500) error
                                    $("#sendMailFormResult").append('<div class="alert alert-warning">Backend Error: 500, eroare interna de server.</div>');
                                } else {
                                    // Handle other error cases
                                    $("#sendMailFormResult").append('<div class="alert alert-warning">Backend Error: '+errorThrown+'</div>');
                                }
                            },
                        });
                    } else {
                        $("#sendMailFormResult").append('<div class="alert alert-warning">Trebuie sa alegi o imagine mai intai!</div>');
                    }
                } else {
                    $("#sendMailFormResult").append('<div class="alert alert-warning">Trebuie sa fii de acord cu termenii si conditiile!</div>');
                }

            } else {
                $("#send_to_email").removeClass("border-danger");
                $("#send_to_email").addClass("border-danger");
            }

        }

    }

    /**
     * Toggle form submission
     */

    $("#submitCardForm").click(function() {
        submitCardForm();
    });

    /**
     * Handle  info modal
     */

    function fireInfoModal(message, type) {
        let div_class = "alert-info";

        if (type === "error") {
            div_class = "alert-danger";
        }

        $("#message-content").empty();
        $("#message-content").append('<div class="alert '+div_class+'">'+message+'</div>');
        $("#noticeModal").modal("toggle");
    }
    /**
     *
     * @param inputString
     * @returns {*}
     */
    function remove_profanity(inputString) {
        let profanity = [
            'pula',
            'cur',
            'tate',
            'pizda',
            'muie',
            'mata',
            'bou',
            'vaca',
            'idiot',
            'cacat',
            'retard',
            'retardat',
            'laba',
            'curva',
            'pulă',
            'cur',
            'țâțe',
            'pizdă',
            'muie',
            'mătă',
            'bou',
            'vacă',
            'idiot',
            'căcat',
            'retard',
            'retardat',
            'laba',
            'curvă',
            'handicapat',
            'fut',
            'futere',
            'futelniță',
            'jegos',
            'homosexual',
            'homalau',
            'homo',
            'gay',
            'lesbian',
            'fuck',
            'motherfucker',
            'bastard',
            'bitch',
            'bloody',
            'bollocks',
            'brotherfucker',
            'bugger',
            'bullshit',
            'fag',
            'dyke',
            'shit',
            'hell',
            'sugi'
        ];

        let regex = new RegExp('\\b(' + profanity.join('|') + ')\\b', 'gi');
        return inputString.replace(regex, '');
    }

    /**
     * Profanity removal
     */

    $("#send_from_name").on('change keyup', function () {
        let value = remove_profanity($(this).val());
        $("#send_from_name_text").text(", " + value);
        $('#send_from_name').val(value);
    });

    $("#send_to_name").on('change keyup', function () {
        let value = remove_profanity($(this).val());
        $("#send_to_name_text").text(" " + value);
        $('#send_to_name').val(value);
    });


    $("#send_to_email").on('change keyup', function () {
        let value = remove_profanity($(this).val());
        $('#send_to_email').val(value);
    });

    $("#send_to_subject").on('change keyup', function () {
        let value = remove_profanity($(this).val());
        $('#send_to_subject').val(value);
    });

    $("#send_to_body").on('change keyup', function () {
        let value = remove_profanity($(this).val());
        $('#send_to_body').val(value);
    });
});