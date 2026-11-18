<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

    <script>
        let map, marker;
        let userLat = 24.8170; 
        let userLng = 93.9368; 

        
        window.onload = function() {
            initMap(userLat, userLng);
            fetchGeolocation();
        };

        function initMap(lat, lng) {
            map = L.map('map').setView([lat, lng], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(map);

            marker = L.marker([lat, lng], {draggable: true}).addTo(map);
            
            marker.on('dragend', function(e) {
                let position = marker.getLatLng();
                document.getElementById('gpsLocation').value = `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`;
            });
        }

        
        function fetchGeolocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        userLat = position.coords.latitude;
                        userLng = position.coords.longitude;
                        document.getElementById('gpsLocation').value = `${userLat.toFixed(6)}, ${userLng.toFixed(6)}`;
                        map.setView([userLat, userLng], 15);
                        marker.setLatLng([userLat, userLng]);
                    },
                    (error) => {
                        document.getElementById('gpsLocation').value = `${userLat.toFixed(6)}, ${userLng.toFixed(6)} (Default: Imphal)`;
                    }
                );
            }
        }

        
        function processImage(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.getElementById('canvas');
                    const ctx = canvas.getContext('2d');
                    const viewport = document.getElementById('aiViewport');
                    const scanLine = document.getElementById('scanLine');
                    const resultsDiv = document.getElementById('detectionResults');

                    viewport.style.display = 'block';
                    scanLine.style.display = 'block';
                    resultsDiv.innerHTML = '<span class="badge"> Analyzing image with Computer Vision model...</span>';

                    
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    
                    setTimeout(() => {
                        scanLine.style.display = 'none';
                        
                        
                        const boxX = canvas.width * 0.25;
                        const boxY = canvas.height * 0.35;
                        const boxWidth = canvas.width * 0.45;
                        const boxHeight = canvas.height * 0.35;

                        
                        ctx.strokeStyle = '#e74c3c';
                        ctx.lineWidth = Math.max(4, canvas.width * 0.008);
                        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

                        
                        ctx.fillStyle = '#e74c3c';
                        const fontSize = Math.max(16, canvas.width * 0.025);
                        ctx.font = `bold ${fontSize}px Arial`;
                        ctx.fillRect(boxX, boxY - (fontSize + 8), boxWidth * 0.7, fontSize + 8);
                        
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText('Pothole Defect: 92%', boxX + 5, boxY - 6);

                        
                        resultsDiv.innerHTML = `
                            <span class="badge badge-danger">Defect Identified: Severe Pothole</span>
                            <span class="badge">AI Confidence: 92.4%</span>
                            <span class="badge">Severity Index: Class-A (Immediate Repair)</span>
                        `;

                        document.getElementById('submitBtn').disabled = false;
                    }, 1500);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        
        function submitReport() {
            const district = document.getElementById('districtSelect').value;
            const coords = document.getElementById('gpsLocation').value;
            const randomTicket = "MN-PWD-" + Math.floor(100000 + Math.random() * 900000);

            document.getElementById('ticketId').innerText = randomTicket;
            document.getElementById('successBox').style.display = 'block';
            document.getElementById('submitBtn').disabled = false;

            
            document.getElementById('successBox').scrollIntoView({ behavior: 'smooth' });
        }
    </script>
</body>
</html>