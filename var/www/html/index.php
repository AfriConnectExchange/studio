<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Africonnectexchange - Coming Soon</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-color-hsl: 346.8 77.2% 49.8%; /* Your brand's primary HSL color */
            --primary-color: hsl(var(--primary-color-hsl));
            --background-color: #f4f4f7; /* Light Gray */
            --text-color: #1a202c; /* Dark Gray for text */
            --accent-color: #2d3748; /* Slightly darker gray for accents */
        }
        
        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            font-family: 'Inter', sans-serif;
            background-color: var(--background-color);
            color: var(--text-color);
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            overflow: hidden;
        }

        .container {
            position: relative;
            z-index: 2;
            padding: 2rem;
            max-width: 700px;
        }

        .logo-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            margin-bottom: 2.5rem;
            animation: fadeInLogo 1s ease-out;
        }

        .logo-icon-wrapper {
            width: 48px;
            height: 48px;
            background-color: var(--primary-color);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 20px -5px hsla(var(--primary-color-hsl), 0.4);
        }

        .logo-icon-wrapper span {
            color: white;
            font-size: 1.5rem;
            font-weight: 800;
        }

        .logo-text {
            font-size: 2rem;
            font-weight: 800;
            color: var(--primary-color);
        }

        h1 {
            font-size: 3.5rem;
            font-weight: 800;
            color: var(--text-color);
            margin: 0 0 1.5rem 0;
            animation: fadeInDown 1s ease-out 0.2s;
            animation-fill-mode: both;
        }
        
        .subtitle {
            font-size: 1.25rem;
            line-height: 1.6;
            color: var(--accent-color);
            opacity: 0.9;
            margin: 0 auto 2.5rem auto;
            max-width: 600px;
            animation: fadeInUp 1s ease-out 0.5s;
            animation-fill-mode: both;
        }

        .contact-info {
            display: inline-flex; /* Changed for icon alignment */
            align-items: center;
            gap: 0.75rem; /* Space between icon and text */
            font-size: 1rem;
            font-weight: 500;
            animation: fadeInUp 1s ease-out 0.8s;
            animation-fill-mode: both;
            padding: 0.5rem 1rem;
            background-color: rgba(0,0,0,0.02);
            border: 1px solid rgba(0,0,0,0.05);
            border-radius: 9999px;
        }

        .contact-info svg {
            width: 1.25rem;
            height: 1.25rem;
            color: var(--accent-color);
            opacity: 0.7;
        }

        .contact-info a {
            color: var(--primary-color);
            text-decoration: none;
            font-weight: 700;
            transition: opacity 0.3s;
        }

        .contact-info a:hover {
            opacity: 0.8;
        }
        
        .footer {
            position: absolute;
            bottom: 2rem;
            left: 0;
            right: 0;
            font-size: 0.875rem;
            color: var(--accent-color);
            opacity: 0.6;
        }

        /* Background Animation */
        .background-shapes {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 1;
        }

        .shape {
            position: absolute;
            display: block;
            list-style: none;
            width: 20px;
            height: 20px;
            background-color: hsla(var(--primary-color-hsl), 0.1);
            animation: animateShapes 25s linear infinite;
            bottom: -180px;
            border-radius: 20%;
        }

        .shape:nth-child(1) { left: 25%; width: 80px; height: 80px; animation-delay: 0s; }
        .shape:nth-child(2) { left: 10%; width: 20px; height: 20px; animation-delay: 2s; animation-duration: 12s; }
        .shape:nth-child(3) { left: 70%; width: 20px; height: 20px; animation-delay: 4s; }
        .shape:nth-child(4) { left: 40%; width: 60px; height: 60px; animation-delay: 0s; animation-duration: 18s; }
        .shape:nth-child(5) { left: 65%; width: 20px; height: 20px; animation-delay: 0s; }
        .shape:nth-child(6) { left: 75%; width: 110px; height: 110px; animation-delay: 3s; opacity: 0.5; }
        .shape:nth-child(7) { left: 35%; width: 150px; height: 150px; animation-delay: 7s; }
        .shape:nth-child(8) { left: 50%; width: 25px; height: 25px; animation-delay: 15s; animation-duration: 45s; }
        .shape:nth-child(9) { left: 20%; width: 15px; height: 15px; animation-delay: 2s; animation-duration: 35s; }
        .shape:nth-child(10) { left: 85%; width: 150px; height: 150px; animation-delay: 0s; animation-duration: 11s; }
        .shape:nth-child(11) { left: 5%; width: 40px; height: 40px; animation-delay: 5s; animation-duration: 22s; }
        .shape:nth-child(12) { left: 90%; width: 30px; height: 30px; animation-delay: 8s; animation-duration: 30s; }

        @keyframes animateShapes {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(-120vh) rotate(720deg); opacity: 0; }
        }
        
        @keyframes fadeInLogo {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
        }

        @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
            h1 { font-size: 2.8rem; }
            .subtitle { font-size: 1.1rem; }
        }
    </style>
</head>
<body>

    <ul class="background-shapes">
        <li></li><li></li><li></li><li></li><li></li>
        <li></li><li></li><li></li><li></li><li></li>
        <li></li><li></li>
    </ul>

    <div class="container">
        <div class="logo-container">
            <div class="logo-icon-wrapper">
                <span>AE</span>
            </div>
            <span class="logo-text">Africonnectexchange</span>
        </div>
        <h1>Our Marketplace is Launching Soon</h1>
        <p class="subtitle">
            We are working hard to bring you a seamless platform for the African diaspora in the UK to connect, trade, and thrive. Something exciting is on its way.
        </p>

        <div class="contact-info">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
            <span>For more information, contact us at <a href="mailto:info@africonnectexchange.org">info@africonnectexchange.org</a></span>
        </div>
    </div>

    <div class="footer">
        &copy; <?php echo date("Y"); ?> Africonnectexchange. All Rights Reserved.
    </div>

    <script>
        document.addEventListener('mousemove', function(e) {
            const container = document.querySelector('.container');
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const rotateY = -x / 30;
            const rotateX = y / 30;

            container.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale3d(1, 1, 1)`;
            container.style.transition = 'transform 0.1s ease-out';
        });

        document.querySelector('.container').addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale3d(1, 1, 1)';
            this.style.transition = 'transform 0.5s ease-in-out';
        });
    </script>
</body>
</html>
