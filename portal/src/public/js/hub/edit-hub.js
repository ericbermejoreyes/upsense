$(() => {
    const hubId = $('input#data-id').val();

    // load hub data
    loadHubData(function (hubData, zoneData) {
        for (const field in hubData) {
            $('form#hub-form').find(`#hub-${field}`).val(hubData[field]);
        }

        loadCompanyOptions($('form#hub-form select[name="company"]'), zoneData.companyId, function () {
            loadZoneChoices(zoneData.companyId, $('form#hub-form select#hub-zone'), null, hubData.zone.id);
        });
    });

    $('form#hub-form').on('submit', function (e) {
        e.preventDefault();

        let formData = {zone: null};

        if (parseInt($(this).find('select[name="zone"]').val()) != 0) {
            formData.zone = $(this).find('select[name="zone"]').val();
        }

        $.ajax({
            url: `/devices/hub/${hubId}/edit`,
            method: 'post',
            data: {data: formData},
            success: response => {
                console.log(response);
                $('.is-invalid').removeClass('is-invalid');

                if (response.status === 'error') {
                    const errorKeys = Object.keys(response.error)
                    for (let errorField of errorKeys) {
                        $(`#hub-${errorField}`).addClass('is-invalid');
                        $(`#error-hub-${errorField}`).text(response.error[errorField][0]);
                    }
                } else {
                    location.replace('/devices/hub/list');
                }
            }
        });
    });

    $('form#hub-form select[name="company"]').on('change', function (e) {
        if ($(this).val() != 0) {
            loadZoneChoices($(this).val(), $('form#hub-form select#hub-zone'), function () {
                $('form#hub-form .zone-selection').show();
            });
        } else {
            $('form#hub-form .zone-selection').hide();
        }
    });

    function loadZoneChoices(companyId, target, callback = null, zoneId = null)
    {
        $.ajax({
            url: `/company/${companyId}/zone/list`,
            method: 'post',
            success: response => {
                console.log(response);
                const zones = response.data;
                const defaultOption = target.find('option:first-child').detach();
                target.html('').append(defaultOption);

                for (const zone of zones) {
                    let option = $('<option>').text(zone.name).val(zone.id);
                    if (zone.id === zoneId) {
                        option.prop({selected: true})
                    }
                    target.append(option);
                }

                if (callback) callback();
            }
        })
    }

    function loadCompanyOptions(target, companyId = null, callback = null)
    {
        $.ajax({
            url: '/company/list',
            method: 'post',
            success: response => {
                const companies = response.data;

                for (const company of companies) {
                    let option = $('<option>').text(company.name).val(company.id);
                    if (company.id === companyId) {
                        option.prop({selected: true})
                    }
                    target.append(option);
                }

                if (callback) callback();
            }
        })
    }

    function getZoneData(zoneId, callback = null) {
        $.ajax({
            url: `/devices/hub/${hubId}/edit`,
            method: 'get',
            success: response => {
                console.log(response);
                const zoneData = response.data.result || {};

                if (callback) callback(zoneData);
            }
        })
    }

    function loadHubData(callback = null) {
        $.ajax({
            url: `/devices/hub/${hubId}/edit`,
            method: 'get',
            success: response => {
                console.log(response);
                const hubData = response.data.result || {};
                getZoneData(hubData.zone.id,function (zoneData) {
                    if (callback) callback(hubData, zoneData);
                })
            }
        })
    }
});
