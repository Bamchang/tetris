let usernameForm = document.getElementById("username")
let passwordForm = document.getElementById("password")
let usernameMsg = document.getElementById("username_validation_msg")
let passwordMsg = document.getElementById("password_validation_msg")
let submit_btn = document.getElementById("submit")

// フィールドの変更ごとにバリデーションを実行する
usernameForm.addEventListener('input', validateUsername);
passwordForm.addEventListener('input', validatePassword);

function validateUsername() {
    //特殊文字
    let usernameMsg = document.getElementById("username_validation_msg")
    const pattern = /[~`!@#$%^&*()_+[\]{};':"\\|,.<>/?]/;
    usernameMsg.textContent = ""

    if (usernameForm.value === '' || pattern.test(usernameForm.value)) {
        usernameForm.classList.add('error');
        //入力はあるか
        if(usernameForm.value === ''){
        usernameMsg.textContent += 'ユーザー名は必須です。\n';
        }
        //
        if(pattern.test(usernameForm.value)){
            usernameMsg.textContent += '空白、特殊文字を含めないでください。\n';
        }
    } else {
        usernameForm.classList.remove('error');
        usernameForm.classList.add('success');
        usernameMsg.textContent = 'OK ✅';
    }
}

function validatePassword() {
    
    let passwordForm = document.getElementById("password")
    if (passwordForm.value === '' || passwordForm.value.length < 8) {
        passwordMsg.classList.add('error');
        if(passwordForm.value === ''){
            passwordValidation.textContent += 'パスワードは必須です。\n';
        }
        if (passwordForm.value.length < 8){
            passwordValidation.textContent += '八文字以上にしてください1。\n'
        }
    }
    else {
        passwordInput.classList.remove('error');
        passwordMsg.textContent = 'OK ✅';
    }
}

form.addEventListener('submit', function(event) {
    event.preventDefault(); // フォームの実際の送信を防ぐ
    validateUsername();
    validatePassword();

    // バリデーションが成功した場合の処理
    if (!usernameForm.classList.contains('error') && !passwordInput.classList.contains('error')) {
        alert("usernameとpasswordが条件を満たしていません。")
        // ここでフォームの送信処理を行う
        submit_btn.submit()
    }
    else{
        alert("usernameとpasswordが条件を満たしていません。")
    }
});


