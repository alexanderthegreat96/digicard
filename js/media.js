$(document).ready(function() {
    const uploaderModal = $('#uploaderModal');
    const imageInput = $('#imageInput');
    const uploadImagesBtn = $('#uploadImagesBtn');

    // Open modal when button is clicked
    $('#openUploaderModal').click(function() {
        uploaderModal.modal('show');
    });

    // Upload images when button in modal is clicked
    uploadImagesBtn.click(function() {

        $("#uploadResult").empty();

        const files = imageInput[0].files;
        if (files.length > 0) {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('images[]', files[i]);
            }


            $.ajax({
                url: '../php/upload_images.php',
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    try {
                        const jsonResponse = JSON.parse(response);

                        if (jsonResponse.success) {

                            $('#imageInput').val(null);

                            loadNewImages(jsonResponse.images);
                            uploaderModal.modal('hide');
                        } else {
                            $("#uploadResult").append('<div class="alert alert-danger">Nu s-au putut incarca fisierele.</div>');
                        }
                    } catch (error) {
                        console.error(error);
                        $("#uploadResult").append('<div class="alert alert-danger">A aparut o eroare la procesarea cererii.</div>');
                    }
                },
                error: function(xhr, status, error) {
                    console.error(error);
                    $("#uploadResult").append('<div class="alert alert-danger">A aparut o eroare in timpul uploadului.</div>');
                }
            });
        }
        else {
            $("#uploadResult").append('<div class="alert alert-warning">Nu ai ales fisiere.</div>');
        }
    });

    /**
     * Loads new images when uploading
     *
     * @param imageUrls
     */
    function basename(path) {
        return path.split('/').pop();
    }


    /**
     * Loads images after upload
     * @param imageUrls
     */
    function loadNewImages(imageUrls) {
        imageUrls.forEach(function(imageUrl) {
            const imageElement = new Image();
            const loadingAnimation = `
                <div class="col-12 col-md-3 col-lg-3 mb-3">
                    <div class="spinner-border text-primary" role="status">
                        <span class="sr-only">Se incarca...</span>
                    </div>
                </div>
            `;

            const $loadingAnimation = $(loadingAnimation);
            const $imageContainer = $('<div class="col-12 col-md-3 col-lg-3 mb-3"></div>');

            mediaContainer.prepend($imageContainer.append($loadingAnimation));

            $(imageElement).on('load', function() {

                const imageItem = `
                    <div class="text-center">
                        <img src="../default_images/${imageUrl}" style="width: 100%;" class="img-thumbnail loadedImage" alt="Image">
                        <p>
                            ${basename(imageUrl)}<br/>
                            ${imageElement.width} x ${imageElement.height} <br/>
                            <span id="fileSize_${imageUrl}"></span>
                        </p>
                        <button class="btn btn-outline-danger mt-2 w-100 delete-button" data-image="${basename(imageUrl)}">
                        <i class="fa-solid fa-trash-can"></i> Sterge</button>
                    </div>
                `;

                returnImageInfo(imageElement.src, (error, info) => {
                    if (error) {
                        console.error(error);
                    } else {
                        const fileSizeSpan = document.getElementById(`fileSize_${imageUrl}`);
                        if (fileSizeSpan) {
                            fileSizeSpan.textContent = `${info.sizeMB}`;
                        }
                    }
                });

                $loadingAnimation.replaceWith(imageItem);
            });

            $(imageElement).on('error', function() {
                // Handle error loading image
            });

            imageElement.src = imageUrl;
        });
    }

    const mediaContainer = $('#mediaContainer');
    const imagesPerPage = 10;
    let loading = false;
    let currentIndex = 0;

    /**
     * Initial Image Loading
     */
    loadImages();

    /**
     * Loads images on scroll
     */
    $(window).scroll(function() {
        if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100 && !loading) {
            loadImages();
        }
    });

    /**
     * Loads images
     */
    function loadImages() {
        loading = true;

        $.ajax({
            url: '../php/get_images.php',
            dataType: 'json',
            success: function(imageUrls) {
                const remainingImages = imageUrls.slice(currentIndex, currentIndex + imagesPerPage);

                if (remainingImages.length === 0 && currentIndex === 0) {
                    mediaContainer.append('<div class="text-center alert alert-warning"><i class="fa-solid fa-magnifying-glass"></i> Nu s-au gasit imagini.</div>');
                } else if (remainingImages.length === 0) {
                    // All images loaded
                    // mediaContainer.append('<div class="text-center alert alert-warning">Nu s-au gasit imagini</div>');
                } else {
                    loadNextImage(remainingImages, mediaContainer);
                }

                currentIndex += imagesPerPage;
                loading = false;
            },
            error: function(xhr, status, error) {
                console.error(error);
                loading = false;
            }
        });
    }

    /**
     *
     * @param bytes
     * @returns {string}
     */
    function bytesToMB(bytes) {
        const megabytes = bytes / (1024 * 1024);
        return megabytes.toFixed(2) + ' MB';
    }

    /**
     *
     * @param imagePath
     * @param callback
     */
    function returnImageInfo(imagePath, callback) {
        const image = new Image();
        image.src = imagePath;

        image.onload = function() {
            const xhr = new XMLHttpRequest();
            xhr.open('HEAD', imagePath, true);

            xhr.onload = function() {
                const contentLength = xhr.getResponseHeader('Content-Length');
                const imageSizeInBytes = parseInt(contentLength);
                const imageSizeInMB = bytesToMB(imageSizeInBytes); // Convert to MB

                const imageWidth = image.width;
                const imageHeight = image.height;

                const imageInfo = {
                    sizeBytes: imageSizeInBytes,
                    sizeMB: imageSizeInMB,
                    width: imageWidth,
                    height: imageHeight
                };

                callback(null, imageInfo);
            };

            xhr.onerror = function() {
                callback(new Error('Failed to fetch image information'));
            };

            xhr.send();
        };

        image.onerror = function() {
            callback(new Error('Failed to load image'));
        };
    }


    /**
     *
     * @param imageUrls
     * @param container
     */
    function loadNextImage(imageUrls, container) {
        imageUrls.forEach(function(imageUrl) {
            const imageElement = new Image();
            const loadingAnimation = `
                <div class="col-12 col-md-3 col-lg-3 mb-3">
                    <div class="spinner-border text-primary" role="status">
                        <span class="sr-only">Se incarca...</span>
                    </div>
                </div>
            `;

            const $loadingAnimation = $(loadingAnimation);
            const $imageContainer = $('<div class="col-12 col-md-3 col-lg-3 mb-3"></div>');

            container.append($imageContainer.append($loadingAnimation));

            $(imageElement).on('load', function() {

                const imageItem = `
                    <div class="text-center">
                        <img src="../default_images/${imageUrl}" style="width: 100%;" class="img-thumbnail loadedImage" alt="Image">
                        <p>
                            ${imageUrl}<br/>
                            ${imageElement.width} x ${imageElement.height} <br/>
                            <span id="fileSize_${imageUrl}"></span>
                        </p>
                        <button class="btn btn-outline-danger mt-2 w-100 delete-button" data-image="${imageUrl}">
                        <i class="fa-solid fa-trash-can"></i> Sterge</button>
                    </div>
                `;

                returnImageInfo(imageElement.src, (error, info) => {
                    if (error) {
                        console.error(error);
                    } else {
                        const fileSizeSpan = document.getElementById(`fileSize_${imageUrl}`);
                        if (fileSizeSpan) {
                            fileSizeSpan.textContent = `${info.sizeMB}`;
                        }
                    }
                });

                $loadingAnimation.replaceWith(imageItem);
            });

            $(imageElement).on('error', function() {
                // Handle error loading image
            });

            imageElement.src = '../default_images/' + imageUrl;
        });
    }

    /**
     * Image Delete
     */

    mediaContainer.on('click', '.delete-button', function() {
        const imageContainer = $(this).closest('.col-md-3');
        const imageUrl = $(this).data('image');

        $(".confirm-file-delete").show();
        $(".close-modal-button").text("Nu");

        $("#deleteMessageResult").empty();
        $("#fileDeleteModal").modal("show");

        $(".confirm-file-delete").click(function() {

            $(".confirm-file-delete").hide();
            $(".close-modal-button").text("OK");

            $.ajax({
                url: '../php/delete_image.php',
                method: 'POST',
                data: { image_url: imageUrl },
                success: function(response) {
                    try {
                        const jsonResponse = JSON.parse(response);

                        if (jsonResponse.success) {
                            imageContainer.remove();
                            $("#deleteMessageResult").empty();
                            $("#deleteMessageResult").append('<div class="alert alert-success">Imagine stearsa!</div>');
                        } else {
                            $("#deleteMessageResult").empty();
                            $("#deleteMessageResult").append('<div class="alert alert-danger">Nu s-a putut sterge imaginea!</div>');
                        }
                    } catch (error) {
                        $("#deleteMessageResult").empty();
                        console.error(error);
                        $("#deleteMessageResult").append('<div class="alert alert-danger">A aparut o eroare in procesarea cererii!</div>');
                    }
                },
                error: function(xhr, status, error) {
                    $("#deleteMessageResult").empty();
                    console.error(error);
                    $("#deleteMessageResult").append('<div class="alert alert-danger">A aparut o eroare in procesarea cererii!</div>');
                }
            });
        });


    });
});