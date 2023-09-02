let usernameForm = document.getElementById("username")
let passwordForm = document.getElementById("password")
let usernameMsg = document.getElementById("username_validation_msg")
let passwordMsg = document.getElementById("password_validation_msg")
let form = document.getElementById("signup_form")


// フィールドの変更ごとにバリデーションを実行する
usernameForm.addEventListener('input', validateUsername);
passwordForm.addEventListener('input', validatePassword);

function validateUsername() {
    //特殊文字
    let usernameMsg = document.getElementById("username_validation_msg")
    const pattern = /[~`!@#$%^&*()_+[\]{};':"\\|,.<>/?]/;
    usernameMsg.textContent = ""

    if (usernameForm.value.trim() === '' || usernameForm.value.match(pattern) || usernameForm.value.includes(' ')) {
        usernameForm.classList.remove('success');
        usernameForm.classList.add('error');
        //入力はあるか
        if(usernameForm.value.trim() === ''){
        usernameMsg.textContent += 'ユーザー名は必須です。\n';
        }
        //
        if(pattern.test(usernameForm.value)){
            usernameMsg.textContent += '特殊文字を含めないでください。\n';
        }
        if(usernameForm.value.includes(' ')){
            usernameMsg.textContent += '空白を含めないでください。\n';
        }
    } else {
        usernameForm.classList.remove('error');
        usernameForm.classList.add('success');
        usernameMsg.textContent = 'OK ✅';
    }
}

function validatePassword() {
    passwordMsg.textContent = ""
    let passwordForm = document.getElementById("password")
    if (passwordForm.value === '' || passwordForm.value.length < 8) {
        passwordForm.classList.remove('success');
        passwordForm.classList.add('error');
        if(passwordForm.value.trim() === ''){
            passwordMsg.textContent += 'パスワードは必須です。\n';
        }
        if (passwordForm.value.length < 8){
            passwordMsg.textContent += '八文字以上にしてください。\n'
        }
    }
    else {
        passwordForm.classList.remove('error');
        passwordForm.classList.add('success');
        passwordMsg.textContent = 'OK ✅';
    }
}
let preventEvent = true;
form.addEventListener('submit', function(event) {
    event.preventDefault(); // フォームの実際の送信を防ぐ
    validateUsername();
    validatePassword();

    // バリデーションが成功した場合の処理
    if (usernameForm.classList.contains('success') && passwordForm.classList.contains('success')) {
        // ここでフォームの送信処理を行う
        form.submit()
    }
    else{
        alert("usernameとpasswordが条件を満たしていません。")
    }
});


