$(document).ready(function() {
    // ==================== TRANG PROFILE ====================
    // Hiển thị thông tin người dùng đăng nhập thành công
    $.ajax({
        type: 'GET',
        url: '/users/me',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        beforeSend: function(xhr) {
            if (localStorage.token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
            }
        },
        success: function(data) {
            $('#profileName').html(data.fullName);
            $('#profileEmail').html(data.email);
            if (data.createdAt) {
                var date = new Date(data.createdAt);
                $('#profileCreated').html(date.toLocaleDateString('vi-VN'));
            }
            if (data.images) {
                $('#images').attr("src", data.images);
            }
        },
        error: function(e) {
            // Không làm gì nếu chưa đăng nhập (trang login/register không cần gọi API này)
        }
    });

    // ==================== ĐĂNG XUẤT ====================
    $('#Logout').click(function() {
        localStorage.clear();
        window.location.href = "/login";
    });

    // ==================== ĐĂNG NHẬP ====================
    $('#Login').click(function() {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        // Validate
        if (!email || !password) {
            $('#loginAlert').html('Vui lòng nhập đầy đủ email và mật khẩu!').show();
            return;
        }

        var basicInfo = JSON.stringify({
            email: email,
            password: password
        });

        // Disable button và hiện loading
        $('#Login').prop('disabled', true).html('Đang đăng nhập...');
        $('#loginAlert').hide();

        $.ajax({
            type: "POST",
            url: "/auth/login",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: basicInfo,
            success: function(data) {
                localStorage.token = data.token;
                window.location.href = "/user/profile";
            },
            error: function(e) {
                $('#Login').prop('disabled', false).html('Đăng Nhập');
                if (e.responseJSON && e.responseJSON.detail) {
                    $('#loginAlert').html('❌ ' + e.responseJSON.detail).show();
                } else {
                    $('#loginAlert').html('❌ Email hoặc mật khẩu không đúng!').show();
                }
            }
        });
    });

    // ==================== ĐĂNG KÝ ====================
    $('#Register').click(function() {
        var fullName = document.getElementById('fullName').value;
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        var confirmPassword = document.getElementById('confirmPassword').value;

        // Validate
        if (!fullName || !email || !password || !confirmPassword) {
            $('#registerAlert').html('Vui lòng nhập đầy đủ thông tin!').show();
            $('#registerSuccess').hide();
            return;
        }

        if (password !== confirmPassword) {
            $('#registerAlert').html('Mật khẩu xác nhận không khớp!').show();
            $('#registerSuccess').hide();
            return;
        }

        if (password.length < 3) {
            $('#registerAlert').html('Mật khẩu phải có ít nhất 3 ký tự!').show();
            $('#registerSuccess').hide();
            return;
        }

        var registerInfo = JSON.stringify({
            fullName: fullName,
            email: email,
            password: password
        });

        // Disable button và hiện loading
        $('#Register').prop('disabled', true).html('Đang đăng ký...');
        $('#registerAlert').hide();
        $('#registerSuccess').hide();

        $.ajax({
            type: "POST",
            url: "/auth/signup",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: registerInfo,
            success: function(data) {
                $('#Register').prop('disabled', false).html('Đăng Ký');
                $('#registerAlert').hide();
                $('#registerSuccess').html('✅ Đăng ký thành công! Đang chuyển đến trang đăng nhập...').show();
                // Chuyển sang trang login sau 2 giây
                setTimeout(function() {
                    window.location.href = "/login";
                }, 2000);
            },
            error: function(e) {
                $('#Register').prop('disabled', false).html('Đăng Ký');
                $('#registerSuccess').hide();
                if (e.responseJSON && e.responseJSON.detail) {
                    $('#registerAlert').html('❌ ' + e.responseJSON.detail).show();
                } else if (e.status === 500) {
                    $('#registerAlert').html('❌ Email đã được sử dụng! Vui lòng dùng email khác.').show();
                } else {
                    $('#registerAlert').html('❌ Đăng ký thất bại! Vui lòng thử lại.').show();
                }
            }
        });
    });

    // Cho phép nhấn Enter để submit form
    $('#password, #email').keypress(function(e) {
        if (e.which === 13 && $('#Login').length) {
            $('#Login').click();
        }
    });

    $('#confirmPassword').keypress(function(e) {
        if (e.which === 13 && $('#Register').length) {
            $('#Register').click();
        }
    });
});
