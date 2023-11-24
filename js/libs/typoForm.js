/**
 * TypoForm JS Utilities
 * Author alexandrulupaescu
 * (c) 2021
 * Requirements: jQuery 3.x.x +
 * Allows full control over the default error mapping
 * and form validation for Typo3Forms
 * CSS Classes:  .typoControl .typoIgnore .typoSubmit .invalid . valid
 * Data attributes: data-lang , data-length
 */


if (consoleDebug) {
    console.log("typoFormJS v1.0 Intiated...");
}


if (useLangId) {
    $(".typoControl").attr("data-lang", $("#langCode").val());
}

if (useSubmit) {
    console.log(".typoSubmit -> Using normal submit button and applying 'disabled'...");
    $(".typoSubmit").prop("disabled", true);

    $(".typoSubmit").click(function () {
        if (checkFields() === "valid") {
            console.log("Form ready!");
        } else {
            console.log("We have a form error");
        }
    });

}

$(".typoControl, .typoControlMultiple").on('keyup change keypress blur input', function () {

    if (consoleDebug) {
        console.log("Listening to .typoControl changes...");
    }


    var result = "invalid";


    var fields = checkFields();
    var multiple = checkMultiple();


    if (useSubmit) {
        if (fields === "invalid"  || multiple  === "invalid") {
            $(".typoSubmit").prop("disabled", "true");
            if (consoleDebug) {
                console.log("Disabled the submit button!");
            }
        } else {
            $(".typoSubmit").removeAttr("disabled", true);
            if (consoleDebug) {
                console.log("Enabled the submit button!");
            }
        }
    }


});

/**
 * Displays error for given
 * object key
 */
function highlightError(errorMsg, i) {
    //$(".typoControl").each(function(i,obj){
    var current = $(".typoControl").eq(i);
    if (current.hasClass("invalid")) {
        $(".errorMsg").eq(i).html(errorMsg);

        if (consoleDebug) {
            console.log("showcase error for .typoControl_" + i);
        }
        return false;
    } else {
        removeError(i);
        return true;
    }
    //  });
}

function applyInvalid(i) {
    var currentInput = $(".typoControl").eq(i);
    $(currentInput).removeClass("valid");
    $(currentInput).addClass("invalid");

    if (consoleDebug) {
        console.log("Applied invalid  .typoControl_" + i);
    }
}

function applyValid(i) {
    var currentInput = $(".typoControl").eq(i);
    $(currentInput).removeClass("invalid");
    $(currentInput).addClass("valid");

    if (consoleDebug) {
        console.log("Applied valid  .typoControl_" + i);
    }
}

/**
 * Applies text Error for given object key
 * */
function applyTextError(i, lang) {
    var errorMsg = null;

    if (lang === "en") {
        errorMsg = "You must type in some text.";
    } else if (lang === "de") {
        errorMsg = "Sie müssen einen Text eingeben.";
    } else if (lang === "it") {
        errorMsg = "Devi digitare del testo.";
    } else if (lang === "fr") {
        errorMsg = "Vous devez taper du texte.";

    } else if (lang === "ro") {
        errorMsg = "Trebuie sa introduci text.";
    } else {
        errorMsg = "You must type in some text.";
    }

    //$(".errorMsg").eq(i).html(errorMsg);

    if (consoleDebug) {
        console.log("Applied a text error for .typoControl_" + i);
    }

    return errorMsg;
}

/**
 * Applies lenghtError for given object key
 * */

function applyLengthError(i, limit, lang = "en") {
    var errorMsg = null;

    if (lang === "en") {
        errorMsg = "You must type at least <b>" + limit + "</b> characters.";
    } else if (lang === "ro") {
        errorMsg = "Trebuie sa introduci macar <b>" + limit + "</b> caractere";
    } else if (lang === "de") {
        errorMsg = "Sie müssen mindestens <b>" + limit + "</b> Zeichen eingeben";
    } else if (lang === "it") {
        errorMsg = "Devi digitare almeno <b>" + limit + "</b> caratteri.";
    } else if (lang === "fr") {
        errorMsg = "Vous devez taper au moins <b>" + limit + "</b> caractères.";
    } else {
        errorMsg = "You must type at least <b>" + limit + "</b> characters.";
    }

    // $(".errorMsg").eq(i).html(errorMsg);

    if (consoleDebug) {
        console.log("Applied a input length error for .typoControl_" + i);
    }

    return errorMsg;
}

/**
 * Applies email Error for given object key
 * */

function applyEmailError(i, lang = "en") {
    var errorMsg = null;
    if (lang === "en") {
        errorMsg = "Your email address does not contain '@' !";
    } else if (lang === "ro") {
        errorMsg = "Adresa de email nu contine '@' !";
    } else if (lang === "de") {
        errorMsg = "Ihre E-Mail-Adresse enthält kein '@' !";
    } else if (lang === "it") {
        errorMsg = "Il tuo indirizzo email non contiene '@' !";
    } else if (lang === "fr") {
        errorMsg = "Votre adresse e-mail ne contient pas de '@'!";
    } else {
        errorMsg = "Your email address does not contain '@' !";
    }

    //$(".errorMsg").eq(i).html(errorMsg);

    if (consoleDebug) {
        console.log("Applied an email error for .typoControl_" + i);
    }

    return errorMsg;
}

/**
 * Applies a selector error for give key
 * */
function applySelectError(i, lang = "en") {

    var errorMsg = null;
    if (lang === "en") {
        errorMsg = "You must pick an item !";
    } else if (lang === "ro") {
        errorMsg = "Trebuie sa selectezi macar un item!";
    } else if (lang === "de") {
        errorMsg = "Sie müssen einen Artikel auswählen!";
    } else if (lang === "it") {
        errorMsg = "Devi scegliere un oggetto!";
    } else if (lang === "fr") {
        errorMsg = "Vous devez choisir un article!";
    } else {
        errorMsg = "You must pick an item !";
    }

    //$(".errorMsg").eq(i).html(errorMsg);

    if (consoleDebug) {
        console.log("Applied a selector error for .typoControl_" + i);
    }

    return errorMsg;
}

function applyMultipleError(lang = "en") {
    var errorMsg = null;

    if (lang === "en") {
        errorMsg = "You must pick an item !";
    } else if (lang === "ro") {
        errorMsg = "Trebuie sa selectezi macar un item!";
    } else if (lang === "de") {
        errorMsg = "Sie müssen einen Artikel auswählen!";
    } else if (lang === "it") {
        errorMsg = "Devi scegliere un oggetto!";
    } else if (lang === "fr") {
        errorMsg = "Vous devez choisir un article!";
    } else {
        errorMsg = "You must pick an item !";
    }

    return errorMsg;

}

/**
 * Applies checkbox Error
 */

function applyCheckboxError(i, lang = "en") {

    var errorMsg = null;
    if (lang === "en") {
        errorMsg = "You must tick this option! ";
    } else if (lang === "ro") {
        errorMsg = "Trebuie sa bifezi macar o optiune! ";
    }else if (lang === "de") {
        errorMsg = "Sie müssen diese Option ankreuzen!";
    } else if (lang === "it") {
        errorMsg = "Devi spuntare questa opzione !";
    } else if (lang === "fr") {
        errorMsg = "Vous devez cocher cette option !";
    } else {
        errorMsg = "You must tick this option!";
    }

    //$(".errorMsg").eq(i).html(errorMsg);

    if (consoleDebug) {
        console.log("Applied a selector error for .typoControl_" + i);
    }

    return errorMsg;
}

function applyRadioError(i, lang = "en") {

    var errorMsg = null;
    if (lang === "en") {
        errorMsg = "You must tick this option! ";
    } else if (lang === "ro") {
        errorMsg = "Trebuie sa bifezi macar o optiune! ";
    }else if (lang === "de") {
        errorMsg = "Sie müssen diese Option ankreuzen!";
    } else if (lang === "it") {
        errorMsg = "Devi spuntare questa opzione !";
    } else if (lang === "fr") {
        errorMsg = "Vous devez cocher cette option !";
    } else {
        errorMsg = "You must tick this option!";
    }

    //$(".errorMsg").eq(i).html(errorMsg);

    if (consoleDebug) {
        console.log("Applied a selector error for .typoControl_" + i);
    }

    return errorMsg;
}

function applyTelError(i, lang = "en") {

    var errorMsg = null;
    if (lang === "en") {
        errorMsg = "Only numeric characters allowed !";
    } else if (lang === "ro") {
        errorMsg = "Doar caractere numerice acceptate !";
    } else if (lang === "de") {
        errorMsg = "Nur numerische Zeichen erlaubt !";
    } else if (lang === "it") {
        errorMsg = "Sono consentiti solo caratteri numerici !";
    } else if (lang === "fr") {
        errorMsg = "Seuls les caractères numériques sont autorisés. !";
    } else {
        errorMsg = "Only numeric characters allowed.";
    }

    //$(".errorMsg").eq(i).html(errorMsg);

    if (consoleDebug) {
        console.log("Applied a telephone error for .typoControl_" + i);
    }

    return errorMsg;
}

function applyNotEqualsError(i, lang="en") {
    var errorMsg = "";

    if (lang === "en") {
        errorMsg = "Field values do not match !";
    } else if (lang === "ro") {
        errorMsg = "Valorile campurilor nu se potrivesc !";
    } else if (lang === "de") {
        errorMsg = "Feldwerte stimmen nicht überein !";
    } else if (lang === "it") {
        errorMsg = "I valori del campo non corrispondono !";
    } else if (lang === "fr") {
        errorMsg = "Les valeurs des champs ne correspondent pas !";
    } else {
        errorMsg = "Field values do not match !";
    }


    if (consoleDebug) {
        console.log("Applied notEqualsError for .typoControl_" + i);
    }

    return errorMsg;

}

/**
 * Removes error for given object key
 *
 * */
function removeError(i) {
    $(".errorMsg").eq(i).html("");
    if (consoleDebug) {
        console.log("Removed error for .typoControl_" + i);
    }

    return null;

}

/**
 * Checks fields
 * @returns {null}
 */
function checkFields() {
    var output = null;
    $('.typoControl').each(function (i, obj) {


        /**
         * Ignore fields that have
         * the class typoIgnore
         */

        if ($(this).hasClass("typoIgnore")) {
            applyValid(i);
            output = "valid";
            return true;
        } else {
            /**
             * Cheking if the input has a lang attribute
             * */
            if ($(this).attr("data-lang")) {
                var lang = $(this).attr("data-lang");
            } else {
                var lang = "en";
            }
            /**
             * Checking for the field type
             */


            var mustBeEqualTo = $(this).attr("data-must-be-equal-to");
            if (mustBeEqualTo) {


              var value = $(this).val();
              var mustBeEqualValue = $("." + mustBeEqualTo).val();

              console.log("Comparing: " + value + " with " + mustBeEqualValue);

              if (value === mustBeEqualValue) {
                applyValid(i);
                removeError(i);
                output = "valid";
                return true;
              } else {
                applyInvalid(i);
                highlightError(applyNotEqualsError(i, lang), i);
                output = "invalid";
                return false;
              }
            }

            if ($(this).is("input")) {
                if ($(this).attr("type") === "text") {
                    if ($(this).attr("data-length")) {
                        if ($(this).val().length < $(this).attr("data-length")) {
                            applyInvalid(i);
                            highlightError(applyLengthError(i, $(this).attr("data-length"), lang), i);
                            output = "invalid";
                            return false;
                        } else {
                            applyValid(i);
                            removeError(i);
                            output = "valid";
                            return true;
                        }
                    } else {
                        if ($(this).val()) {
                            applyValid(i);
                            removeError(i);
                            output = "valid";
                            return true;
                        } else {
                            applyInvalid(i);
                            highlightError(applyTextError(i, lang), i);
                            output = "invalid";
                            return false;
                        }
                    }
                } else if ($(this).attr("type") === "tel") {

                    if ($.isNumeric($(this).val())) {

                        if ($(this).attr("data-length")) {
                            if ($(this).val().length < $(this).attr("data-length")) {
                                applyInvalid(i);
                                highlightError(applyLengthError(i, $(this).attr("data-length"), lang), i);
                                output = "invalid";
                                return false;
                            } else {
                                applyValid(i);
                                removeError(i);
                                output = "valid";
                                return true;
                            }
                        }
                        else {
                            applyValid(i);
                            removeError(i);
                            output = "valid";
                            return true;
                        }


                    } else {
                        applyInvalid(i);
                        highlightError(applyTelError(i, lang), i);
                        output = "invalid";
                        return false;
                    }


                } else if ($(this).attr("type") === "email") {
                    if ($(this).attr("data-length")) {
                        if ($(this).val().length < $(this).attr("data-length")) {
                            applyInvalid(i);
                            highlightError(applyLengthError(i, $(this).attr("data-length"), lang), i);
                            output = "invalid";
                            return false;

                        } else {

                            if ($(this).val().indexOf('@') >= 0) {
                                applyValid(i);
                                removeError(i);
                                output = "valid";
                                return true;
                            } else {
                                applyInvalid(i);
                                highlightError(applyEmailError(i, lang), i);
                                output = "invalid";
                                return false;
                            }
                        }
                    } else {
                        if ($(this).val()) {
                            applyValid(i);
                            removeError(i);
                            output = "valid";
                            return true;
                        } else {
                            applyInvalid(i);
                            highlightError(applyTextError(i, lang), i);
                            output = "invalid";
                            return false;
                        }
                    }
                } else if ($(this).attr("type") === "password") {
                    if ($(this).attr("data-length")) {
                        if ($(this).val().length < $(this).attr("data-length")) {
                            applyInvalid(i);
                            highlightError(applyLengthError(i, $(this).attr("data-length"), lang), i);
                            output = "invalid";
                            return false;
                        } else {
                            applyValid(i);
                            removeError(i);
                            output = "valid";
                            return true;
                        }
                    }
                    else {
                        if ($(this).val()) {
                            applyValid(i);
                            removeError(i);
                            output = "valid";
                            return true;
                        } else {
                            applyInvalid(i);
                            highlightError(applyTextError(i, lang), i);
                            output = "invalid"
                            return false;
                        }
                    }
                } else if ($(this).attr("type") === "checkbox") {
                    console.log("Detected checkbox...");
                    if ($(this).is(':checked')) {
                        applyValid(i);
                        removeError(i);
                        output = "valid";
                        return true;
                    } else {
                        applyInvalid(i);
                        highlightError(applyCheckboxError(i, lang), i);
                        output = "invalid"
                        return false;
                    }

                } else if ($(this).attr("type") === "radio") {
                    console.log("Detected radio...");
                    if ($(this).is(':checked')) {
                        applyValid(i);
                        removeError(i);
                        output = "valid";
                        return true;
                    } else {
                        applyInvalid(i);
                        highlightError(applyRadioError(i, lang), i);
                        output = "invalid"
                        return false;
                    }

                } else {

                }
            } else if ($(this).is("textarea")) {
                if ($(this).attr("data-length")) {
                    if ($(this).val().length < $(this).attr("data-length")) {
                        applyInvalid(i);
                        highlightError(applyLengthError(i, $(this).attr("data-length"), lang), i);
                        output = "invalid";
                        return false;
                    } else {
                        applyValid(i);
                        removeError(i);
                        output = "valid";
                        return true;
                    }
                } else {
                    if ($(this).val()) {
                        applyValid(i);
                        removeError(i);
                        output = "valid";
                        return true;
                    } else {
                        applyInvalid(i);
                        highlightError(applyTextError(i, lang), i);
                        output = "invalid";
                        return false;
                    }
                }

            } else if ($(this).is("select")) {
                if (!$(this).val()) {
                    applyInvalid(i);
                    highlightError(applySelectError(i, lang), i);
                    output = "invalid";
                    return false;
                } else {
                    applyValid(i);
                    removeError(i);
                    output = "valid";
                    return true;
                }
            } else {
                
            }
        }

    });


    return output;
}


function checkMultiple() {
    hasValue = false;
    lang = "en";

    output = null;
    $('.typoControlMultiple').each(function (i, obj) {
        if ($(this).attr("data-lang")) {
            lang = $(this).attr("data-lang");
        } 

        if ($(this).attr("type") === "checkbox")
        {
            if ($(this).is(':checked')) {
                hasValue = true;
            } 
        } else {
            if ($(this).val()) {
                hasValue = true;
            }
        }
      });
      
    if($(".typoControlMultiple")) {
        if(!hasValue) {
            output  = "invalid";
                $("#errorMessageMultiple").html(applyMultipleError(lang));
        } else {
            output = "valid";
                $("#errorMessageMultiple").empty();
        }
    }

    return output;
}