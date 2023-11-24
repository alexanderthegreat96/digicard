$(document).ready(function () {

    /**
     * Initialize on page load
     */

    getStats();

    /**
     * Logs data
     */

    $('#logsDataTable').DataTable({
        ajax: {
            url: '../php/get_mailer_logs.php',
            dataSrc: 'logs'
        },
        order: [[8, 'desc']],
        columns: [
            {
                data:'id',
                title:'ID'
            },
            {
                data: 'from_name',
                title: 'De la'
            },
            {
                data: 'to_name',
                title: 'Catre'
            },
            {
                data: 'to_email',
                title: 'Catre email'
            },
            {
                data: 'subject',
                title: 'Subiect'
            },
            {
                data: 'message',
                title: 'Mesaj'
            },
            {
                data: 'image',
                title: 'Imagine',
                render: function(data, type, row) {
                    if(data !== 'N/A') {
                        return '<a href="#"><img src="'+data+'" style="object-fit: contain; width: 70px;"/></a>';
                    } else {
                        return 'N/A';
                    }
                }
            },
            {
                data: 'smtp_server',
                title: 'Trimis cu',
            },
            {
                data: 'created_at',
                title: 'Data crearii',

            }
        ],
        language: {
            emptyTable: "Nu s-au gasit date."
        }
    });

    /**
     * Load db stats
     */

    function getStats() {
        $.get("../php/get_stats.php", function(response) {
            let data = null;
            try {
                data = JSON.parse(response);

                let userCount = 0;
                let genCount = 0;
                let uploadCount = 0;
                let logs = 0;
                let logsMonth = 0;

                if (data.users) {
                    userCount = data.users;
                }

                if(data.generated_images) {
                    genCount = data.generated_images;
                }

                if(data.uploaded_images) {
                    uploadCount = data.uploaded_images;
                }

                if(data.logs) {
                    logs = data.logs;
                }

                if(data.logs_this_month) {
                    logsMonth = data.logs_this_month;
                }

                $("#userCount").text(userCount);
                $("#countGen").text(genCount);
                $("#countUpload").text(uploadCount);
                $("#countLogs").text(logs);
                $("#logsCountMonth").text(logsMonth);


            } catch (error) {
            }
        });
    }

    /*
    * Wipe data
     */

    $(".wipe-data").click(function () {

        $("#wipeDataResult").empty();

        let checkboxValues = [];

        $('.deleteChecklist:checked').each(function() {
            checkboxValues.push($(this).val());
        });

        if (checkboxValues.length > 0) {
            $.ajax({
                type: "POST",
                url: "../php/wipe_data.php",
                data:  {
                    list: checkboxValues
                },
                dataType: "text", // Set the expected data type as text
                success: function(response) {

                    try {
                        var data = JSON.parse(response);

                        if (data.status === true) {

                            $(".wipe-data").hide();

                            $("#wipeDataResult").append('<div class="alert alert-success">Datele au fost sterse cu succes. ' +
                                'Pagina se reincarca in <b>2</b> seconde.</div>');

                            var refreshInterval = 2000; // 2000 milliseconds = 2 seconds

                            setTimeout(function() {
                                location.reload();
                            }, refreshInterval);

                        } else {
                            $("#wipeDataResult").append('<div class="alert alert-danger">'+data.error+'</div>');
                        }
                    } catch (error) {

                        $("#wipeDataResult").append('<div class="alert alert-warning">Backend Error: '+error.message+'</div>"');
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 404) {
                        // Handle not found (404) error
                        $("#wipeDataResult").append('<div class="alert alert-warning">Backend Error: Wipe data callback not found.</div>');
                    } else if (jqXHR.status === 500) {
                        // Handle internal server error (500) error
                        $("#wipeDataResult").append('<div class="alert alert-warning">Backend Error: 500, eroare interna de server.</div>');
                    } else {
                        // Handle other error cases
                        $("#wipeDataResult").append('<div class="alert alert-warning">Backend Error: '+errorThrown+'</div>');
                    }
                },
            });
        } else {
            $('#wipeDataResult').append('<div class="alert alert-info mt-2">Nu ai selectat nici o optiune.</div>');
        }
    });
});