const generateOtp = () => {
        return Math.floor(Math.random() * 900000) + 100000 // 0  to 999999
}

export default generateOtp;