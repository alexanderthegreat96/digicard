$(document).ready(function() {


    /**
     * Populate form with settings
     */

    get_settings();

    /**
     * gets the defined smtp settings
     */


    function get_settings()
    {
        $.get("../php/get_mail_settings.php", function(response) {
            try {
                var data = JSON.parse(response);

                if (data.status) {
                    if (data.settings) {
                        $("#smtp_server").val(data.settings.smtp_host);
                        $("#smtp_username").val(data.settings.smtp_user);
                        $("#smtp_password").val(data.settings.smtp_pass);
                        $("#smtp_port").val(data.settings.port);
                        $("#smtp_encryption").val(data.settings.encryption);
                        $("#smtp_from_email").val(data.settings.smtp_from_email);
                        $("#smtp_from_name").val(data.settings.smtp_from_name);
                    } else {

                    }
                }

            } catch (error) {
                return;
            }


        });
    }

    /**
     * Handle uptating smtp
     * settings
     */

    $(".update-smtp-settings").click(function () {
        $("#saveSettingsDiv").empty();

        let smtp_host = $("#smtp_server").val();
        let smtp_user = $("#smtp_username").val();
        let smtp_pass = $("#smtp_password").val();
        let smtp_port = $("#smtp_port").val();
        let smtp_enc = $("#smtp_encryption").val();
        let smtp_from_email = $("#smtp_from_email").val();
        let smtp_from_name = $("#smtp_from_name").val();


        if (smtp_host !== "" && smtp_user !== "" && smtp_pass !=="" && smtp_port !== "" && smtp_enc !== "") {
            $.ajax({
                type: "POST",
                url: "../php/save_mail_settings.php",
                data:  {
                    smtp_from_email: smtp_from_email,
                    smtp_from_name : smtp_from_name,
                    smtp_host: smtp_host,
                    smtp_user: smtp_user,
                    smtp_pass: smtp_pass,
                    smtp_enc : smtp_enc,
                    smtp_port : smtp_port
                },
                dataType: "text", // Set the expected data type as text
                success: function(response) {
                    try {
                        var data = JSON.parse(response);

                        if (data.status === true) {

                            $("#saveSettingsDiv").append('<div class="alert alert-success">Datele au fost salvate.</div>');
                        } else {
                            $("#saveSettingsDiv").append('<div class="alert alert-danger">'+data.error+'</div>');
                        }
                    } catch (error) {

                        $("#saveSettingsDiv").append('<div class="alert alert-warning">Backend Error: '+error.message+'</div>"');
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 404) {
                        // Handle not found (404) error
                        $("#saveSettingsDiv").append('<div class="alert alert-warning">Backend Error: Mail Settings callback not found.</div>');
                    } else if (jqXHR.status === 500) {
                        // Handle internal server error (500) error
                        $("#saveSettingsDiv").append('<div class="alert alert-warning">Backend Error: 500, eroare interna de server.</div>');
                    } else {
                        // Handle other error cases
                        $("#saveSettingsDiv").append('<div class="alert alert-warning">Backend Error: '+errorThrown+'</div>');
                    }
                },
            });
        }

    });

    /**
     * Handle testing mailer
     * settings
     */

    $(".test-mail").click(function() {
        $("#mail_to_result").empty();
        $("#testMailResult").empty();
        $("#mail_to_result").val(null);

        let email = $('#mail_to_email').val();
        let name = $("#mail_to_name").val();
        let subject = $('#mail_to_subject').val();
        let message = $("#mail_to_message").val();


        validateInputs(['mail_to_email', 'mail_to_name' ,'mail_to_subject', 'mail_to_message']);

        if (email !== "" && name !== "" && subject !== "" && message) {
            $.ajax({
                type: "POST",
                url: "../php/test_mail.php",
                data:  {
                    name: name,
                    email: email,
                    subject: subject,
                    message:message
                },
                dataType: "text", // Set the expected data type as text
                beforeSend: function (response) {
                    $("#mail_to_result").html('<div class="alert alert-primary">Se trimite request-ul...</div>');
                },
                success: function(response) {
                    $("#mail_to_result").html(response);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 404) {
                        // Handle not found (404) error
                        $("#testMailResult").append('<div class="alert alert-warning">Backend Error: Test Mail callback not found.</div>');
                    } else if (jqXHR.status === 500) {
                        // Handle internal server error (500) error
                        $("#testMailResult").append('<div class="alert alert-warning">Backend Error: 500, eroare interna de server.</div>');
                    } else {
                        // Handle other error cases
                        $("#testMailResult").append('<div class="alert alert-warning">Backend Error: '+errorThrown+'</div>');
                    }
                },
            });
        } else {
            $("#testMailResult").append("<div class='alert alert-danger'>Toate campurile trebuiesc completate!</div>");
        }
    });


});