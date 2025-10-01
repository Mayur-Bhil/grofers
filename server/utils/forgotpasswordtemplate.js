const forgotpasswordTemplate = ({name,otp})=>{
    return `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password Email Templates</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto 30px auto;
            background-color: white;
            padding: 20px;
            border: 1px solid #ddd;
        }
        .preview-label {
            background-color: #333;
            color: white;
            padding: 10px;
            margin: -20px -20px 20px -20px;
            font-weight: bold;
        }
        h1 {
            color: #333;
            font-size: 24px;
            margin-bottom: 20px;
        }
        h2 {
            color: #555;
            font-size: 18px;
            margin-bottom: 15px;
        }
        h3 {
            color: #666;
            font-size: 16px;
            margin-bottom: 10px;
        }
        p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 15px;
        }
        .otp-code {
            background-color: #f8f8f8;
            border: 2px solid #ddd;
            padding: 15px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin: 20px 0;
        }
        .button {
            background-color: #007cba;
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 4px;
            display: inline-block;
            margin: 15px 0;
        }
        .footer {
            border-top: 1px solid #eee;
            padding-top: 15px;
            margin-top: 25px;
            color: #999;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="preview-label">OTP Password Reset</div>
        
        <h1>Reset Your Password</h1>
        
        <p>Hello,${name}</p>
        
        <p>You forgot your password. Use the One-Time Password (OTP) below to reset your password.</p>
        
        <div class="otp-code">
            ${otp}
        </div>
        
        <h3>Important:</h3>
        
        <p>This OTP will expire in 60 minutes for security reasons.</p>
        
        <p>If you didn't request this password reset, please contact our support team immediately.</p>
        
        <div class="footer">
            <p>If you're having trouble, contact support at support@blinkit.com</p>
            <p> Thanks </p>
            <p>Blinkit</p>
        </div>
    </div>

</body>
</html>
    
    
    `
}

export default forgotpasswordTemplate;