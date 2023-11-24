/**
 * Apply settings
 */

apply_settings();
/**
 * gets the defined app settings
 */

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

function get_app_settings()
{
    return new Promise((resolve, reject) => {
        $.get("../php/get_app_settings.php", function(response) {
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


/**
 * apply default application settings on all admin pages
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

            $("#app_name_admin").text(settings.app_name);
            $("#admin_copyright_text").text(settings.copyright_text);


            /**
             * apply meta keywords
             */

            $('meta[name="keywords"]').attr("content",settings.meta_keywords);

            /**
             * form related stuff
             */

            if(settings.enable_edit_subject === false) {
                $("#subject_row").hide();
                $("#send_to_subject").prop("readonly", true).val(settings.subject_text).hide();
            }

            if (settings.enable_edit_message === false) {
                $("#message_row").hide();
                $("#send_to_body").prop("readonly", true).val(settings.message_text).hide();
            }

        })
        .catch(function(error) {
            console.error("Error:", error);
        });
}

$(document).ready(function() {
    /**
     * Enforce logging in
     */

    checkIfLoggedIn();

    /**
     * Apply user info
     */

    applyUserInfo();


    /**
     * Apply the active to the links
     */

    setActiveNavLink();


    /**
     * Keept the session alive by executing
     * checkIfLoggedIn every 10 mins
     */


    setInterval(checkIfLoggedIn, 600000);

    /**
     * Sets the class for nav-link to active
     */
    function setActiveNavLink() {
        var currentPath = window.location.pathname;
        var currentPathBasename = currentPath.split('/').pop(); // Get the last part of the URL path
        $(".nav-link").each(function() {
            var href = $(this).attr("href");
            var hrefBasename = href.split('/').pop(); // Get the last part of the href
            if (currentPathBasename === hrefBasename) {
                $(this).addClass("active");
            } else {
                $(this).removeClass("active");
            }
        });
    }


    /**
     * Actual function to check if logged in
     */

    function checkIfLoggedIn() {
        if (window.location.pathname.endsWith("login.html")) {
            $('body').show();
            // If the current location is login.html
            // Check if the user is logged in
            $.get("../php/is_logged_in.php", function(response) {
                try {
                    var data = JSON.parse(response);
                } catch (error) {
                    // Redirect to login.html if parsing fails
                    window.location.href = "../500.html";
                    return;
                }

                var isLoggedIn = data.status;

                if (isLoggedIn) {
                    $('body').show();

                    // Redirect to index.html if the user is logged in
                    window.location.href = "index.html";
                }
            });
            return; // No further actions needed
        }

        // If the current location is not login.html
        $.get("../php/is_logged_in.php", function(response) {
            try {
                var data = JSON.parse(response);
            } catch (error) {
                // Redirect to login.html if parsing fails
                window.location.href = "login.html";
                return;
            }

            var isLoggedIn = data.status;

            if (!isLoggedIn) {
                $('body').hide();
                // Redirect to login.html if the user is not logged in
                window.location.href = "login.html";
            }
        });
    }



    /**
     * Sign in user form
     */
    function signIn() {
        let proceed = validateInputs(['floatingUsername', 'floatingPassword']);

        if (proceed) {
            /**
             * check if the image was selected
             */

            let username = $("#floatingUsername").val();
            let password = $("#floatingPassword").val();

            if (username.length > 3 && password.length > 3) {
                $("#floatingUsername").removeClass("border-warning");
                $("#floatingPassword").removeClass("border-warning");


                /**
                 * Send request
                 */

                loginUser(username, password);


            } else {
                $("#floatingUsername").removeClass("border-warning");
                $("#floatingUsername").addClass("border-warning");

                $("#floatingPassword").removeClass("border-warning");
                $("#floatingPassword").addClass("border-warning");
            }


        }
    }

    /**
     * Handle login on click
     */

    $(".sign-in").click(function() {
        signIn();
    });

    function loginUser(username, password) {
        $("#login-output").empty();

        $.ajax({
            type: "POST",
            url: "../php/login.php",
            data:  {
                username: username,
                password: password
            },
            dataType: "text", // Set the expected data type as text
            success: function(response) {
                try {
                    var data = JSON.parse(response);

                    if (data.status === true) {
                        // Successful login, redirect to index.html
                        window.location.href = "index.html";
                    } else {
                        // Unsuccessful login, show error message
                        $("#login-output").append('<div class="alert alert-danger">'+data.error+'</div>');
                    }
                } catch (error) {
                    // If parsing fails, show response as plain text
                    $("#login-output").append('<div class="alert alert-warning">Backend Error: '+error.message+'</div>');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 404) {
                    // Handle not found (404) error
                    $("#login-output").append('<div class="alert alert-warning">Backend Error: Login callback not found.</div>');
                } else if (jqXHR.status === 500) {
                    // Handle internal server error (500) error
                    $("#login-output").append('<div class="alert alert-warning">Backend Error: 500, eroare interna de server.</div>');
                } else {
                    // Handle other error cases
                    $("#login-output").append('<div class="alert alert-warning">Backend Error: '+errorThrown+'</div>');
                }
            },
        });
    }

    /**
     * Apply user information to dropdown
     */

    function applyUserInfo() {
        $.get("../php/is_logged_in.php", function(response) {
            try {
                var data = JSON.parse(response);

                if ($('.logged-in-user-username').length > 0) {
                    $(".logged-in-user-username").empty();
                    $(".logged-in-user-username").append('' + data.username);

                }

            } catch (error) {
                // // Redirect to login.html if parsing fails
                // window.location.href = "../500.html";
            }
        });
    }

    /**
     * Handle logout
     */

    $(".logout").click(function() {
        $.get("../php/logout.php", function(response) {
            window.location.href = "login.html";
        });
    });


    $(".save-password").click(function() {
        $("#paswordChangeResult").empty();

        let old_password = $("#old-password-input").val();
        let password = $("#new-password-input").val();
        let confirm = $("#confirm-password-input").val();

        if (password && confirm && password === confirm) {
            $.ajax({
                type: "POST",
                url: "../php/change_pass.php",
                data:  {
                    old: old_password,
                    password: password,
                    confirm: confirm
                },
                dataType: "text", // Set the expected data type as text
                success: function(response) {
                    try {
                        var data = JSON.parse(response);

                        if (data.status === true) {

                            $("#paswordChangeResult").append('<div class="alert alert-success">Parola a fost schimbata cu success in: ['+password+']</div>');
                        } else {

                            $("#paswordChangeResult").append('<div class="alert alert-danger">'+data.error+'</div>');
                        }
                    } catch (error) {

                        $("#paswordChangeResult").append('<div class="alert alert-warning">Backend Error: '+error.message+'</div>"');
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 404) {
                        // Handle not found (404) error
                        $("#paswordChangeResult").append('<div class="alert alert-warning">Backend Error: Change Password callback not found.</div>');
                    } else if (jqXHR.status === 500) {
                        // Handle internal server error (500) error
                        $("#paswordChangeResult").append('<div class="alert alert-warning">Backend Error: 500, eroare interna de server.</div>');
                    } else {
                        // Handle other error cases
                        $("#paswordChangeResult").append('<div class="alert alert-warning">Backend Error: '+errorThrown+'</div>');
                    }
                },
            });
        }
    });

})

/**
 *
 * @param inputIds
 * @returns {boolean}
 */
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