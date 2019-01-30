$(document).ready(function() {
    var searchObj = {
        "originCity": "initial",
        "invoiceNumber": "",
        "LRNumber": "",
        "from": "",
        "to": "",
        "selectStatus": "",
        "customerNumber": "",
    }
    localStorage.setItem('searchObj', JSON.stringify(searchObj));
    var objSorting = {
        "sortType": "initial",
        "name": "",
        "userId": "",
        "getColomnIndex": "",
    }
    localStorage.setItem('objSorting', JSON.stringify(objSorting));
    $("#page-loader").addClass("hide");

    // var user = JSON.parse(localStorage.getItem('user'));
    // $('.hidden-xs').html(user.name);
    // parent.document.location
    // parent.window.document.location
    // parent.window.location
    // parent.document.location.href
    // var parenturl = parent.window.document.location;
    // console.log("parenturl : "+parenturl);
    var appUrl = window.location.protocol + "//" + window.location.host;
    // console.log("appUrl : " + appUrl);
    var url = window.location.href;
    // console.log("url : " + url);

    var mainUrl = document.referrer;
    console.log("mainUrl : " + mainUrl);
    var customer_id = getUrlParameter('id');    
    console.log("customer_id : " + customer_id);
    var customerObj = {
        "customer_id": customer_id,
        "mainUrl": mainUrl,
        "role": "user",
    }

    localStorage.setItem('customerObj', JSON.stringify(customerObj));
    // localStorage.setItem('customer_id', customer_id);
    // if (user.role === "admin") {
    //     $('.customerNumberSearchDiv').removeClass('hide');
    //     $('.downloadList').removeClass('hide');
    // }

    $.ajax({
        url: '/embed/getRetailersById',
        type: 'POST',
        datatype: "json",
        data: {
            "userId": customer_id,
            "role": 'user',
            "mainUrl": mainUrl,
        },
        async: true,
        success: function(res) {
            if (res.resCode === 'Ok') {
                updateUserWidgetValue();
                updateTableValues(res.msg);
            } else {
                // alert('Request failed.  Returned msg is : ', res.msg);
                console.log(res.msg);
                $('#tablecontainerDiv').html('<h1 style="text-align:center;">' + res.msg + '</h1>');
                $("#page-loader").addClass("hide");
            }
        },
        error: function(err) {
            // alert("err");
            console.log("Error executing AJAX request. Please contact your administrator");
        }
    });
});

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

// update data Table body Values function
function updateTableValues(data) {
    $('#tablecontainerDiv').html(" ");
    $('#tablecontainerDiv').html("<table id='data-table' class='table table-striped table-bordered display'  cellspacing=0 width=100%><thead class='Table_header'><tr><th name='local_inv_no' onclick='myFunctionSorting(this)'>Invoice #</th><th name='po_number' onclick='myFunctionSorting(this)'>PO Code</th><th name='lr_no' onclick='myFunctionSorting(this)'>LR Number</th><th name='customer_name' onclick='myFunctionSorting(this)'>Customer Name</th><th name='order_status' onclick='myFunctionSorting(this)'>Status</th><th name='pickup_city' onclick='myFunctionSorting(this)'>Origin</th><th name='delivery_city' onclick='myFunctionSorting(this)'>Destination</th><th name='current_location' onclick='myFunctionSorting(this)'>Latest Location</th><th name='booked_datetime' onclick='myFunctionSorting(this)'>Date Of Dispatch</th><th name='assured_delivery_date' onclick='myFunctionSorting(this)'>Expected Delivery Date</th><th name='pod_image_link' onclick='myFunctionSorting(this)'>POD</th><th>Feedback</th></tr></thead><tbody class='aboutMeTable_body'></tbody></table></div></section>");
    $.each(data, function(i, arr) {
        // var st = statusMapping(arr.status);
        // if(arr.pod){
        //     st = "DELIVERED";
        // }else{
        //     st = arr.status;
        // }
        var body = "<tr>";
        body += "<td class='trackDetails' data-toggle='modal' data-target='#modal-report' style='text-align: center;'><span class='editrowCss'>" + arr.invoice_value + "</span></td>";
        if ((arr.po_number)) {
            body += "<td style='text-align: center;'>" + arr.po_number + "</td>";
        } else {
            body += "<td></td>";
        }
        body += "<td style='text-align: center;'>" + arr.docket_number + "</td>";
        body += "<td style='text-align: center;'>" + arr.customer_name + "</td>";
        // body += "<td style='text-align: center;'>" + arr.status + "</td>";
        if (arr.status) {
            body += "<td style='text-align: center;'>" + arr.status + "</td>";
        } else {
            body += "<td style='text-align: center;'>DISPATCH</td>";
        }
        body += "<td style='text-align: center;'>" + arr.pickup_city + "</td>";
        body += "<td style='text-align: center;'>" + arr.delivery_city + "</td>";
        // body += "<td style='text-align: center;'>" + arr.currentLocation.city + "</td>";
        if (arr.currentLocation.city) {
            body += "<td style='text-align: center;'>" + arr.currentLocation.city + "</td>";
        } else {
            body += "<td style='text-align: center;'>" + arr.pickup_city + "</td>";
        }
        if (arr.createdAt) {
            body += "<td style='text-align: center;'>" + dateToYMD(new Date(arr.createdAt)) + "</td>";
        } else {
            body += "<td></td>";
        }
        if (arr.estimatedTimeOfArrival) {
            body += "<td style='text-align: center;'>" + dateToYMD(new Date(arr.estimatedTimeOfArrival)) + "</td>";
        } else {
            body += "<td></td>";
        }
        if (arr.pod) {
            body += "<td style='text-align: center;'><a target= '_blank' href=" + arr.pod + ">" + arr.pod + "</a></td>";
        } else {
            body += "<td></td>";
        }
        // if (arr.notification === 1) {
        if (arr.notificationNew != null) {
            // body += "<td style='text-align: center;' class='updateNotification'><i class='fa fa-envelope checked'></i></td>";
            body += "<td style='text-align: center;'><span class='alertAndFeedBackSpan' title='Feedback'><a target= '_blank' href='https://goo.gl/forms/Fr33RtzyLwAicrkP2'><i class='fa fa-comments-o'></i></a></span></td>";
        } else {
            // body += "<td style='text-align: center;' class='updateNotification'><i class='fa fa-envelope'></i></td>";
            body += "<td style='text-align: center;'><span class='alertAndFeedBackSpan' title='Feedback'><a target= '_blank' href='https://goo.gl/forms/Fr33RtzyLwAicrkP2'><i class='fa fa-comments-o'></i></a></span></td>";
        }
        body += "</tr>";
        $("#data-table tbody").append(body);
    });
    // TableManageScroller.init();
    // updateNotificationFunction(data);
    viewMoreFunction(data);
    var objSorting = JSON.parse(localStorage.getItem('objSorting'));
    if (objSorting.sortType !== "initial") {
        var sortType = objSorting.sortType;
        if (sortType === 'sorting_desc') {
            sortType = "desc";
        } else {
            sortType = "asc";
        }
        $("#data-table").DataTable({
            dom: "lBfrtip",
            buttons: [{
                extend: "copy",
                className: "btn-sm"
            }, {
                extend: "csv",
                className: "btn-sm"
            }, {
                extend: "excel",
                className: "btn-sm"
            }, {
                extend: "pdf",
                className: "btn-sm"
            }, {
                extend: "print",
                className: "btn-sm"
            }],
            responsive: 0,
            scrollX: !0,
            autoFill: 0,
            colReorder: 0,
            keys: 0,
            rowReorder: 0,
            select: 0,
            "order": [
                [objSorting.getColomnIndex, sortType]
            ],
        });
        localStorage.removeItem('objSorting');
        var objSorting = {
            "sortType": "initial",
            "name": "",
            "userId": "",
            "getColomnIndex": "",
        }
        localStorage.setItem('objSorting', JSON.stringify(objSorting));
        // $("#page-loader").addClass("hide");
    } else {
        // console.log("! === objSorting");       
        TableManageCombine.init();
        // $("#page-loader").addClass("hide");
    }
    handlePageContentView()
}

function dateToYMD(date) {
    var strArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var d = date.getDate();
    var m = strArray[date.getMonth()];
    var y = date.getFullYear();
    return '' + (d <= 9 ? '0' + d : d) + '-' + m + '-' + y;
}

function getColomnIndexFunction(n) {
    if (n === "local_inv_no") return 0;
    if (n === "po_number") return 1;
    if (n === "lr_no") return 2;
    if (n === "customer_name") return 3;
    if (n === "order_status") return 4;
    if (n === "pickup_city") return 5;
    if (n === "delivery_city") return 6;
    if (n === "current_location") return 7;
    if (n === "booked_datetime") return 8;
    if (n === "assured_delivery_date") return 9;
    if (n === "pod_image_link") return 10;
    if (n === "notification") return 11;
    // if (n === "remark") return 11;
    // if (n === "po_number") return 11;
}

function updateUserWidgetValue() {
    var customerObj = JSON.parse(localStorage.getItem('customerObj'));
    // console.log("customer_id : " + customer_id);
    var obj = {
        "userId": customerObj.customer_id,
        "role": customerObj.role,
        "mainUrl": customerObj.mainUrl,
    };
    $.ajax({
        url: '/embed/getUserTotalCountById',
        type: 'POST',
        datatype: "json",
        data: obj,
        async: true,
        success: function(res) {
            if (res.resCode === 'Ok') {
                updateUserWidgetValuesNew(res.msg);
            } else {
                // alert('Request failed.  Returned msg is : ');
                console.log("Error executing AJAX request. Please contact your administrator");
            }
        },
        error: function(err) {
            // alert("err");            
            console.log("Error executing AJAX request. Please contact your administrator");
        }
    });
}

// update User Widget Values Data
function updateUserWidgetValuesNew(res) {
    var i, ns = 0,
        its = 0,
        ofd = 0,
        ds = 0,
        ats = 0,
        ts = 0;
    for (i = 0; i < res.length; i++) {
        if (res[i].order_status === "IN TRANSIT") {
            its = res[i].shipment_count;
        } else if (res[i].order_status === "DELIVERED") {
            ds = res[i].shipment_count;
        } else if (res[i].order_status === "OUT FOR DELIVERY") {
            ofd = res[i].shipment_count;
        } else if (res[i].order_status === "ATTEMPTED") {
            ats = res[i].shipment_count;
        }
        if (res[i].order_status !== null) {
            ts += res[i].shipment_count;
        }
    }
    var customerObj = JSON.parse(localStorage.getItem('customerObj'))
    var obj = {
        "selectStatus": "DELAYED",
        "userId": customerObj.customer_id,
        "role": customerObj.role,
        "mainUrl": customerObj.mainUrl,
    }
    $.ajax({
        url: '/embed/getDelayedById',
        type: 'POST',
        datatype: "json",
        data: obj,
        async: true,
        success: function(res) {
            if (res.resCode === 'Ok') {
                var x = res.msg.length;
                $('#totalShipment').html(ts);
                //$('#OFDShipment').html(ofd);
                $('#inTransitShipment').html(its);
                $('#deliveredShipment').html(ds);
                $('#attemptedShipment').html(ats);
                $('#delayedShipment').html(res.msg.length);
            } else {

            }
        },
        error: function(err) {
            // alert("err");
            console.log("Error executing AJAX request. Please contact your administrator");
        }
    });
}

function myFunctionSorting(t) {
    $("#page-loader").removeClass("hide");
    var sortType = $(t).attr('class');
    if (sortType === 'sorting') {
        sortType = 'sorting_asc';
    } else if (sortType === 'sorting_desc') {
        sortType = 'sorting_asc';
    } else {
        sortType = 'sorting_desc';
    }
    var name = $(t).attr('name');
    var customerObj = JSON.parse(localStorage.getItem('customerObj'));
    var searchObj = JSON.parse(localStorage.getItem("searchObj"));
    var getColomnIndex = getColomnIndexFunction(name);
    if (searchObj.originCity != "initial") {
        var objSorting = {
            "sortType": sortType,
            "name": name,
            "userId": customerObj.customer_id,
            "role": customerObj.user,
            "getColomnIndex": getColomnIndex,
            "originCity": searchObj.originCity,
            "invoiceNumber": searchObj.invoiceNumber,
            "LRNumber": searchObj.LRNumber,
            // "from":searchObj.from,
            // "to":searchObj.to,
            "dispatch": searchObj.dispatch,
            "estimated": searchObj.estimated,
            "selectStatus": searchObj.selectStatus,
            "customerNumber": searchObj.customerNumber,
            "mainUrl": customerObj.mainUrl,
        }
    } else {
        var objSorting = {
            "sortType": sortType,
            "name": name,
            "userId": customerObj.customer_id,
            "role": customerObj.user,
            "getColomnIndex": getColomnIndex,
            "mainUrl": customerObj.mainUrl,
        }
    }

    // console.log("objSorting------in myFunctionSorting++++",objSorting);
    localStorage.setItem('objSorting', JSON.stringify(objSorting));
    $.ajax({
        url: '/embed/getRetailersById',
        type: 'POST',
        datatype: "json",
        data: objSorting,
        async: true,
        success: function(res) {
            // console.log("resCode : ",res.resCode);
            if (res.resCode === 'Ok') {
                updateTableValues(res.msg);
                $("#page-loader").addClass("hide");
            } else {
                // alert('Request failed.  Returned msg is : ');
                console.log(res.msg);
                $('#tablecontainerDiv').html('<h1 style="text-align:center;">' + res.msg + '</h1>');
                $("#page-loader").addClass("hide");
            }
        },
        error: function(err) {
            // alert("err");
            console.log("Error executing AJAX request. Please contact your administrator");
        }
    });
}

// Search Function in Track and Trace App
function searchFunction() {
    $("#page-loader").removeClass("hide");
    var originCity = $('#originCity').val();
    var invoiceNumber = $('#invoiceNumber').val();
    var LRNumber = $('#LRNumber').val();
    // var from  = $('#datepicker-autoCloseFrom').val();
    // var to = $('#datepicker-autoCloseTo').val();
    var dispatch = $('#dateRangepicker-Dispatch').val();
    var estimated = $('#dateRangepicker-Estimated').val();
    // document.getElementById('to').value;
    var selectStatus = document.getElementById('selectStatus').value;
    var customerNumber = $('#customerNumber').val();
    // var userId = localStorage.getItem("userId");
    var customerObj = JSON.parse(localStorage.getItem('customerObj'));
    if ((originCity != "") || (invoiceNumber != "") || (LRNumber != "") || (dispatch != "") || (estimated != "") || ((selectStatus != "") && (selectStatus != "Status")) || (customerNumber != "")) {
        // console.log("selectStatus : ",selectStatus);     
        $('#Filter').removeClass('hide');
    }
    var obj = {
        "originCity": originCity,
        "invoiceNumber": invoiceNumber,
        "LRNumber": LRNumber,
        // "from":from,
        // "to":to,
        "selectStatus": selectStatus,
        "userId": customerObj.customer_id,
        "customerNumber": customerNumber,
        "dispatch": dispatch,
        "estimated": estimated,
        "role": customerObj.user,
        "mainUrl": customerObj.mainUrl,
    }
    localStorage.setItem("searchObj", JSON.stringify(obj));
    $.ajax({
        url: '/embed/getRetailersById',
        type: 'POST',
        datatype: "json",
        data: obj,
        async: true,
        success: function(res) {
            if (res.resCode === 'Ok') {
                updateTableValues(res.msg);
            } else {
                // alert('Request failed.  Returned msg is : ');
                console.log(res.msg);
                $('#tablecontainerDiv').html('<h1 style="text-align:center;">' + res.msg + '</h1>');
                $("#page-loader").addClass("hide");
            }
        },
        error: function(err) {
            // alert("err");
            console.log("Error executing AJAX request. Please contact your administrator");
        }
    });

}


function removeFilterFunction() {
    $('#originCity').val("");
    $('#invoiceNumber').val("");
    $('#LRNumber').val("");
    $('#dateRangepicker-Dispatch').val("");
    $('#dateRangepicker-Estimated').val("");
    $('#selectStatus').val("");
    $('#customerNumber').val("");
    var someValue = "";
    // $('.selectpicker option[value=""]')
    $('#selectStatus').find('option[value=' + someValue + ']').prop('selected', true).trigger('change');
    // $('#Filter').prop('checked', false);
    $('#Filter').addClass('hide');
    $("#page-loader").removeClass("hide");
    // var userId = localStorage.getItem("userId");
    customerObj = JSON.parse(localStorage.getItem("customerObj"));
    localStorage.removeItem('objSorting');
    var objSorting = {
        "sortType": "initial",
        "name": "",
        "userId": "",
        "getColomnIndex": "",
    }
    localStorage.setItem('objSorting', JSON.stringify(objSorting));

    $.ajax({
        url: '/embed/getRetailersById',
        type: 'POST',
        datatype: "json",
        data: {
            "userId": customerObj.customer_id,
            "role": customerObj.user,
            "mainUrl": customerObj.mainUrl,
        },
        async: true,
        success: function(res) {
            // console.log("resCode : ",res.resCode);
            if (res.resCode === 'Ok') {
                updateTableValues(res.msg);
            } else {
                // alert('Request failed.  Returned msg is : ', res.msg);
                console.log(res.msg);
                $('#tablecontainerDiv').html('<h1 style="text-align:center;">' + res.msg + '</h1>');
                $("#page-loader").addClass("hide");
            }
        },
        error: function(err) {
            // alert("err");
            console.log("Error executing AJAX request. Please contact your administrator");
        }
    });
}

function viewMoreFunction(arr) {
    // console.log(arr);
    $(".trackDetails").click(function(e) {
        // $("#page-loader").removeClass("hide");
        var invoice_No = $(this).parents('tr').find('td:first').find('span').html();
        var po_number = $(this).parents('tr').find('td:nth-child(2)').html();
        var lr_No = $(this).parents('tr').find('td:nth-child(3)').html();
        var customer_name = $(this).parents('tr').find('td:nth-child(4)').html();
        var status_No = $(this).parents('tr').find('td:nth-child(5)').html();
        var obj = {};
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].invoice_value == invoice_No) {
                var obj = arr[i];
            }
        }
        // console.log("obj : ", obj);
        $('#exampleModalLongTitle').html("View More About Invoice Number : " + invoice_No);
        var viewMore = '<div class="centerAlignDiv"><table style="width:50%;min-width:300px;" id="viewMoreTable" class="table-bordered table-striped"><tr></table></div>';

        $('#modalBodyReport').html(viewMore);
        var body;
        body += "<tr><th>Invoice Number</th><td>" + obj.invoice_value + "</td></tr>";
        body += "<tr><th>PO Code</th><td>"
        if ((obj.po_number)) {
            body += obj.po_number + "</td></tr>";
        } else {
            body += "</td></tr>";
        }
        body += "<tr><th>LR Number</th><td>" + obj.docket_number + "</td></tr>";
        body += "<tr><th>Customer Name</th><td>" + obj.customer_name + "</td></tr>";
        // body += "<tr><th>Status</th><td>" + obj.status + "</td></tr>";
        body += "<tr><th>Status</th><td>"
        if(obj.status){
            body += obj.status + "</td></tr>";
        }else{
            body += "DISPATCH</td></tr>";
        }        
        body += "<tr><th>Origin</th><td>" + obj.pickup_city + "</td></tr>";
        body += "<tr><th>Destination</th><td>" + obj.delivery_city + "</td></tr>";
        body += "<tr><th>Latest Location</th><td>";
        if (obj.currentLocation.city) {
            body += obj.currentLocation.city + "</td></tr>";
        } else {
            body += obj.pickup_city + "</td></tr>";
        }
        body += "<tr><th>Date Of Dispatch</th><td>"
        if (obj.createdAt) {
            body += dateToYMD(new Date(obj.createdAt)) + "</td></tr>";
        } else {
            body += "</td></tr>";
        }
        body += "<tr><th>Expected Delivery Date</th><td>"
        if (obj.estimatedTimeOfArrival) {
            body += dateToYMD(new Date(obj.estimatedTimeOfArrival)) + "</td></tr>";
        } else {
            body += "</td></tr>";
        }
        body += "<tr><th>POD</th>"
        if (obj.pod) {
            body += "<td><a target= '_blank' href=" + obj.pod + ">" + obj.pod + "</a></td></tr>";
        } else {
            body += "<td></td></tr>";
        }
        body += "<tr><th>Remark</th><td>"
        if ((obj.remark)) {
            body += obj.remark + "</td></tr>";
        } else {
            body += "</td></tr>";
        }
        $("#viewMoreTable").append(body)

        var data = {
            "lr_No": lr_No,
            "CustomerCode": obj.account_number,
        }
        $.ajax({
            url: '/route/viewMoreAndTraceNew',
            type: 'POST',
            datatype: "json",
            data: data,
            async: true,
            success: function(res) {;
                if (res.resCode == 'OK') {
                    updateTracking(res.track, obj);
                } else {
                    var track = '<br><div class="centerAlignDiv"><ol class="progtrckr" data-progtrckr-steps="4"><li class="progtrckr-done">Dispatch ( ' + moment(obj.createdAt).format("YYYY-MM-DD") + ' )</li><li class="progtrckr-todo">In Transit</li><li class="progtrckr-todo">Attempted</li><li class="progtrckr-todo">Delivered</li></ol></div><br>';
                    // var errorDiv = '<br><div class="centerAlignDiv" style="text-align:center;">' + res.msg + '</div><br>';
                    $('#modalBodyReport').append(track);
                    $('#loaderModal').addClass('hide');
                    $('#modalBodyReport').removeClass('hide');
                }
            },
            error: function(err) {
                console.log("Error executing AJAX request. Please contact your administrator");
            }
        });
    });
};

function updateTracking(res, obj) {
    // console.log("Inside updateTracking");
    // console.log(res);
    var inTransitShipment = '';
    var attemptedShipment = '';
    var i, delivered = '';
    for (i = 0; i < res.length; i++) {
        // console.log(res[i].order_status);
        if (res[i].order_status === "IN TRANSIT") {
            // if(inTransitShipment != ''){
            //     if(moment(inTransitShipment).isAfter(moment(res[i].last_delivery_status_date))) {

            //     }else{
            //         inTransitShipment = res[i].last_delivery_status_date;    
            //     }
            // }
            // else{
            //     inTransitShipment = res[i].last_delivery_status_date;
            // }
            inTransitShipment = res[i].last_delivery_status_date;
        } else if (res[i].order_status === "ATTEMPTED") {
            attemptedShipment = res[i].last_delivery_status_date;
        } else if (res[i].order_status === "DELIVERED") {
            delivered = res[i].last_delivery_status_date;
        }
    }
    // console.log("inTransitShipment Before : "+inTransitShipment);
    // console.log("attemptedShipment Before : "+attemptedShipment);    
    // console.log("delivered Before : "+delivered);
    if (delivered != '') {
        if (attemptedShipment == '') {
            attemptedShipment = delivered;
            if (inTransitShipment == '') {
                inTransitShipment = delivered;
            }
        }
    } else if (attemptedShipment != '') {
        if (inTransitShipment == '') {
            inTransitShipment = attemptedShipment;
        }
    }
    // console.log("inTransitShipment After : "+inTransitShipment);
    // console.log("attemptedShipment After : "+attemptedShipment);    
    // console.log("delivered After : "+delivered);            
    var track = '<br><div class="centerAlignDiv"><ol class="progtrckr" data-progtrckr-steps="4"><li class="progtrckr-done">Dispatch ( ' + moment(obj.createdAt).format("YYYY-MM-DD") + ' )</li>';
    if (inTransitShipment) {
        track += '<li class="progtrckr-done">In Transit ( ' + moment(inTransitShipment).format("YYYY-MM-DD") + ' )</li>';
    } else {
        track += '<li class="progtrckr-todo">In Transit</li>';
    }
    if (attemptedShipment) {
        track += '<li class="progtrckr-done">Attempted ( ' + moment(attemptedShipment).format("YYYY-MM-DD") + ' )</li>';
    } else {
        track += '<li class="progtrckr-todo">Attempted</li>';
    }
    if (delivered) {
        track += '<li class="progtrckr-done">Delivered ( ' + moment(delivered).format("YYYY-MM-DD") + ' )</li></ol><br>';
    } else {
        track += '<li class="progtrckr-todo">Delivered</li></ol></div><br>';
    }
    // var track = '<br><div class="centerAlignDiv"><ol class="progtrckr" data-progtrckr-steps="5"><li class="progtrckr-done">Dispatch ( ' + moment(obj.createdAt).format("YYYY-MM-DD") + ' )</li><li class="progtrckr-done">In Transit ( ' + inD + ' )</li><li class="progtrckr-todo">Attempted ( ' + at + ' )</li><li class="progtrckr-todo">Delivered ( ' + de + ' )</li></ol></div><br>';
    $('#modalBodyReport').append(track);
    $('#loaderModal').addClass('hide');
    $('#modalBodyReport').removeClass('hide');

}