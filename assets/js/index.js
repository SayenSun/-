$(function() {
    getUserInfo();
    //var layer = layui.layer;

    // 点击按钮，实现退出功能
    $("#btnLogout").on("click", function() {
        // 提示用户是否确认退出
        layer.confirm("确定退出登录?", { icon: 3, title: "提示" }, function(index) {
            //do something
            // 1. 清空本地存储中的 token
            localStorage.removeItem("token");
            // 2. 重新跳转到登录页面
            location.href = "./login.html";

            // 关闭 confirm 询问框
            layer.close(index);
        });
    });
});
// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        // 请求头
        // headers: {
        //     Authorization: localStorage.getItem("token") || "",
        // },
        success: function(res) {
            //console.log(res);
            if (res.status != 0) {
                return layer.msg(res.message);
            }
            renderAvatar(res.data);
        },
        // complete: function(res) {
        //     // console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         localStorage.removeItem("token");
        //         location.href = "login.html";
        //     }
        // },
    });
}

// 渲染用户的头像
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name);
    if (user.user_pic !== null) {
        $(".layui-nav-img").attr("src", user.user_pic);
        $(".text-avatar").hide();
    } else {
        // 渲染文本头像
        $(".layui-nav-img").hide();
        var first = name[0].toUpperCase();
        $(".text-avatar").html(first).show();
    }
}