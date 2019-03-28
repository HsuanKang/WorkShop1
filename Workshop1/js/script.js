
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
});

function getIndexById(id) {
    l = dataSource.length;

    for (var j = 0; j < l; j++) {
        if (dataSource[j].BookId == id) {
            return j;
        }
    }
    return null;
}

$(document).ready(function () {
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: 
                function(e) {
                    e.success(bookData);
                },
            destroy: function (e) {
                sampleData.splice(getIndexById(e.data.BookId),1);
                e.success();
            }
        },
        pageSize: 20,
        schema: {
            model: {
                id: "BookId",
                fields: {
                    BookId: { editable: false, nullable: true },
                    BookName: { validation: { required: true } },
                    //BookBoughtDate: { type: "date" },
                    BookPrice: { type: "number", validation:{required:true,min:1}},
                    BookAmount: { type: "number", validation:{required:true,min:1}},
                    BookTotal: { type: "number", validation:{required:true,min:1}}
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
            { command: ["destroy"], title: "&nbsp;", width: "200px" },
            { field: "BookId", title: "書籍編號", width: "65px"},
            { field: "BookName", title: "書籍名稱", width: "250px"},
            { field: "BookCategory", title: "書籍種類", width: "100px"},
            { field: "BookAuthor", title: "作者", width: "120px"},
            { field: "BookBoughtDate", title: "購買日期", width: "120px" },
            { field: "BookDeliveredDate", title: "送達狀態", width: "120px" },
            { field: "BookPublisher", title: "發行公司", width: "120px"},
            { field: "BookPrice", title: "金額", width: "80px"},
            { field: "BookAmount", title: "數量", width: "80px"},
            { field: "BookTotal", title: "總計", width: "100px" }
        ]
    });
});