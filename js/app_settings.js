/**
 * Populate form with settings
 */

get_app_settings();

/**
 * gets the defined app settings
 */


function get_app_settings()
{
    $.get("../php/get_app_settings.php", function(response) {
        try {
            var data = JSON.parse(response);

            if (data.status) {
                if (data.settings) {

                    $("#app_logo").val(data.settings.app_logo);
                    $("#app_name").val(data.settings.app_name);
                    $("#app_url").val(data.settings.app_url);
                    $("#image_limit").val(data.settings.image_limit);
                    $("#copyright_text").val(data.settings.copyright_text);
                    $("#sent_from_text").val(data.settings.sent_from_text);
                    $("#subject_text").val(data.settings.subject_text);
                    $("#message_text").val(data.settings.message_text);
                    $("#meta_keywords").val(data.settings.meta_keywords);
                    $("#default_theme").val(data.settings.default_theme);
                    $("#max_file_size").val(data.settings.max_file_size);
                    $("#enable_image_editor").val(data.settings.enable_image_editor.toString());
                    $("#enable_edit_from").val(data.settings.enable_edit_from.toString());
                    $("#enable_edit_subject").val(data.settings.enable_edit_subject.toString());
                    $("#enable_edit_message").val(data.settings.enable_edit_message.toString());
                    $("#cookie_policy").text(data.settings.cookie_policy);
                    $("#terms_policy").text(data.settings.terms_policy);

                    return data.settings;
                } else {
                    /**
                     * empty array returned by get_app_settings.php
                     */

                    load_default_settings()
                        .then(function(data) {

                            $("#app_logo").val(data.app_logo);
                            $("#app_name").val(data.app_name);
                            $("#app_url").val(data.app_url);
                            $("#image_limit").val(data.image_limit);
                            $("#copyright_text").val(data.copyright_text);
                            $("#sent_from_text").val(data.sent_from_text);
                            $("#subject_text").val(data.subject_text);
                            $("#message_text").val(data.message_text);
                            $("#meta_keywords").val(data.meta_keywords);
                            $("#default_theme").val(data.default_theme);
                            $("#max_file_size").val(data.max_file_size);
                            $("#enable_image_editor").val(data.enable_image_editor.toString());
                            $("#enable_edit_from").val(data.enable_edit_from.toString());
                            $("#enable_edit_subject").val(data.enable_edit_subject.toString());
                            $("#enable_edit_message").val(data.enable_edit_message.toString());
                            $("#cookie_policy").val(data.cookie_policy);
                            $("#terms_policy").val(data.terms_policy);

                            return data;
                        })
                        .catch(function(error) {
                            console.error("Error:", error);
                        });
                }
            }

        } catch (error) {

            console.log(error);
            console.log('goes here');
            /**
             * get_app_settings.php does not respond
             * or does not exist
             */

            load_default_settings()
                .then(function(data) {
                    $("#app_logo").val(data.app_logo);
                    $("#app_name").val(data.app_name);
                    $("#app_url").val(data.app_url);
                    $("#image_limit").val(data.image_limit);
                    $("#copyright_text").val(data.copyright_text);
                    $("#sent_from_text").val(data.sent_from_text);
                    $("#subject_text").val(data.subject_text);
                    $("#message_text").val(data.message_text);
                    $("#meta_keywords").val(data.meta_keywords);
                    $("#default_theme").val(data.default_theme);
                    $("#max_file_size").val(data.max_file_size);
                    $("#enable_image_editor").val(data.enable_image_editor.toString());
                    $("#enable_edit_from").val(data.enable_edit_from.toString());
                    $("#enable_edit_subject").val(data.enable_edit_subject.toString());
                    $("#enable_edit_message").val(data.enable_edit_message.toString());
                    $("#cookie_policy").val(data.cookie_policy);
                    $("#terms_policy").val(data.terms_policy);

                    return data;
                })
                .catch(function(error) {
                    console.error("Error:", error);
                });
        }
    });
}

/**
 *
 * @param {*} data
 * @returns
 */

function isObject(data) {
    return typeof data === 'object' && data !== null;
}

/**
 *
 * @param {*} str
 * @returns
 */
function stringToBoolean(str) {
    if (str === 'true'){
        return true;
    } else {
        return false;
    }
}

/**
 * loads default app settings
 */

function load_default_settings() {
    return new Promise((resolve, reject) => {
        $.get({
            url: "../core/default_config.json",
            dataType: "json",
            success: function(data) {
                // Check if 'data' is an object
                if (isObject(data)) {
                    resolve(data); // Resolve the Promise with the data
                } else {
                    reject("The response is not an object / invalid JSON configuration.");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                reject(errorThrown); // Reject the Promise with the error message
            }
        });
    });
}
$(document).ready(function() {

    /**
     * Handle updating app
     * settings
     */

    $(".update-app-settings").click(function () {
        $("#saveAppSettingsDiv").empty();

        let app_logo = $("#app_logo").val();
        let app_name = $("#app_name").val();
        let app_url = $("#app_url").val();
        let image_limit = $("#image_limit").val();
        let copyright_text = $("#copyright_text").val();
        let sent_from_text = $("#sent_from_text").val();
        let subject_text = $("#subject_text").val();
        let message_text = $("#message_text").val();
        let meta_keywords = $("#meta_keywords").val();
        let default_theme = $("#default_theme").val();
        let max_file_size = $("#max_file_size").val();
        let enable_image_editor = $("#enable_image_editor").val();
        let enable_edit_from = $("#enable_edit_from").val();
        let enable_edit_subject = $("#enable_edit_subject").val();
        let enable_edit_message = $("#enable_edit_message").val();

        let terms_policy = $("#terms_policy").val();
        let cookie_policy = $("#cookie_policy").val();

        if (app_logo !== "",
            app_name !== "",
            app_url !== "",
            image_limit != "",
            copyright_text !== "",
            meta_keywords !== "",
            default_theme !== "",
            max_file_size !== "",
            enable_image_editor !== "",
            enable_edit_from !== "",
            enable_edit_subject !== "",
            enable_edit_message  !== ""
        ) {
            $.ajax({
                type: "POST",
                url: "../php/save_app_settings.php",
                data:  {
                    app_logo: app_logo,
                    app_name: app_name,
                    app_url: app_url,
                    image_limit: image_limit,
                    copyright_text: copyright_text,
                    sent_from_text: sent_from_text,
                    subject_text: subject_text,
                    message_text: message_text,
                    meta_keywords: meta_keywords,
                    default_theme: default_theme,
                    max_file_size: max_file_size,
                    enable_image_editor: enable_image_editor,
                    enable_edit_from: enable_edit_from,
                    enable_edit_subject: enable_edit_subject,
                    enable_edit_message: enable_edit_message,
                    cookie_policy: cookie_policy,
                    terms_policy: terms_policy
                },
                dataType: "text", // Set the expected data type as text
                success: function(response) {
                    try {
                        var data = JSON.parse(response);

                        if (data.status === true) {
                            $("#saveAppSettingsDiv").append('<div class="alert alert-success">Datele au fost salvate.</div>');
                        } else {
                            $("#saveAppSettingsDiv").append('<div class="alert alert-danger">'+data.error+'</div>');
                        }
                    } catch (error) {

                        $("#saveAppSettingsDiv").append('<div class="alert alert-warning">Backend Error: '+error.message+'</div>"');
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 404) {
                        // Handle not found (404) error
                        $("#saveAppSettingsDiv").append('<div class="alert alert-warning">Backend Error: App Settings callback not found.</div>');
                    } else if (jqXHR.status === 500) {
                        // Handle internal server error (500) error
                        $("#saveAppSettingsDiv").append('<div class="alert alert-warning">Backend Error: 500, eroare interna de server.</div>');
                    } else {
                        // Handle other error cases
                        $("#saveAppSettingsDiv").append('<div class="alert alert-warning">Backend Error: '+errorThrown+'</div>');
                    }
                },
            });
        }

    });


});