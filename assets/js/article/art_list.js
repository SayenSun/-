$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(data) {
        var date = new Date();
        var y = date.getFullYear();
        var m = padZero(date.getMonth() + 1);
        var d = padZero(date.getDate());
        var hh = padZero(date.getHours());
        var mm = padZero(date.getMonth());
        var ss = padZero(date.getSeconds());
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    };
    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : "0" + n;
    }

    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: "", // 文章分类的 Id
        state: "", // 文章的发布状态
    };

    initTable();
    initCate();
    // 获取文章列表数据
    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // layer.msg(res.message);
                var htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr);
                renderPage(res.total);
            },
        });
    }

    // 获取文章分类的数据
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取分类数据失败!");
                }
                var htmlStr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlStr);
                // console.log(htmlStr);
                form.render();
            },
        });
    }

    //筛选
    $("#form-search").on("submit", function(e) {
        e.preventDefault();
        var cate_id = $("[name=cate_id]").val();
        var state = $("[name=state]").val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    });

    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        laypage.render({
            elem: "pageBox", //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ["count", "limit", "prev", "page", "next", "skip"],
            limits: [2, 3, 5, 10],
            jump: function(obj, first) {
                // console.log(obj);
                // console.log(obj.curr);
                // console.log(obj.limit);
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    //do something
                    initTable();
                }
            },
        });
    }

    //删除
    $("tbody").on("click", ".btn-delete", function() {
        var id = $(this).data("id");
        // console.log(id);
        var len = $(".btn-delete").length;
        layer.confirm("确定删除吗?", { icon: 3, title: "提示" }, function(index) {
            //do something
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg("删除失败!");
                    }
                    layer.msg(res.message);
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                    layer.close(index);
                },
            });
        });
    });
});