
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


$(document).ready(function () {
    var windowTemplate = kendo.template($("#windowTemplate").html());
    kendo.culture("zh-CN");
    var dataSource = new kendo.data.DataSource({
        data: bookData,
        pageSize: 20,
        //transport: {
        //    destroy: {
        //        url: crudServiceBaseUrl + "/Products/Destroy",
        //        dataType: "jsonp"
        //    }
        //},
        //parameterMap: function (options, operation) {
        //    if (operation !== "read" && options.models) {
        //        return { models: kendo.stringify(options.models) };
        //    }
        //},
        schema: {
            model: {
                id: "BookId",
                fields: {
                    BookId: { editable: false, nullable: true },
                    BookName: { validation: { required: true } },
                    BookBoughtDate: { type: "date" },
                    BookPrice: { type: "number", validation: { required: true, min: 1 } },
                    BookAmount: { type: "number", validation: { required: true, min: 1 } },
                    BookTotal: { type: "number", validation: { required: true, min: 1 } }
                }
            }
        }
    });


    $("#book_grid").kendoGrid({
        dataSource: dataSource,
        height: 500,
        pageable: true,
        sortable: true,
        columns: [
            {
                command: [{
                    name: "delete", text: "刪除", click: function (e) {  //add a click event listener on the delete button
                        e.preventDefault(); //prevent page scroll reset
                        var tr = $(e.target).closest("tr"); //get the row for deletion
                        var data = this.dataItem(tr); //get the row data so it can be referred later
                        window.content(windowTemplate(data)); //send the row data object to the template and render it
                        window.center().open();

                        $("#delete_yes").click(function () {
                            grid.dataSource.remove(data)  //prepare a "destroy" request
                            grid.dataSource.sync()  //actually send the request (might be ommited if the autoSync option is enabled in the dataSource)
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
            { field: "BookCategory", title: "書籍種類", width: "100px" },
            { field: "BookAuthor", title: "作者", width: "120px" },
            { field: "BookBoughtDate", title: "購買日期", width: "120px" },
            { field: "BookDeliveredDate", title: "送達狀態", width: "120px" },
            { field: "BookPublisher", title: "發行公司", width: "120px" },
            { field: "BookPrice", title: "金額", width: "80px" },
            { field: "BookAmount", title: "數量", width: "80px" },
            { field: "BookTotal", title: "總計", width: "100px" }]
    }).data("kendoGrid");


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