/**
 * Users data table
 */

$('#usersDataTable').DataTable({
    ajax: {
        url: '../php/get_users.php',
        dataSrc: 'users'
    },
    columns: [
        {
            data:'id',
            title:'ID'
        },
        {
            data: 'username',
            title: 'Nume de utilizator',
            render: function(data, type, row) {
                if(row.id !== 1) {
                    return '<a href="#" class="edit-user-link link-primary" data-user-id="'+row.id+'" data-user-name="'+row.username+'">' + data + '</a>';
                } else {
                    return data;
                }
            }
        },
        { data: 'createdAt', title: 'Data crearii' },
    ]
});

/**
 * Users data table edit users
 */

$('#usersDataTable').on('click', '.edit-user-link', function(event) {
    event.preventDefault();

    var userId = $(this).data('user-id');
    var userNmae = $(this).data('user-name');

    $("#new-username-input").val();
    $("#selectedUserId").val();

    $("#new-username-input").val(userNmae);
    $("#selectedUserId").val(userId);
    $(".delete-user").attr('data-user-id', userId);

    $("#editUserModal").modal("show");

});


/**
 * Update user
 */

$(".update-user").click(function (){

    $("#userChangeResult").empty();

    let user_id = $("#selectedUserId").val();
    let username = $("#new-username-input").val();
    let password = $("#new-password-input").val();
    let confirm = $("#confirm-password-input").val();

    if (user_id !=='' && username !=="" && password !=="" && confirm !== "" && password === confirm) {
        $.ajax({
            type: "POST",
            url: "../php/update_user.php",
            data:  {
                user_id: user_id,
                username: username,
                password: password,
                confirm: confirm
            },
            dataType: "text", // Set the expected data type as text
            success: function(response) {
                try {
                    var data = JSON.parse(response);

                    if (data.status === true) {
                        $("#userChangeResult").append('<div class="alert alert-success">Datele au fost actualizate cu succes. ' +
                            'Pagina se reincarca in <b>2</b> seconde.</div>');

                        var refreshInterval = 2000; // 2000 milliseconds = 2 seconds

                        setTimeout(function() {
                            location.reload();
                        }, refreshInterval);

                    } else {
                        $("#userChangeResult").append('<div class="alert alert-danger">'+data.error+'</div>');
                    }
                } catch (error) {

                    $("#userChangeResult").append('<div class="alert alert-warning">Backend Error: '+error.message+'</div>"');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 404) {
                    // Handle not found (404) error
                    $("#userChangeResult").append('<div class="alert alert-warning">Backend Error: Change User callback not found.</div>');
                } else if (jqXHR.status === 500) {
                    // Handle internal server error (500) error
                    $("#userChangeResult").append('<div class="alert alert-warning">Backend Error: 500, eroare interna de server.</div>');
                } else {
                    // Handle other error cases
                    $("#userChangeResult").append('<div class="alert alert-warning">Backend Error: '+errorThrown+'</div>');
                }
            },
        });
    }


});


/**
 * Create a new user
 */


$(".create-user").click(function (){

    $("#userChangeResult").empty();

    let username = $("#username-input").val();
    let password = $("#password-input").val();
    let confirm = $("#password-confirm").val();

    if (username !=="" && password !=="" && confirm !== "" && password === confirm) {
        $.ajax({
            type: "POST",
            url: "../php/create_user.php",
            data:  {
                username: username,
                password: password,
                confirm: confirm
            },
            dataType: "text", // Set the expected data type as text
            success: function(response) {
                try {
                    var data = JSON.parse(response);

                    if (data.status === true) {
                        $("#userCreateResult").append('<div class="alert alert-success">Date introduse cu succes. ' +
                            'Redirectionare la useri in <b>2</b> seconde.</div>');

                        var refreshInterval = 2000; // 2000 milliseconds = 2 seconds

                        setTimeout(function() {
                            window.location.href = "users.html";
                        }, refreshInterval);

                    } else {
                        $("#userCreateResult").append('<div class="alert alert-danger">'+data.error+'</div>');
                    }
                } catch (error) {

                    $("#userCreateResult").append('<div class="alert alert-warning">Backend Error: '+error.message+'</div>"');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 404) {
                    // Handle not found (404) error
                    $("#userCreateResult").append('<div class="alert alert-warning">Backend Error: Create User callback not found.</div>');
                } else if (jqXHR.status === 500) {
                    // Handle internal server error (500) error
                    $("#userCreateResult").append('<div class="alert alert-warning">Backend Error: 500, eroare interna de server.</div>');
                } else {
                    // Handle other error cases
                    $("#userCreateResult").append('<div class="alert alert-warning">Backend Error: '+errorThrown+'</div>');
                }
            },
        });
    }


});


/**
 * Handle deleting users
 */

$(".delete-user").click(function () {

    let user_id = $(this).attr('data-user-id');

    $("#confirmRemovalModal").modal("show");

    $(".confirm-delete").click(function () {
        $("#deleteResult").empty();
        $.ajax({
            type: "POST",
            url: "../php/delete_user.php",
            data:  {
                user_id : user_id
            },
            dataType: "text", // Set the expected data type as text
            success: function(response) {
                try {
                    var data = JSON.parse(response);

                    if (data.status === true) {
                        $("#deleteResult").append('<div class="alert alert-success">User sters. ' +
                            'Redirectionare la useri in <b>2</b> seconde.</div>');

                        var refreshInterval = 2000; // 2000 milliseconds = 2 seconds

                        setTimeout(function() {
                            location.reload();
                        }, refreshInterval);

                    } else {
                        $("#deleteResult").append('<div class="alert alert-danger">'+data.error+'</div>');
                    }
                } catch (error) {

                    $("#deleteResult").append('<div class="alert alert-warning">Backend Error: '+error.message+'</div>"');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 404) {
                    // Handle not found (404) error
                    $("#deleteResult").append('<div class="alert alert-warning">Backend Error: Delete User callback not found.</div>');
                } else if (jqXHR.status === 500) {
                    // Handle internal server error (500) error
                    $("#deleteResult").append('<div class="alert alert-warning">Backend Error: 500, eroare interna de server.</div>');
                } else {
                    // Handle other error cases
                    $("#deleteResult").append('<div class="alert alert-warning">Backend Error: '+errorThrown+'</div>');
                }
            },
        });
    });

});