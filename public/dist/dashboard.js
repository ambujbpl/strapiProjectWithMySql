$(document).ready(function() {
    $("#page-loader").removeClass("in");
    $("#page-loader").addClass("out");
    var user = JSON.parse(localStorage.getItem('user'));
    if(user) {
        $('.hidden-xs').html("admin");

        if (user.role === "admin") {
            $('.customerNumberSearchDiv').removeClass('hide');
            $('.downloadList').removeClass('hide');
        }
        if (user.user_id == 1){
            $('.adminAccessList').removeClass('hide');    
        }
        GetNoisRegisterDetails(user);
    } else {
        window.location.href='/';
    }
    $("#page-container").addClass("fade in");

    $('#logout').click(function(){
        localStorage.removeItem('user');
        window.location.href='/';
    });

   
});

function CreateNoisTable(data) {
    $('#NoisRegister').DataTable({
        dom: 'Bfrtip',
        buttons: ['csv', 'excel', 'pdf'],
        aDataSort:false,
        aaData:data
    });
}

function GetNoisRegisterDetails(user) {
    // var url = '/nois';
     $.ajax({
        url: '/nois',
        type: 'GET',
        success: function(res) {
            console.log(res, '--------response');
            if(res) {
                CreateNoisTable(res);
            }
            // if (res.resCode === 'Ok') {
            //     if (user.role == "admin") {
            //         updateAdminWidgetValues();
            //     } else {
            //         updateUserWidgetValue();
            //     }
            //     updateTableValues(res.msg);
            // } else {
            //     alert(res.msg);
            //     console.log(res.msg);
            //     setTimeout(function(){ location.replace("./dashboard"); }, 2000);                
            // }
        },
        error: function(err) {
            // alert("err");
            console.log("Error executing AJAX request. Please contact your administrator");
        }
    });
}

function dateToYMD(date) {
    var strArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var d = date.getDate();
    var m = strArray[date.getMonth()];
    var y = date.getFullYear();
    return '' + (d <= 9 ? '0' + d : d) + '-' + m + '-' + y;
}


// Get LR Execption Report
function getDate() {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
}

function getReport() {
    var d = getDate();
    $.ajax({
        url: '/route/getReport',
        type: 'GET',
        datatype: "json",
        async: true,
        success: function(res) {
            fileName = 'LR-Exception-Report_' + d + '.csv';
            if (res.resCode == "OK") {
                // console.log("fileName is:", fileName);
                exportToCsv(fileName, res.msg);
            } else {
                alert(res.msg);
                console.log(res.msg);
                setTimeout(function(){ location.replace("./dashboard"); }, 2000);
            }

        },
        error: function(err) {
            // alert(err);
            console.log("Error executing AJAX request. Please contact your administrator");
        }
    });
}

function exportToCsv(filename, rows) {
    var getRowHeader = function(row) {
        var finalVal = '';
        var result = '';
        $.each(row, function(index, value) {
            if ((index == "invoice_no") || (index == "local_inv_no") || (index == "lr_no") || (index == "customer_id") || (index == "customer_name")) {
                result = index + ',';
                finalVal += result;
            }
        });
        return finalVal + '\n';
    };
    var processRow = function(row) {
        var finalVal = '';
        var result = '';
        $.each(row, function(index, value) {
            if ((index == "invoice_no") || (index == "local_inv_no") || (index == "lr_no") || (index == "customer_id") || (index == "customer_name")) {
                result = '"' + value + '"';
                finalVal += result + ',';
            }
        });
        return finalVal + '\n';
        // console.log("finalVal ----", finalVal);
    };
    var csvFile = '';
    csvFile += getRowHeader(rows[0]);
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }

    // console.log("csvFile ++++",csvFile);
    var blob = new Blob([csvFile], {
        type: 'text/csv;charset=utf-8;'
    });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) {
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}


// Update Notification
function updateNotificationFunction(arr) {
    $(".updateNotification").click(function(e) {
        var invoice_No = $(this).parents('tr').find('td:first span').html();
        var po_number = $(this).parents('tr').find('td:nth-child(2)').html();
        var order_no = $(this).parents('tr').find('td:nth-child(3)').html();
        var lr_No = $(this).parents('tr').find('td:nth-child(4)').html();
        var customer_name = $(this).parents('tr').find('td:nth-child(5)').html();
        var status_No = $(this).parents('tr').find('td:nth-child(6)').html();
        var origin_No = $(this).parents('tr').find('td:nth-child(7)').html();
        var destination_No = $(this).parents('tr').find('td:nth-child(8)').html();
        var current_Location_No = $(this).parents('tr').find('td:nth-child(9)').html();
        var date_Placed_No = $(this).parents('tr').find('td:nth-child(10)').html();
        var assured_No = $(this).parents('tr').find('td:nth-child(11)').html();
        var pod_No = $(this).parents('tr').find('td:nth-child(12)').html();
        var notification_No = $(this).parents('tr').find('td:nth-child(13)').html();
        // console.log("invoice_No----",invoice_No);
        var msg = "Tracking is now enabled on this critical shipment";
        var i;
        for (i = 0; i < arr.length; i++) {
            // console.log(arr[i]);
            if (invoice_No == arr[i].invoice_value) {
                pod_No = arr[i].pod
                notification_No = arr[i].notificationNew
            }
        }
        // if (notification_No != 1) {
        if (notification_No == null) {

        } else {
            msg = "Are you sure you want to disable alerts on this shipment?"
        }

        var r = confirm(msg);
        if (r == true) {

            // if (notification_No === 1) {
            //     notification_No = 0
            // } else {
            //     notification_No = 1
            // }

            if (notification_No == null) {
                notification_No = 0
            } else {
                // notification_No = null
            }
            var user = JSON.parse(localStorage.getItem('user'))
            var obj = {
                "invoice_No": invoice_No,
                "lr_No": lr_No,
                "customer_name": customer_name,
                "status_No": status_No,
                "origin_No": origin_No,
                "destination_No": destination_No,
                "current_Location_No": current_Location_No,
                "date_Placed_No": date_Placed_No,
                "assured_No": assured_No,
                "pod_No": pod_No,
                "order_no":order_no,
                "notification_No": notification_No,
                "userId": user.user_id,
                "role": user.role,
            }
            var data = {
                "userId": user.user_id,
                "role": user.role,
            }
            // console.log("data Obj:", data);
            $.ajax({
                url: '/route/updateNotification',
                type: 'POST',
                datatype: "json",
                data: obj,
                async: true,
                success: function(res) {
                    // console.log("resCode : ",res.resCode);
                    if (res.resCode === 'Ok') {
                        // console.log("res -----++++++",res);
                        $.ajax({
                            url: '/track/getRetailers',
                            type: 'POST',
                            datatype: "json",
                            data: data,
                            async: true,
                            success: function(res) {
                                // console.log("resCode : ",res.resCode);
                                if (res.resCode === 'Ok') {
                                    updateTableValues(res.msg);
                                } else {
                                    alert(res.msg);
                                    console.log(res.msg);
                                    setTimeout(function(){ location.replace("./dashboard"); }, 2000);
                                }
                            },
                            error: function(err) {
                                // alert("err");
                                console.log("Error executing AJAX request. Please contact your administrator");
                            }
                        });
                    } else {
                        alert(res.msg);
                        console.log(res.msg);
                        setTimeout(function(){ location.replace("./dashboard"); }, 2000);
                    }
                },
                error: function(err) {
                    // alert("err");
                    console.log("Error executing AJAX request. Please contact your administrator");
                }
            });
        }
    });
}

// update data Table body Values function
function updateTableValues(data) {
    $('#tablecontainerDiv').html(" ");
    // $('#tablecontainerDiv').html("<table id='data-table' class='table table-striped table-bordered display'  cellspacing=0 width=100%><thead class='Table_header'><tr><th name='local_inv_no' onclick='myFunctionSorting(this)'>pat_IdCard</th><th name='po_number' onclick='myFunctionSorting(this)'>ncr_Number</th><th name='order_no' onclick='myFunctionSorting(this)'>Age</th><th name='lr_no' onclick='myFunctionSorting(this)'>ncr_MedicalCouncilNo</th><th name='customer_name' onclick='myFunctionSorting(this)'>pat_Forename</th><th name='order_status' onclick='myFunctionSorting(this)'>pat_Surname</th><th name='pickup_city' onclick='myFunctionSorting(this)'>pat_Gender</th><th name='delivery_city' onclick='myFunctionSorting(this)'>pat_AddressL1</th><th name='current_location' onclick='myFunctionSorting(this)'>Latest Location</th><th name='booked_datetime' onclick='myFunctionSorting(this)'>pat_DOB</th><th name='assured_delivery_date' onclick='myFunctionSorting(this)'>ncr_IncidenceDate</th><th name='actual_delivery_date' onclick='myFunctionSorting(this)'>pat_DOD</th><th name='transport_name' onclick='myFunctionSorting(this)'>objit_Description</th><th>Edit</th></tr></thead><tbody class='aboutMeTable_body'></tbody></table></div></section>");
    $('#tablecontainerDiv').html("<table id='data-table' class='table table-striped table-bordered display'  cellspacing=0 width=100%><thead class='Table_header'><tr><th name='local_inv_no' onclick='myFunctionSorting(this)'>NoisRef</th><th name='po_number' onclick='myFunctionSorting(this)'>MOTHER_ID</th><th name='order_no' onclick='myFunctionSorting(this)'>INFANT_ID</th><th name='lr_no' onclick='myFunctionSorting(this)'>INFANT_C_NUMBER</th><th name='customer_name' onclick='myFunctionSorting(this)'>INFANT_SURNAME</th><th name='order_status' onclick='myFunctionSorting(this)'>IDOB</th><th name='pickup_city' onclick='myFunctionSorting(this)'>ISEX</th><th name='delivery_city' onclick='myFunctionSorting(this)'>TYPEDEL</th><th name='current_location' onclick='myFunctionSorting(this)'>INFOUTC</th><th name='booked_datetime' onclick='myFunctionSorting(this)'>CASE COMPLETED</th><th style='width: 30px;'></th></tr></thead><tbody class='aboutMeTable_body'></tbody></table></div></section>")

    //<th name='pod_image_link' onclick='myFunctionSorting(this)'>POD</th>
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
        if (arr.order_no) {
            body += "<td style='text-align: center;'>" + arr.order_no + "</td>";
        } else {
            body += "<td></td>";
        }
        body += "<td style='text-align: center;'>" + arr.docket_number + "</td>";
        body += "<td style='text-align: center;'>" + arr.customer_name + "</td>";
        // body += "<td style='text-align: center;'>" + arr.status + "</td>";
        if (arr.status) {
            if(arr.status == "Delivered" || arr.status == "Attempted" || arr.status == "DELIVERED" || arr.status == "ATTEMPTED"){}
            else arr.status = "IN TRANSIT";
            var Today = new Date();
            // console.log("Today : ",Today);
            // console.log("new Date(arr.estimatedTimeOfArrival) : ",new Date(arr.estimatedTimeOfArrival));
            // console.log("boolean : ",(new Date(arr.estimatedTimeOfArrival) < Today));
            if((arr.actual_delivery_date) && (arr.transport_name != "SAFEX") && (arr.transport_name != "SPOTON")) {
                arr.status = "DELIVERED";
            } else if((new Date(arr.estimatedTimeOfArrival) < Today) && (arr.status != "DELIVERED") && ( arr.estimatedTimeOfArrival != null) && ( arr.status != "ATTEMPTED")){
                // console.log("Delayed");
                // console.log("lr_no : ",arr.docket_number);
                arr.status = "DELAYED";
                // console.log("arr.status : ",arr.status);
            }               
            body += "<td style='text-align: center;'>" + arr.status + "</td>";
        } else if((arr.actual_delivery_date) && (arr.transport_name != "SAFEX") && (arr.transport_name != "SPOTON")) {
            body += "<td style='text-align: center;'>DELIVERED</td>";
        } else {
            body += "<td style='text-align: center;'>Local Shipment in transit</td>";
        }
        if(arr.pickup_city){            
            body += "<td style='text-align: center;'>" + arr.pickup_city + "</td>";
        }else{
            body += "<td></td>";            
        }
        if(arr.delivery_city){
            body += "<td style='text-align: center;'>" + arr.delivery_city + "</td>";            
        }else{
            body += "<td></td>";            
        }
        // body += "<td style='text-align: center;'>" + arr.currentLocation.city + "</td>";
        if (arr.currentLocation.city) {
            body += "<td style='text-align: center;'>" + arr.currentLocation.city + "</td>";
        } else {
            body += "<td style='text-align: center;'></td>";
        }
        if (arr.createdAt) {
            if(arr.createdAt != "0000-00-00 00:00:00"){
                body += "<td style='text-align: center;'>" + dateToYMD(new Date(arr.createdAt)) + "</td>";
            }else {
                body += "<td></td>";
            }
        } else {
            body += "<td></td>";
        }
        if (arr.estimatedTimeOfArrival) {
            if(arr.estimatedTimeOfArrival != "0000-00-00 00:00:00"){
                body += "<td style='text-align: center;'>" + dateToYMD(new Date(arr.estimatedTimeOfArrival)) + "</td>";
            }else {
                body += "<td></td>";
            }
        } else {
            body += "<td></td>";
        }
        if (arr.actual_delivery_date) {
            if(arr.actual_delivery_date != "0000-00-00 00:00:00"){
                body += "<td style='text-align: center;'>" + dateToYMD(new Date(arr.actual_delivery_date)) + "</td>";
            }else {
                body += "<td></td>";
            }
        } else {
            body += "<td></td>";
        }
        // if (arr.pod) {
        //     body += "<td style='text-align: center;'><a target= '_blank' href=" + arr.pod + ">" + arr.pod + "</a></td>";
        // }
        if (arr.transport_name) {
            body += "<td style='text-align: center;'>" + arr.transport_name + "</td>";
        } else {
            body += "<td></td>";
        }
        // // if (arr.notification === 1) {
        // if (arr.notificationNew != null) {
        //     // body += "<td style='text-align: center;' class='updateNotification'><i class='fa fa-envelope checked'></i></td>";
        //     body += "<td style='text-align: center;width: 30px;'><span class='updateNotification alertAndFeedBackSpan' title='Edit'><i class='fa fa-envelope checked'></i></span></td>";
        // } else {
        //     // body += "<td style='text-align: center;' class='updateNotification'><i class='fa fa-envelope'></i></td>";
        //     body += "<td style='text-align: center;width: 30px;'><span class='updateNotification alertAndFeedBackSpan' title='Edit'><i class='fa fa-envelope'></i></span></td>";
        // }
        body += "<td class='trackDetails' data-toggle='modal' data-target='#modal-report' style='text-align: center;'><span class='editrowCss' title='Edit'><i class='fa fa-file'></i></span></td>";
        body += "</tr>";
        // var body1 = "<tr><td>111801001</td><td>0123456M</td><td>0123456L</td><td>0999999C</td><td>2011/04/25</td><td>Borg1</td><td>MT</td><td>0</td><td>25</td><td>800</td><td style='text-align: center;width: 30px;'><span class='updateNotification alertAndFeedBackSpan' title='Notification'><i class='fa fa-envelope'></i></span><span class='marginLeft10 alertAndFeedBackSpan' title='Feedback'><a target='_blank' href='https://goo.gl/forms/Fr33RtzyLwAicrkP2'><i class='fa fa-comments-o'></i></a></span></td></tr>";
        // $("#data-table tbody").append(body1);
    });
    var body1 = "<tr><td class='trackDetails' data-toggle='modal' data-target='#modal-report' style='text-align: center;'><span class='editrowCss'>111801001</td><td>0123456M</td><td>0123456L</td><td>0999999C</td><td>2011/04/25</td><td>Borg1</td><td>MT</td><td>0</td><td>25</td><td>800</td><td style='text-align: center;width: 30px;'><span class='updateNotification alertAndFeedBackSpan' title='Notification'><i class='fa fa-pencil'></i></span><span class='marginLeft10 alertAndFeedBackSpan' title='Feedback'><a target='_blank' href='https://goo.gl/forms/Fr33RtzyLwAicrkP2'><i class='fa fa-times'></i></a></span></td></tr><tr><td class='trackDetails' data-toggle='modal' data-target='#modal-report' style='text-align: center;'><span class='editrowCss'>111801002</td><td>0123456N</td><td>0123456L</td><td>0999999C</td><td>2011/04/25</td><td>Borg1</td><td>MT</td><td>1</td><td>22</td><td>900</td><td style='text-align: center;width: 30px;'><span class='updateNotification alertAndFeedBackSpan' title='Notification'><i class='fa fa-pencil'></i></span><span class='marginLeft10 alertAndFeedBackSpan' title='Feedback'><a target='_blank' href='https://goo.gl/forms/Fr33RtzyLwAicrkP2'><i class='fa fa-times'></i></a></span></td></tr><tr><td class='trackDetails' data-toggle='modal' data-target='#modal-report' style='text-align: center;'><span class='editrowCss'>111801003</td><td>0123456O</td><td>0123456L</td><td>0999999C</td><td>2011/04/25</td><td>Borg1</td><td>MT</td><td>0</td><td>27</td><td>700</td><td style='text-align: center;width: 30px;'><span class='updateNotification alertAndFeedBackSpan' title='Notification'><i class='fa fa-pencil'></i></span><span class='marginLeft10 alertAndFeedBackSpan' title='Feedback'><a target='_blank' href='https://goo.gl/forms/Fr33RtzyLwAicrkP2'><i class='fa fa-times'></i></a></span></td></tr><tr><td class='trackDetails' data-toggle='modal' data-target='#modal-report' style='text-align: center;'><span class='editrowCss'>111801004</td><td>0123456P</td><td>0123456L</td><td>0999999C</td><td>2011/04/25</td><td>Borg1</td><td>MT</td><td>3</td><td>29</td><td>800</td><td style='text-align: center;width: 30px;'><span class='updateNotification alertAndFeedBackSpan' title='Notification'><i class='fa fa-pencil'></i></span><span class='marginLeft10 alertAndFeedBackSpan' title='Feedback'><a target='_blank' href='https://goo.gl/forms/Fr33RtzyLwAicrkP2'><i class='fa fa-times'></i></a></span></td></tr><tr><td class='trackDetails' data-toggle='modal' data-target='#modal-report' style='text-align: center;'><span class='editrowCss'>111801005</td><td>0123456A</td><td>0123456U</td><td>0999999C</td><td>2011/04/25</td><td>Borg1</td><td>MT</td><td>3</td><td>29</td><td>800</td><td style='text-align: center;width: 30px;'><span class='updateNotification alertAndFeedBackSpan' title='Notification'><i class='fa fa-pencil'></i></span><span class='marginLeft10 alertAndFeedBackSpan' title='Feedback'><a target='_blank' href='https://goo.gl/forms/Fr33RtzyLwAicrkP2'><i class='fa fa-times'></i></a></span></td></tr><tr><td class='trackDetails' data-toggle='modal' data-target='#modal-report' style='text-align: center;'><span class='editrowCss'>111801006</td><td>0123456Q</td><td>0123456O</td><td>099999UI</td><td>2011/04/28</td><td>Borg1</td><td>MT</td><td>7</td><td>29</td><td>400</td><td style='text-align: center;width: 30px;'><span class='updateNotification alertAndFeedBackSpan' title='Notification'><i class='fa fa-pencil'></i></span><span class='marginLeft10 alertAndFeedBackSpan' title='Feedback'><a target='_blank' href='https://goo.gl/forms/Fr33RtzyLwAicrkP2'><i class='fa fa-times'></i></a></span></td></tr><tr><td class='trackDetails' data-toggle='modal' data-target='#modal-report' style='text-align: center;'><span class='editrowCss'>111801007</td><td>0123457P</td><td>01234569</td><td>09999890</td><td>2011/09/25</td><td>Borg1</td><td>MT</td><td>3</td><td>39</td><td>100</td><td style='text-align: center;width: 30px;'><span class='updateNotification alertAndFeedBackSpan' title='Notification'><i class='fa fa-pencil'></i></span><span class='marginLeft10 alertAndFeedBackSpan' title='Feedback'><a target='_blank' href='https://goo.gl/forms/Fr33RtzyLwAicrkP2'><i class='fa fa-times'></i></a></span></td></tr><tr><td class='trackDetails' data-toggle='modal' data-target='#modal-report' style='text-align: center;'><span class='editrowCss'>111801008</td><td>0123456P</td><td>0123456L</td><td>0999999C</td><td>2011/04/25</td><td>Borg1</td><td>MT</td><td>3</td><td>29</td><td>800</td><td style='text-align: center;width: 30px;'><span class='updateNotification alertAndFeedBackSpan' title='Notification'><i class='fa fa-pencil'></i></span><span class='marginLeft10 alertAndFeedBackSpan' title='Feedback'><a target='_blank' href='https://goo.gl/forms/Fr33RtzyLwAicrkP2'><i class='fa fa-times'></i></a></span></td></tr><tr><td class='trackDetails' data-toggle='modal' data-target='#modal-report' style='text-align: center;'><span class='editrowCss'>111801009</td><td>0123456&</td><td>0123456U</td><td>0999990C</td><td>2017/04/25</td><td>Borg1</td><td>MT</td><td>3</td><td>29</td><td>800</td><td style='text-align: center;width: 30px;'><span class='updateNotification alertAndFeedBackSpan' title='Notification'><i class='fa fa-pencil'></i></span><span class='marginLeft10 alertAndFeedBackSpan' title='Feedback'><a target='_blank' href='https://goo.gl/forms/Fr33RtzyLwAicrkP2'><i class='fa fa-times'></i></a></span></td></tr><tr><td class='trackDetails' data-toggle='modal' data-target='#modal-report' style='text-align: center;'><span class='editrowCss'>111801010</td><td>0123456P</td><td>0123456L</td><td>0999999C</td><td>2011/04/25</td><td>Borg1</td><td>MT</td><td>3</td><td>29</td><td>800</td><td style='text-align: center;width: 30px;'><span class='updateNotification alertAndFeedBackSpan' title='Notification'><i class='fa fa-pencil'></i></span><span class='marginLeft10 alertAndFeedBackSpan' title='Feedback'><a target='_blank' href='https://goo.gl/forms/Fr33RtzyLwAicrkP2'><i class='fa fa-times'></i></a></span></td></tr>";
    $("#data-table tbody").append(body1);
    // TableManageScroller.init();
    updateNotificationFunction(data);
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
            // dom: "lBfrtip",
            // buttons: [{
            //     extend: "copy",
            //     className: "btn-sm"
            // }, {
            //     extend: "csv",
            //     className: "btn-sm"
            // }, {
            //     extend: "excel",
            //     className: "btn-sm"
            // }, {
            //     extend: "pdf",
            //     className: "btn-sm"
            // }, {
            //     extend: "print",
            //     className: "btn-sm"
            // }],
            // responsive: 0,
            // scrollX: !0,
            // autoFill: 0,
            // colReorder: 0,
            // keys: 0,
            // rowReorder: 0,
            // select: 0,
            // "order": [
            //     [objSorting.getColomnIndex, sortType]
            // ],
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

function removeFilterFunction() {
    $('#invoiceNumber').val("");
    $('#poCode').val("");
    $('#orderNo').val("");
    $('#LRNumber').val("");
    $('#selectStatus').val("");
    $('#selectTransporter').val("");
    $('#originCity').val("");
    $('#dateRangepicker-Dispatch').val("");
    $('#dateRangepicker-Estimated').val("");
    $('#customerNumber').val("");
    var someValue = "";
    // $('.selectpicker option[value=""]')
    $('#selectStatus').find('option[value=' + someValue + ']').prop('selected', true).trigger('change');
    $('#selectTransporter').find('option[value=' + someValue + ']').prop('selected', true).trigger('change');
    // $('#Filter').prop('checked', false);
    $('#Filter').addClass('hide');
    $("#page-loader").removeClass("hide");
    // var userId = localStorage.getItem("userId");
    user = JSON.parse(localStorage.getItem("user"));
    localStorage.removeItem('objSorting');
    var objSorting = {
        "sortType": "initial",
        "name": "",
        "userId": "",
        "getColomnIndex": "",
    }
    localStorage.setItem('objSorting', JSON.stringify(objSorting));
    // AD_Ideata
    localStorage.setItem('searchObj', JSON.stringify(objSorting));

    $.ajax({
        url: '/track/getRetailers',
        type: 'POST',
        datatype: "json",
        data: {
            "userId": user.user_id,
            "role": user.role,
        },
        async: true,
        success: function(res) {
            // console.log("resCode : ",res.resCode);
            if (res.resCode === 'Ok') {
                updateTableValues(res.msg);
            } else {
                alert(res.msg);
                console.log(res.msg);
                setTimeout(function(){ location.replace("./dashboard"); }, 2000);
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
    var invoiceNumber = $('#invoiceNumber').val();
    var poCode  = $('#poCode').val();
    var orderNo = $('#orderNo').val();
    var LRNumber = $('#LRNumber').val();
    var selectStatus = document.getElementById('selectStatus').value;
    var selectTransporter = document.getElementById('selectTransporter').value;
    var originCity = $('#originCity').val();
    var dispatch = $('#dateRangepicker-Dispatch').val();
    var estimated = $('#dateRangepicker-Estimated').val();
    var customerNumber = $('#customerNumber').val();
    // document.getElementById('to').value;
    // var userId = localStorage.getItem("userId");
    var user = JSON.parse(localStorage.getItem('user'))
    if ((poCode != "") || (orderNo != "") || (originCity != "") || (invoiceNumber != "") || (LRNumber != "") || (dispatch != "") || (estimated != "") || ((selectStatus != "") && (selectStatus != "Status")) || ((selectTransporter != "") && (selectTransporter != "Transporter")) || (customerNumber != "")) {
        // console.log("selectStatus : ",selectStatus);     
        $('#Filter').removeClass('hide');
    }
    var obj = {
        "originCity": originCity,
        "invoiceNumber": invoiceNumber,
        "LRNumber": LRNumber,
        "poCode":poCode,
        "orderNo":orderNo,
        "selectTransporter":selectTransporter,
        "selectStatus": selectStatus,
        "userId": user.user_id,
        "customerNumber": customerNumber,
        "dispatch": dispatch,
        "estimated": estimated,
        "role": user.role,
    }
    localStorage.setItem("searchObj", JSON.stringify(obj));
    $.ajax({
        url: '/track/getRetailers',
        type: 'POST',
        datatype: "json",
        data: obj,
        async: true,
        success: function(res) {
            if (res.resCode === 'Ok') {
                updateTableValues(res.msg);
            } else {
                alert(res.msg);
                console.log(res.msg);
                setTimeout(function(){ location.replace("./dashboard"); }, 2000);
            }
        },
        error: function(err) {
            // alert("err");
            console.log("Error executing AJAX request. Please contact your administrator");
        }
    });

}

function updateUserWidgetValue() {
    var user = JSON.parse(localStorage.getItem('user'))
    var obj = {
        "userId": user.user_id,
        "role": user.role,
    };
    $.ajax({
        url: '/track/getUserTotalCount',
        type: 'POST',
        datatype: "json",
        data: obj,
        async: true,
        success: function(res) {
            if (res.resCode === 'Ok') {
                updateUserWidgetValuesNew(res.msg);
            } else {
                alert(res.msg);
                console.log(res.msg);
                setTimeout(function(){ location.replace("./dashboard"); }, 2000);
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
        its = ts - ds;
    }
    var user = JSON.parse(localStorage.getItem('user'))
    var obj = {
        "selectStatus": "DELAYED",
        "userId": user.user_id,
        "role": user.role,
    }
    $.ajax({
        url: '/track/getDelayed',
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
                alert(res.msg);
                console.log(res.msg);
                setTimeout(function(){ location.replace("./dashboard"); }, 2000);
            }
        },
        error: function(err) {
            // alert("err");
            console.log("Error executing AJAX request. Please contact your administrator");
        }
    });
}

function updateAdminWidgetValues() {
    var obj = {};
    $.ajax({
        url: '/track/getAdminTotalCount',
        type: 'POST',
        datatype: "json",
        data: obj,
        async: true,
        success: function(res) {
            if (res.resCode === 'Ok') {
                updateAdminWidgetValuesNew(res.msg);
            } else {
                alert(res.msg);
                console.log(res.msg);
                setTimeout(function(){ location.replace("./dashboard"); }, 2000);
            }
        },
        error: function(err) {
            // alert("err");
            console.log("Error executing AJAX request. Please contact your administrator");
        }
    });
}
// update Widget Values Data
function updateAdminWidgetValuesNew(res) {
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
        its = ts - ds;
    }
    var user = JSON.parse(localStorage.getItem('user'))
    var obj = {
        "selectStatus": "DELAYED",
        "userId": user.user_id,
        "role": user.role,
    }
    $.ajax({
        url: '/track/getDelayed',
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
                // alert(res.msg);
                console.log(res.msg);
                $('#totalShipment').html(ts);
                //$('#OFDShipment').html(ofd);
                $('#inTransitShipment').html(its);
                $('#deliveredShipment').html(ds);
                $('#attemptedShipment').html(ats);
                $('#delayedShipment').html("0");
                setTimeout(function(){ location.replace("./dashboard"); }, 2000);
            }
        },
        error: function(err) {
            // alert("err");
            console.log("Error executing AJAX request. Please contact your administrator");
        }
    });
}

// update Widget Values Data
function updateWidgetValues(res) {
    var i, ns = 0,
        its = 0,
        ds = 0,
        ts = 0;
    for (i = 0; i < res.length; i++) {
        if (res[i].status === "NEW") {
            ns++;
        }
        if (res[i].status === "DELIVERED") {
            ds++;
        }
        if ((res[i].status !== "NEW") && (res[i].status !== "DELIVERED")) {
            its++;
        }
    }
    ts = res.length;
    var user = JSON.parse(localStorage.getItem('user'))
    var obj = {
        "selectStatus": "DELAYED",
        "userId": user.user_id,
        "role": user.role,
    }
    $.ajax({
        url: '/track/getDelayed',
        type: 'POST',
        datatype: "json",
        data: obj,
        async: true,
        success: function(res) {
            if (res.resCode === 'Ok') {
                var x = res.msg.length;
                $('#totalShipment').html(ts);
                $('#newShipment').html(ns);
                $('#inTransitShipment').html(its);
                $('#deliveredShipment').html(ds);
                $('#delayedShipment').html(res.msg.length);
                // $("#page-loader").addClass("hide");
            } else {
                // alert(res.msg);
                console.log(res.msg);
                $('#totalShipment').html(ts);
                $('#newShipment').html(ns);
                $('#inTransitShipment').html(its);
                $('#deliveredShipment').html(ds);
                $('#delayedShipment').html("0");
                setTimeout(function(){ location.replace("./dashboard"); }, 2000);
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
    var user = JSON.parse(localStorage.getItem('user'))
    var searchObj = JSON.parse(localStorage.getItem("searchObj"));
    console.log("Debug searchObj : >>>>",searchObj);
    var getColomnIndex = getColomnIndexFunction(name);
    if (searchObj.originCity != "initial") {
        var objSorting = {
            "sortType": sortType,
            "name": name,
            "userId": user.user_id,
            "role": user.role,
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
        }
    } else {
        var objSorting = {
            "sortType": sortType,
            "name": name,
            "userId": user.user_id,
            "role": user.role,
            "getColomnIndex": getColomnIndex,
        }
    }

    // console.log("objSorting------in myFunctionSorting++++",objSorting);
    localStorage.setItem('objSorting', JSON.stringify(objSorting));
    $.ajax({
        url: '/track/applyDataTableSorting',
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
                alert(res.msg);
                console.log(res.msg);
                setTimeout(function(){ location.replace("./dashboard"); }, 2000);
            }
        },
        error: function(err) {
            // alert("err");
            console.log("Error executing AJAX request. Please contact your administrator");
        }
    });
}

function getColomnIndexFunction(n) {
    if (n === "local_inv_no") return 0;
    if (n === "po_number") return 1;
    if (n === "order_no") return 2;
    if (n === "lr_no") return 3;
    if (n === "customer_name") return 4;
    if (n === "order_status") return 5;
    if (n === "pickup_city") return 6;
    if (n === "delivery_city") return 7;
    if (n === "current_location") return 8;
    if (n === "booked_datetime") return 9;
    if (n === "assured_delivery_date") return 10;
    if (n === "actual_delivery_date") return 11;
    if (n === "transport_name") return 12;
    if (n === "notification") return 13;
    // if (n === "pod_image_link") return 11;
    // if (n === "remark") return 11;
    // if (n === "po_number") return 11;
}

// function uploadReport() {
//     var d = getDate();
//     $.ajax({
//         url: '/csvfileupload',
//         type: 'POST',
//         datatype: "json",
//         async: true,
//         success: function(res) {
//             fileName = 'LR-Exception-Report_' + d + '.csv';
//             if (res.resCode == "OK") {
//                 // console.log("fileName is:", fileName);
//                 exportToCsv(fileName, res.msg);
//             } else {
//                 // alert(res.msg);
//                 console.log(res.msg);
//             }

//         },
//         error: function(err) {
//             // alert(err);
//             console.log("Error executing AJAX request. Please contact your administrator");
//         }
//     });
// }

function modalBodyLoad(e) {
    // e.preventDefault();
    $('#modalBody').load("modal.html");
}

function modalBodyLoadIdc(e) {
    // e.preventDefault();
    $('#modalBodyIdc').load("modalIdc.html");
}

function statusMapping(n) {
    n = n.toUpperCase();
    // console.log("statusMapping(n) : ",n);
    if ((n == "ATTEMPTED") || (n.startsWith("ATTEMPTED "))) return "ATTEMPTED";
    else if ((n == "ATTEMPTED-CHANGE OF DELIVERY ADDRESS") || (n.startsWith("ATTEMPTED-CHANGE OF DELIVERY ADDRESS"))) return "ATTEMPTED";
    else if ((n == "ATTEMPTED-COMPANY CLOSED ON DELIVERY ATTEMPT") || (n.startsWith("ATTEMPTED-COMPANY CLOSED ON DELIVERY ATTEMPT"))) return "ATTEMPTED";
    else if ((n == "ATTEMPTED-WRONG OR INCOMPLETE DELIVERY ADDRESS") || (n.startsWith("ATTEMPTED-WRONG OR INCOMPLETE DELIVERY ADDRESS"))) return "ATTEMPTED";
    else if ((n == "DELIVERED") || (n.startsWith("DELIVERED"))) return "DELIVERED";
    else if ((n == "DELIVERY ATTEMPTED") || (n.startsWith("DELIVERY ATTEMPTED"))) return "ATTEMPTED";
    else if ((n == "FINAL LINE HAUL DEPARTED") || (n.startsWith("FINAL LINE HAUL DEPARTED"))) return "IN TRANSIT";
    else if ((n == "NEW") || (n.startsWith("NEW"))) return "IN TRANSIT";
    else if ((n == "ODA CON OUT FOR DELIVERY, FINAL STATUS AWAITED") || (n.startsWith("ODA CON OUT FOR DELIVERY, FINAL STATUS AWAITED"))) return "OUT FOR DELIVERY";
    else if ((n == "OUT FOR DELIVERY") || (n.startsWith("OUT FOR DELIVERY"))) return "OUT FOR DELIVERY";
    else if ((n == "OUTSCANNED") || (n.startsWith("OUTSCANNED"))) return "IN TRANSIT";
    else if ((n == "RECEIVED AT DESTINATION DEPOT") || (n.startsWith("RECEIVED AT DESTINATION DEPOT"))) return "IN TRANSIT";
    else if ((n == "RECEIVED AT DESTINATION DEPOT-RECEIVER REFUSED TO ACCEPT DELIVERY") || (n.startsWith("RECEIVED AT DESTINATION DEPOT-RECEIVER REFUSED TO ACCEPT DELIVERY"))) return "IN TRANSIT";
    else if ((n == "RECEIVED AT DESTINATION DEPOT-REFUSED - DELIVERY RESCHEDULED BY CUSTOMER") || (n.startsWith("RECEIVED AT DESTINATION DEPOT-REFUSED - DELIVERY RESCHEDULED BY CUSTOMER"))) return "IN TRANSIT";
    else if ((n == "RECEIVED AT TRANSIT DEPOT") || (n.startsWith("RECEIVED AT TRANSIT DEPOT"))) return "IN TRANSIT";
    else if ((n == "RECEIVED AT TRANSIT DEPOT-EWAYBILL INVALID / WRONG TRANSPORTER ID") || (n.startsWith("RECEIVED AT TRANSIT DEPOT-EWAYBILL INVALID / WRONG TRANSPORTER ID"))) return "IN TRANSIT";
    else if ((n == "RECEIVED AT TRANSIT DEPOT-RECEIVER REFUSED TO ACCEPT DELIVERY") || (n.startsWith("RECEIVED AT TRANSIT DEPOT-RECEIVER REFUSED TO ACCEPT DELIVERY"))) return "IN TRANSIT";
    else if ((n == "CONSIGNMENT SORTED AND TRANSHIPPED") || (n.startsWith("CONSIGNMENT SORTED AND TRANSHIPPED"))) return "IN TRANSIT";
    else if ((n == "DAMAGE DELIVERY") || (n.startsWith("DAMAGE DELIVERY"))) return "IN TRANSIT";
    else if ((n == "OUTSCANNED") || (n.startsWith("OUTSCANNED"))) return "IN TRANSIT";
    else return n;
}

function viewMoreFunction(arr) {
    // console.log(arr);
    $(".trackDetails").click(function(e) {
        // $("#page-loader").removeClass("hide");
        $('#modalBodyReport').html(" ");
        var invoice_No = $(this).parents('tr').find('td:first').find('span').html();
        var po_number = $(this).parents('tr').find('td:nth-child(2)').html();
        var lr_No = $(this).parents('tr').find('td:nth-child(4)').html();
        var customer_name = $(this).parents('tr').find('td:nth-child(5)').html();
        var status_No = $(this).parents('tr').find('td:nth-child(6)').html();
        var obj = {};
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].invoice_value == invoice_No) {
                var obj = arr[i];
            }
        }
        // console.log("obj : ", obj);
        $('#exampleModalLongTitle').html("View More About pat_IdCard : " + invoice_No);
        var viewMore = '<div class="centerAlignDiv"><table style="width:50%;min-width:300px;" id="viewMoreTable" class="table-bordered table-striped"><tr></table></div>';

        $('#modalBodyReport').html(viewMore);
        var body;
        body += "<tr><th>pat_IdCard</th><td><input type='text' name='pat_IdCard' value=" + obj.invoice_value + "></td></tr>";
        body += "<tr><th>ncr_Number</th><td>"
        if ((obj.po_number)) {
            body += "<input type='text' name='pat_IdCard' value=" + obj.po_number + "></td></tr>";
        } else {
            body += "<input type='text' name='pat_IdCard'></td></tr>";
        }
        body += "<tr><th>Age</th><td>"
        if ((obj.order_no)) {
            body += "<input type='text' name='pat_IdCard' value=" + obj.order_no + "></td></tr>";
        } else {
            body += "<input type='text' name='pat_IdCard'></td></tr>";
        }
        body += "<tr><th>ncr_MedicalCouncilNo</th><td><input type='text' name='pat_IdCard' name=" + obj.docket_number + "></td></tr>";
        body += "<tr><th>pat_Forename</th><td><input type='text' name='pat_IdCard' value=" + obj.customer_name + "></td></tr>";
        body += "<tr><th>pat_Surname</th><td>"
        if(obj.status){            
            if(obj.status == "Delivered" || obj.status == "Attempted" || obj.status == "DELIVERED" || obj.status == "ATTEMPTED"){}
            else obj.status = "IN TRANSIT";            
            var Today = new Date();
            // console.log("obj.estimatedTimeOfArrival : ",obj.estimatedTimeOfArrival);
            if((obj.actual_delivery_date) && (obj.transport_name != "SAFEX") && (obj.transport_name != "SPOTON")) {
                obj.status = "DELIVERED";
            }else if((new Date(obj.estimatedTimeOfArrival) < Today) && (obj.status != "DELIVERED") && ( obj.estimatedTimeOfArrival != null) && ( obj.status != "ATTEMPTED")){    
                // console.log("Delayed");
                obj.status = "DELAYED";
                // console.log("obj.status : ",obj.status);
            }
            body += "<input type='text' name='pat_IdCard' value=" +obj.status + "></td></tr>";
        }else{
            body += "<input type='text' name='pat_IdCard'></td></tr>";
        }
        if(obj.pickup_city){
            body += "<tr><th>pat_Gender</th><td><input type='text' name='pat_IdCard' value=" + obj.pickup_city + "></td></tr>";
        } else {
            body += "<tr><th>Origin</th><td><input type='text' name='pat_IdCard'></td></tr>";
        }
        if(obj.delivery_city){
            body += "<tr><th>pat_AddressL1</th><td><input type='text' name='pat_IdCard' value=" + obj.delivery_city + "></td></tr>";
        } else {
            body += "<tr><th>pat_AddressL1</th><td><input type='text' name='pat_IdCard'></td></tr>";
        }
        body += "<tr><th>Latest Location</th><td>";
        if (obj.currentLocation.city) {
            body += "<input type='text' name='pat_IdCard' value=" +obj.currentLocation.city + "</td></tr>";
        } else {
            body += "<input type='text' name='pat_IdCard'></td></tr>";
        }        
        body += "<tr><th>pat_DOB</th><td>"
        if (obj.createdAt) {
            if(obj.createdAt != "0000-00-00 00:00:00"){
                body += "<input type='text' name='pat_IdCard' value=" + dateToYMD(new Date(obj.createdAt)) + "></td></tr>";
            }else{
                body += "<input type='text' name='pat_IdCard'></td></tr>";    
            }
        } else {
            body += "<input type='text' name='pat_IdCard'></td></tr>";
        }
        body += "<tr><th>ncr_IncidenceDate</th><td>"
        if (obj.estimatedTimeOfArrival) {
            if(obj.estimatedTimeOfArrival != "0000-00-00 00:00:00"){
                body += "<input type='text' name='pat_IdCard' value=" + dateToYMD(new Date(obj.estimatedTimeOfArrival)) + "></td></tr>";
            }else{
                body += "<input type='text' name='pat_IdCard'></td></tr>";    
            }
        } else {
            body += "<input type='text' name='pat_IdCard'></td></tr>";
        }
        body += "<tr><th>pat_DOD</th><td>"
        if (obj.actual_delivery_date) {
            if(obj.actual_delivery_date != "0000-00-00 00:00:00"){
                body += "<input type='text' name='pat_IdCard' value=" + dateToYMD(new Date(obj.actual_delivery_date)) + "></td></tr>";
            }else{
                body += "<input type='text' name='pat_IdCard'></td></tr>";    
            }
        } else {
            body += "<input type='text' name='pat_IdCard'></td></tr>";
        }
        body += "<tr><th>objit_Description</th><td>"
        if ((obj.transport_name)) {
            body += "<input type='text' name='pat_IdCard' value=" +obj.transport_name + "></td></tr>";
        } else {
            body += "<input type='text' name='pat_IdCard'></td></tr>";
        }        
        $("#viewMoreTable").append(body);
        $('#loaderModal').addClass('hide');
        $('#modalBodyReport').removeClass('hide');
    });
};

function updateTracking(res, obj) {
    // console.log("Inside updateTracking");
    // console.log(res);
    var inTransitShipment = '';
    var attemptedShipment = '';
    var i, delivered = '';
    var bigDate='2000-10-23T03:13:00.000Z';
    var bigStatus="";
    for (i = 0; i < res.length; i++) {
        // console.log(res[i].order_status);
        if (res[i].order_status === "IN TRANSIT" || (res[i].order_status != "ATTEMPTED" && res[i].order_status != "DELIVERED")) {
            // console.log(res[i].order_status);
            //     console.log("I am Here");
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
           // console.log("New res[i].last_delivery_status_date : ",res[i].last_delivery_status_date);
           // console.log("New bigStatus : ",bigStatus); 
           // console.log("new Date(res[i].last_delivery_status_date : ",new Date(res[i].last_delivery_status_date));
           // console.log("new Date(bigDate) : ",new Date(bigDate));
        if(new Date(res[i].last_delivery_status_date) >= new Date(bigDate)){
           bigDate = res[i].last_delivery_status_date;
           bigStatus = res[i].order_status; 
           // console.log("New bigDate : ",bigDate);
           // console.log("New bigStatus : ",bigStatus); 
        }
    }
    // console.log("inTransitShipment Before : "+inTransitShipment);
    // console.log("attemptedShipment Before : "+attemptedShipment);    
    // console.log("delivered Before : "+delivered);
    if((obj.actual_delivery_date) && (obj.transport_name != "SAFEX") && (obj.transport_name != "SPOTON")) {
        delivered = obj.actual_delivery_date;
    }
    if (delivered != '') {
        if (attemptedShipment == '' || attemptedShipment == "0000-00-00 00:00:00") {
            attemptedShipment = delivered;
            if (inTransitShipment == '' || inTransitShipment == "0000-00-00 00:00:00") {
                inTransitShipment = delivered;
            }
        }else if (inTransitShipment == '' || inTransitShipment == "0000-00-00 00:00:00") {
            inTransitShipment = attemptedShipment;
        }
    } else if (attemptedShipment != '') {
        if (inTransitShipment == '' || inTransitShipment == "0000-00-00 00:00:00") {
            inTransitShipment = attemptedShipment;
        }
    }
    if(bigStatus == "DELIVERED"){
    }else if(bigStatus == "ATTEMPTED"){
        delivered = '';    
    }else if(bigStatus == "IN TRANSIT"){
        delivered = '';
        attemptedShipment = '';    
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

function modalBodyLoadLogs(e) {
    // e.preventDefault();
    $('#modalBodyLogs').load("modalLogs.html");
}

function modalBodyLoadUserList(e) {
    // e.preventDefault();
    $('#modalBodyUserList').load("modalUsers.html");
}

// function modalBodyLoadLogs(){ 
//     var viewMore = '<div class="centerAlignDiv"></div>';
//     $('#modalBodyLogs').html(viewMore);
//     $('.centerAlignDiv').html(" ");
//     var data = {};
//     $.ajax({
//         url: '/route/logs',
//         type: 'POST',
//         datatype: "json",
//         data: data,
//         async: true,
//         success: function(res) {;
//             if (res.resCode == 'OK') {
//                 updateLogsBodyFun(res.logs);
//             } else {
//                 var track = '<br>' + res.msg + '<br>';
//                 $('.loaderModal').addClass('hide');
//                 $('#modalBodyLogs').removeClass('hide');
//             }
//         },
//         error: function(err) {
//             console.log("Error executing AJAX request. Please contact your administrator");
//         }
//     });
// }

// function updateLogsBodyFun(data){
//     // sort by id
//     data.sort(function (a, b) {
//       return  b.id - a.id;
//     });
//     $('.centerAlignDiv').html(" ");
//     $('.centerAlignDiv').html("<table id='table-logs' class='LogsTable'  cellspacing=0 width=100%><thead class='Table_header LogsTable_header'><tr><th style='text-align: center;'>File Name</th><th style='text-align: center;'>Date</th><th style='text-align: center;'>User Name</th><th style='text-align: center;'>User Id</th><th style='text-align: center;'>File Type</th></tr></thead><tbody class='LogsTable_body'></tbody></table>");
//     $.each(data, function(i, arr) {
//         var body = "<tr>";
//             body += "<td style='text-align: center;'>" + arr.originalName + "</td>";
//             body += "<td style='text-align: center;'>" + moment(arr.createdDate).format("DD-MM-YYYY HH:mm:ss") + "</td>";
//             body += "<td style='text-align: center;'>" + arr.userName + "</td>";
//             body += "<td style='text-align: center;'>" + arr.userId + "</td>";
//             body += "<td style='text-align: center;'>" + arr.fileType + "</td>";        
//             body += "</tr>";
//         $("#table-logs tbody").append(body);
//     });
//     var table = $('#table-logs').DataTable({
//         // scrollY:        '50vh',
//         // scrollCollapse: true,
//         paging:         true,
//         "aaSorting": [],
//     });
//     setTimeout(function(){ 
//         table.columns.adjust().draw();
//         $('.loaderModal').addClass('hide');
//         $('#modalBodyLogs').removeClass('hide');
//     }, 1000);
//     $("#table-logs").css({"width":"100%"});   
//     table.columns.adjust().draw();
//     // $(".dataTables_scrollHeadInner").css({"width":"100%"});
// }