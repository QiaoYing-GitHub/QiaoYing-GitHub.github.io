
//切換到指定狀態的tab
function getUrlParameter(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name) || '';
}

//獲取當前網頁 URL 中指定名稱的查詢status參數的值
let orderStatus = getUrlParameter('status');
if (orderStatus != '') {
    $('#notPay').removeClass('active');
    $('#pills-notPay').removeClass('active');
    $('.nav-link[data-status="' + orderStatus + '"]').addClass('active');
    $('.tab-pane[data-status="' + orderStatus + '"]').addClass('active show');
   

}


const orderManagementApp = new Vue({
    el: '#order-management-app',
    data: {
        orderList: [],
        selectAll: false,
        isShippingTab: false,
        notPayListCurrentPage: 1,
        tobeshippedListCurrentPage: 1,
        perPage: 5,
    },
    created() {
        this.getOrderList()
    },
    computed: {
        notPayList() {
            return this.orderList.filter(o => o.status == 1)
        },
        notPayListCount() {
            return this.notPayList == undefined ? 0 : this.notPayList.length
        },
        tobeshippedList() {
            return this.orderList.filter(o => o.status == 2)
        },
        tobeshippedListCount() {
            return this.tobeshippedList == undefined ? 0 : this.tobeshippedList.length
        },
        toBeReceivedList() {
            return this.orderList.filter(o => o.status == 3)
        },
        toBeReceivedListCount() {
            return this.toBeReceivedList == undefined ? 0 : this.toBeReceivedList.length
        },
        completedList() {
            return this.orderList.filter(o => o.status == 4)
        },
        completedListCount() {
            return this.completedList == undefined ? 0 : this.completedList.length
        },
        cancelList() {
            return this.orderList.filter(o => o.status == 5)
        },
        cancelListCount() {
            return this.cancelList == undefined ? 0 : this.cancelList.length
        },
        // 計算已勾選的訂單數量
        checkedCount() {
            let checkCount = this.tobeshippedList.filter((order) => order.checked).length;
            return checkCount

        },
        // 分頁後的 notPayList
        pagedNotPayList() {
            const start = (this.notPayListCurrentPage - 1) * this.perPage
            const end = start + this.perPage
            return this.notPayList.slice(start, end)
        },
        // 分頁後的 tobeshippedList
        pagedTobeshippedList() {
            const start = (this.tobeshippedListCurrentPage - 1) * this.perPage
            const end = start + this.perPage
            return this.tobeshippedList.slice(start, end)
        },
    },
    methods: {
        getOrderList() {
            axios.get('/api/order/getorderlist')
                .then(res => {
                    console.log(res)
                    this.orderList = res.data.result
                })
        },
        // 全選 checkbox 狀態變更時
        selectAllChanged(event) {
            const checked = event.target.checked;
            this.tobeshippedList.forEach((order) => {
                order.checked = checked
            });
        },
        // 單一訂單 checkbox 狀態變更時
        orderCheckedChanged() {
            this.selectAll = this.tobeshippedList.every((order) => order.checked);
        },
        // 多筆出貨按鈕被點擊時
        shipOrders() {
            const ordersToShip = this.tobeshippedList.filter((order) => order.checked).map((order) => order.orderNumber);
            // 將訂單號碼傳送至後端 API 執行出貨
            console.log('出貨訂單:', ordersToShip);

            $.ajax({
                url: '/api/Order/ShipOrders',
                type: 'POST',
                contentType: "application/json",
                data: JSON.stringify({
                    orderNums: ordersToShip

                }),
                success: function (data) {
                    window.location.href = "/Order/Management?status=tobeshipped"
                }
            });
        },

        shipOrder(orderNumber) {
            console.log(`出貨訂單: ${orderNumber}`);
            $.ajax({
                url: '/api/Order/ShipOrder',
                type: 'POST',
                contentType: "application/json",
                data: JSON.stringify({
                    orderNum: orderNumber

                }),
                success: function (data) {
                    window.location.href = "/Order/Management?status=tobeshipped"
                }
            });
        }
    }
})