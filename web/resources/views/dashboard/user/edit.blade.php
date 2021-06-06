<div class="container">
    <div class="row justify-content-md-center">
        <div class="col col-md-12 col-lg-12">
            <div class="animated fadeIn">
                <form id="edit{{ $role }}Form" autocomplete="off" method="POST" class="needs-validation"
                    novalidate>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">
                                <svg class="c-icon c-icon-sm">
                                    <use xlink:href="/assets/icons/coreui/free-symbol-defs.svg#cui-user"></use>
                                </svg>
                            </span>
                        </div>
                        <input class="form-control" type="text" placeholder="{{ __('First Name') }}" id="firstName"
                            name="firstName" value="" required>
                        <div class="invalid-feedback">
                            Please provide first name.
                        </div>
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">
                                <svg class="c-icon c-icon-sm">
                                    <use xlink:href="/assets/icons/coreui/free-symbol-defs.svg#cui-user"></use>
                                </svg>
                            </span>
                        </div>
                        <input class="form-control" type="text" placeholder="{{ __('Last Name') }}" id="lastName"
                            name="lastName" value="" required>
                        <div class="invalid-feedback">
                            Please provide last name.
                        </div>
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">
                                <svg class="c-icon c-icon-sm">
                                    <use xlink:href="/assets/icons/coreui/free-symbol-defs.svg#cui-mobile"></use>
                                </svg>
                            </span>
                        </div>
                        <input class="form-control" type="text" placeholder="{{ __('Mobile') }}" id="mobile"
                            name="mobile" value="" required>
                        <div class="invalid-feedback">
                            Please provide a valid mobile number.
                        </div>
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">@</span>
                        </div>
                        <input class="form-control" type="email" placeholder="{{ __('E-Mail Address') }}" id="email"
                            name="email" value="" required>
                        <div class="invalid-feedback">
                            Please provide a valid email.
                        </div>
                    </div>
                    @if ($role != 'admin')
                        <div class="form-group row">
                            <div class="col">
                                <label>Assign to company</label>
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">
                                            <svg class="c-icon c-icon-sm">
                                                <use
                                                    xlink:href="/assets/icons/coreui/free-symbol-defs.svg#cui-building">
                                                </use>
                                            </svg>
                                        </span>
                                    </div>
                                    <select class="form-control" name="company" id="company" required>
                                    </select>
                                    <div class="invalid-feedback">
                                        Company is required.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col">
                                <label>Assign to Zones</label>
                                <select multiple class="form-control" id="zones" name="zones[]" required>
                                </select>
                                <div class="invalid-feedback">
                                    Zone is required.
                                </div>
                            </div>
                        </div>
                    @endif
                    <button id="edit{{ $role }}Button" class="btn btn-block btn-success"
                        type="submit">{{ __('Save') }}</button>
                    <a class="btn btn-block btn-secondary" data-dismiss="modal">{{ __('Return') }}</a>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
    $(document).ready(function() {
        let editForm = "edit{{ $role }}Form";

        $('#edit{{ $role }}Modal').on('show.coreui.modal', function(event) {
            var button = $(event.relatedTarget) // Button that triggered the modal
            var id = button.data('id') // Extract info from data-* attributes
            let modal = $(this)

            api.get('/companies/').then((res) => {
                let options = '<option value="0">- select company -</option>';
                $.each(res.data.result, function() {
                    options += '<option value="' + $(this)[0].id + '">' + $(this)[0]
                        .name + '</option>';
                });
                modal.find('#company').html(options).trigger("change");
            }).catch((error) => {
                console.error(error)
            });

            let query = {
                "relations": ["company", "zones"]
            };
            query = encodeURI(JSON.stringify(query));
            api.get('/{{ $role }}s/' + id + '?query=' + query).then((res) => {
                let dt = res.data.result;
                // modal.find("#image").val("src", '/assets/img/avatars/' + dt.image);
                modal.find("#firstName").val(dt.firstName);
                modal.find("#lastName").val(dt.lastName);
                modal.find("#mobile").val(dt.mobile);
                modal.find("#email").val(dt.email);

                if ("{{ $role }}" != "admin") {
                    userZones = dt.zones;
                    modal.find("#company").val(dt.company.id).trigger("change");

                    $.each(userZones, function(i, e) {
                        modal.find("#zones option[value='" + e.id + "']").prop(
                            "selected", true);
                    });
                    console.log(dt)
                }
            }).catch((error) => {
                console.error(error)
            });

            $("#" + editForm).off("submit").on("submit", function(e) {
                e.preventDefault();
                e.stopPropagation();
                api.put('/{{ $role }}s/' + id, {
                        data: {
                            // "username": $(this).find('[name="email"]').val(),
                            // "password": "admin",
                            "firstName": $(this).find('[name="firstName"]').val(),
                            "lastName": $(this).find('[name="lastName"]').val(),
                            "mobile": $(this).find('[name="mobile"]').val(),
                            "email": $(this).find('[name="email"]').val(),
                            "role": "{{ $role }}",
                            "company": $(this).find('[name="company"]').val(),
                            "zones": $(this).find('[name="zones[]"]').val()
                        }
                    })
                    .then((response) => {
                        if (response.error) {
                            showAlert(response.error, 'error')
                        } else {
                            getData("{{ $role }}s");
                            showAlert('User updated', 'success');
                            $("#edit{{ $role }}Modal").modal('hide');
                            $('.needs-validation').removeClass('was-validated');
                            $("#" + editForm).find('input:text, input:password, select')
                                .each(function() {
                                    $(this).val('');
                                });
                        }
                    }, (error) => {
                        if (typeof error.response !== 'undefined') {
                            $.each(error.response.data.error, function(i, v) {
                                // $('.needs-validation').removeClass('was-validated');
                                $("#" + i).addClass('is-invalid').next().text(v)
                            });
                        } else {
                            console.error(error);
                        }
                    });
            });
        });

        $("#" + editForm).find('[name="company"]').off("change").on("change", function() {
            let query = {
                "relations": ["users"]
            };
            query = encodeURI(JSON.stringify(query));
            if ($(this).val() == 0) return false;

            api.get('/companies/' + $(this).val() + '/zones?query=' + query).then((res) => {
                let options = '';
                $.each(res.data.result, function() {
                    options += '<option value="' + $(this)[0].id + '">' + $(this)[0]
                        .name + '</option>';
                })
                $("#" + editForm).find('[name="zones[]"]').html(options);
                $.each(userZones, function(i, e) {
                    $("#" + editForm).find("#zones option[value='" + e.id + "']").prop(
                        "selected", true);
                });
            }).catch((error) => {
                console.error(error)
            });
        });
    });

</script>
