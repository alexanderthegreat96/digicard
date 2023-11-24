/**
 * Apply settings
 */

apply_settings();
/**
 * gets the defined app settings
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
    return str === "true";
}

/**
 * loads default app settings
 */

function load_default_settings() {
    return new Promise((resolve, reject) => {
        $.get({
            url: "core/default_config.json",
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

/**
 * apply default application settings on the main page
 */

function apply_settings() {
    get_app_settings()
        .then(function(settings) {
            /**
             * apply page title
             */
            let page_title = '';

            if($('#pageTitle').length) {
                page_title = settings.app_name + ' - ' + $('#pageTitle').text();
            } else {
                page_title = settings.app_name;
            }

            document.title = page_title;

            /**
             * Apply logo
             */

            $("#logo-image").attr("src", settings.app_logo);

            /**
             * apply theme
             */

            $('html').attr('data-bs-theme', settings.default_theme);

            /**
             * Invert image as well
             * if theme is dark
             */

            if (settings.default_theme === "dark") {
                $("#logo-image").css("filter", "invert(100%)");
            }

            /**
             * apply app name and copyright text
             */

            $("#app_name").text(settings.app_name);
            $("#copyright_text").text(settings.copyright_text);


            /**
             * App URL
             */

            $("#app_url_link").attr('href', settings.app_url);

            /**
             * apply meta keywords
             */

            $('meta[name="keywords"]').attr("content",settings.meta_keywords);

            /**
             * form related stuff
             */


            if(settings.enable_edit_from === false) {
                $("#sent_from_row").hide();
                $("#send_from_name").prop("readonly", true).val(settings.sent_from_text).hide();
            }

            if(settings.enable_edit_subject === false) {
                $("#subject_row").hide();
                $("#send_to_subject").prop("readonly", true).val(settings.subject_text).hide();
            }

            if (settings.enable_edit_message === false) {
                $("#message_row").hide();
                $("#send_to_body").prop("readonly", true).val(settings.message_text).hide();
            }

            if(settings.cookie_policy !== "") {
                $("#cookie_policy_content").html(settings.cookie_policy);
            } else {
                $("#cookie_policy_content").html("<p>Nu au fost introduse date.</p>");
            }

            if(settings.terms_policy !== "") {
                $("#terms_policy_content").html(settings.terms_policy);
            } else {
                $("#terms_policy_content").html("<p>Nu au fost introduse date.</p>");
            }

        })
        .catch(function(error) {
            console.error("Error:", error);
        });
}