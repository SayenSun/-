$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();

    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                // console.log(res);
                var htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr);
            },
        });
    }

    var indexAdd = null;
    $("#btnAddCate").on("click", function() {
        indexAdd = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "添加文章分类",
            content: $("#dialog-add").html(),
        });
    });

    // 监听表单提交
    $("body").on("submit", "#form-add", function(e) {
        // 首先阻止默认行为
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                initArtCateList();
                layer.close(indexAdd);
            },
        });
    });

    //
    var indexEdit = null;
    $("tbody").on("click", ".btn-edit", function() {
        indexEdit = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "添加文章分类",
            content: $("#dialog-edit").html(),
        });
        var id = $(this).data("id");
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + id,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg("获取文章分类数据失败!");
                }
                // layer.msg(res.message);
                form.val("form-edit", res.data);
            },
        });
    });

    //
    $("body").on("submit", "#form-edit", function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                initArtCateList();
                layer.close(indexEdit);
            },
        });
    });

    // 删除
    $("tbody").on("click", ".btn-delete", function() {
        var id = $(this).data("id");
        layer.confirm("确定删除?", { icon: 3, title: "提示" }, function(index) {
            //do something
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);
                    layer.close(index);
                    initArtCateList();
                },
            });
        });
    });
});