
var bookDataFromLocalStorage = [];
var bookCategoryList = [
    { text: "資料庫", value: "database", src: "image/database.jpg" },
    { text: "網際網路", value: "internet", src: "image/internet.jpg" },
    { text: "應用系統整合", value: "system", src: "image/system.jpg" },
    { text: "家庭保健", value: "home", src: "image/home.jpg" },
    { text: "語言", value: "language", src: "image/language.jpg" }
];

// 載入書籍資料
function loadBookData() {
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem('bookData'));
    if (bookDataFromLocalStorage == null) {
        bookDataFromLocalStorage = bookData;
        localStorage.setItem('bookData', JSON.stringify(bookDataFromLocalStorage));
    }
}

$(function () {
    loadBookData();
    change();
});


function change() {
    for (i = 0; i < bookData.length; i++) {
        for (j = 0; j < bookCategoryList.length; j++) {
            if (bookData[i].BookCategory == bookCategoryList[j].value) {
                bookData[i].BookCategory = bookCategoryList[j].text;
            }
        }
    }
}


$(document).ready(function () {
    var validator = $("#window").kendoValidator({ //驗證格式
        messages: {
            required: "此欄為必填",
            custom: "送達日期不可早於購買日期"
        },
        rules: {
            custom: function (input) {
                if (input.is("[id = delivered_datepicker]")) {
                    var bought_datepicker = $("#bought_datepicker").val();
                    var delivered_datepicker = $("#delivered_datepicker").val();
                    if ((Date.parse(delivered_datepicker)).valueOf() > (Date.parse(bought_datepicker)).valueOf()) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            }
        }
    }).data("kendoValidator");

    var windowTemplate = kendo.template($("#windowTemplate").html());
    kendo.culture('zh-TW');

    $("#bought_datepicker").kendoDatePicker({
        value: new Date(),
        format: "yyyy-MM-dd",
        culture: "zh-TW",
        dateInput: true
    });

    $("#delivered_datepicker").kendoDatePicker({
        value: new Date(),
        format: "yyyy-MM-dd",
        culture: "zh-TW",
        dateInput: true
    });

    $("#book_category").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: bookCategoryList,
        index: 0,
        change: onChange
    });

    function onChange() {
        var value = $("#book_category").val();
        $("#category")
            .toggleClass("database", value == "database")
            .toggleClass("internet", value == "internet")
            .toggleClass("system", value == "system")
            .toggleClass("home", value == "home")
            .toggleClass("language", value == "language");
    }


    var dataSource = new kendo.data.DataSource({
        data: bookData,
        pageSize: 20,
        schema: {
            model: {
                id: "BookId",
                fields: {
                    BookId: { editable: false, nullable: true },
                    BookName: { validation: { required: true } },
                    BookBoughtDate: { type: "date" },
                    BookDeliveredDate: { type: "date" },
                    BookPrice: { type: "number", validation: { required: true, min: 1 } },
                    BookAmount: { type: "number", validation: { required: true, min: 1 } },
                    BookTotal: { type: "number", validation: { required: true, min: 1 } }
                }
            }
        }
    });

    $("#save_book").on("click", function () { //必填
        if (validator.validate()) {
            alert("success");
        } else {
            alert("error");
        }
    });

    //var viewModel = kendo.observable({

    //    save_book: function (e) {
    //        e.preventDefault();

    //        this.set("confirmed", true);
    //    },
    //    startOver: function () {
    //        this.set("confirmed", false);
    //        this.set("book_name", "");
    //        this.set("book_author", "");
    //        this.set("bought_datepicker", "");
    //        this.set("delivered_datepicker", "");
    //        this.set("book_price", "");
    //        this.set("book_amount", "");
    //    }
    //});
    //kendo.bind(alert("error"), viewModel);
//});

    var book_grid = $("#book_grid").kendoGrid({
        dataSource: dataSource,
        height: 500,
        pageable: true,
        sortable: true,
        columns: [
            {
                command: [{
                    name: "delete", text: "刪除", click: function (e) {
                        e.preventDefault(); //防止頁面滾動
                        var tr = $(e.target).closest("tr"); //取得要刪的列
                        var data = this.dataItem(tr); //列的值
                        window.content(windowTemplate(data)); //送出資料
                        window.center().open();

                        $("#delete_yes").click(function () {
                            book_grid.dataSource.remove(data)  //準備刪除
                            book_grid.dataSource.sync()  //同步送出資料
                            window.close();
                        })
                        $("#delete_no").click(function () {
                            window.close();
                        })
                    }
                }], title: "&nbsp;", width: "100px"
            },
            { field: "BookId", title: "書籍編號", width: "65px" },
            { field: "BookName", title: "書籍名稱", width: "250px" },
            { field: "BookCategory", title: "書籍種類", width: "150px" },
            { field: "BookAuthor", title: "作者", width: "120px" },
            { field: "BookBoughtDate", title: "購買日期", width: "120px", template: "#= kendo.toString(kendo.parseDate(BookBoughtDate, 'MM/dd/yyyy'), 'yyyy-MM-dd') #" },
            {
                field: "BookDeliveredDate", title: "送達狀態", width: "120px",
                template: kendo.template($("#car_template").html()) 
            },
            { field: "BookPublisher", title: "發行公司", width: "120px" },
            { field: "BookPrice", title: "金額", width: "100px", attributes: { "class": "right-align", "data-boo": "foo" }, format: "{0:N0}" },
            { field: "BookAmount", title: "數量", width: "100px", attributes: { "class": "right-align", "data-boo": "foo" }, format: "{0:N0}" },
            { field: "BookTotal", title: "總計", width: "100px", format: "{0}元", attributes: { "class": "right-align", "data-boo": "foo" }, format: "{0:N0}元" }],
        //editable: "incell"
    }).data("kendoGrid");


    $("#car").kendoTooltip();


    $("#add_book").click(function () { //新增書籍視窗
        $("#window").kendoWindow({
            width: 550,
            height: 650,
            title: "新增書籍",
            modal: true,
            actions: ["Minimize", "Maximize", "Close"]
        });
        var win = $("#window").data("kendoWindow");
        win.center().open().center();
    });

    $("#searchBox").on("input", function (e) { //搜尋列
        var listBox = $("#book_grid").data("kendoGrid");
        var searchString = $(this).val();

        listBox.dataSource.filter({
            logic: "or",
            filters: [{ field: "BookName", operator: "contains", value: searchString },
            { field: "BookAuthor", operator: "contains", value: searchString }]
        });
    });

    var window = $("#delete_window").kendoWindow({ //刪除確認視窗
        visible: false,
        width: "600px",
        height: "150px",
    }).data("kendoWindow");

});