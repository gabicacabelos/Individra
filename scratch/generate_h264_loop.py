import math
import numpy as np
import imageio.v3 as iio
import imageio

width = 1280
height = 720
fps = 30
duration_sec = 8
total_frames = fps * duration_sec
output_path = r"c:\Users\Practical Tecno\web\spline-3d-project\public\logistics_loop_ai.mp4"

# Set up writer with browser-native H264 and yuv420p
writer = imageio.get_writer(
    output_path,
    fps=fps,
    codec='libx264',
    pixelformat='yuv420p',
    ffmpeg_params=['-preset', 'medium', '-crf', '22', '-movflags', '+faststart']
)

np.random.seed(101)

# Key hubs (Buenos Aires & GBA Logistics nodes)
hubs = [
    (int(width * 0.22), int(height * 0.32), "DEPÓSITO NORTE"),
    (int(width * 0.48), int(height * 0.52), "CENTRO DE TRAFICO INDIVIDRA"),
    (int(width * 0.78), int(height * 0.38), "RAMPA ESTE / PUERTO"),
    (int(width * 0.32), int(height * 0.72), "DISTRIBUIDORA OESTE"),
    (int(width * 0.72), int(height * 0.78), "CENTRO LOGÍSTICO SUR"),
]

# Arterial routes connecting hubs
routes = [
    (hubs[0], hubs[1]),
    (hubs[1], hubs[2]),
    (hubs[0], hubs[3]),
    (hubs[1], hubs[3]),
    (hubs[1], hubs[4]),
    (hubs[2], hubs[4]),
    (hubs[3], hubs[4]),
]

# Delivery feeder drops around each hub
feeders = []
for hx, hy, _ in hubs:
    for _ in range(6):
        angle = np.random.uniform(0, math.tau)
        dist = np.random.uniform(50, 160)
        fx = int(hx + math.cos(angle) * dist)
        fy = int(hy + math.sin(angle) * dist)
        fx = max(20, min(width - 20, fx))
        fy = max(20, min(height - 20, fy))
        feeders.append(((hx, hy), (fx, fy)))

# Active fleet vehicles with loop continuity
vehicles = []
for i, ((x1, y1, _), (x2, y2, _)) in enumerate(routes):
    vehicles.append({
        "p1": (x1, y1),
        "p2": (x2, y2),
        "cycles": 1 + (i % 2), # integer number of cycles for exact seamless loop
        "phase_offset": (i * 0.16) * math.tau,
        "label": f"M-{i+1:02d}"
    })

import cv2

print(f"Generating {total_frames} frames of H264 logistics video...")

for f in range(total_frames):
    t = f / total_frames
    phase = t * math.tau

    # Clean dark canvas #0B0D0E
    frame = np.zeros((height, width, 3), dtype=np.uint8)
    frame[:] = (11, 13, 14)  # RGB

    # Grid lines
    for gx in range(0, width, 64):
        cv2.line(frame, (gx, 0), (gx, height), (18, 20, 24), 1)
    for gy in range(0, height, 64):
        cv2.line(frame, (0, gy), (width, gy), (18, 20, 24), 1)

    # Pulsing telemetry rings from central hub
    cx, cy, _ = hubs[1]
    for ring_i in range(3):
        r = int(70 + ring_i * 90 + 30 * math.sin(phase + ring_i * 1.5))
        alpha_ring = int(25 + 15 * math.cos(phase + ring_i))
        cv2.circle(frame, (cx, cy), r, (alpha_ring, alpha_ring // 2 + 10, alpha_ring // 3), 1, cv2.LINE_AA)

    # Feeder drop lines
    for (px, py), (fx, fy) in feeders:
        cv2.line(frame, (px, py), (fx, fy), (24, 28, 34), 1, cv2.LINE_AA)
        cv2.circle(frame, (fx, fy), 2, (38, 44, 52), -1, cv2.LINE_AA)

    # Arterial routes
    for (x1, y1, _), (x2, y2, _) in routes:
        cv2.line(frame, (x1, y1), (x2, y2), (40, 35, 30), 2, cv2.LINE_AA)
        cv2.line(frame, (x1, y1), (x2, y2), (65, 45, 30), 1, cv2.LINE_AA)

        # Seamless data packets flowing along the route
        for pkt in range(2):
            pkt_t = (t * 3.0 + pkt * 0.5) % 1.0
            px = int(x1 + (x2 - x1) * pkt_t)
            py = int(y1 + (y2 - y1) * pkt_t)
            cv2.circle(frame, (px, py), 3, (200, 106, 20), -1, cv2.LINE_AA) # Orange packet

    # Moving vehicles with seamless loop
    for v in vehicles:
        x1, y1 = v["p1"]
        x2, y2 = v["p2"]
        # Exact integer cycle cosine oscillation ensures frame 0 == frame total_frames
        u = 0.5 - 0.5 * math.cos(phase * v["cycles"] + v["phase_offset"])
        vx = int(x1 + (x2 - x1) * u)
        vy = int(y1 + (y2 - y1) * u)

        # Outer glow
        cv2.circle(frame, (vx, vy), 10, (140, 50, 10), 1, cv2.LINE_AA)
        # Core beacon
        cv2.circle(frame, (vx, vy), 5, (230, 90, 20), -1, cv2.LINE_AA)
        cv2.putText(frame, v["label"], (vx + 8, vy + 4), cv2.FONT_HERSHEY_SIMPLEX, 0.32, (180, 160, 140), 1, cv2.LINE_AA)

    # Hub circles and labels
    for hx, hy, label in hubs:
        cv2.circle(frame, (hx, hy), 15, (25, 26, 30), -1, cv2.LINE_AA)
        cv2.circle(frame, (hx, hy), 15, (200, 66, 20), 2, cv2.LINE_AA)
        cv2.circle(frame, (hx, hy), 5, (255, 255, 255), -1, cv2.LINE_AA)
        cv2.putText(frame, label, (hx - 60, hy - 20), cv2.FONT_HERSHEY_SIMPLEX, 0.36, (200, 190, 180), 1, cv2.LINE_AA)

    # Telemetry HUD
    cv2.putText(frame, "INDIVIDRA AI OPS // LIVE DISPATCH NETWORK", (40, 45), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (200, 80, 20), 1, cv2.LINE_AA)
    cv2.putText(frame, f"STATUS: ALL FLEET NODES CONNECTED | LATENCY: 24ms | WHATSAPP BOT: ACTIVE", (40, 68), cv2.FONT_HERSHEY_SIMPLEX, 0.34, (130, 125, 120), 1, cv2.LINE_AA)

    writer.append_data(frame)

writer.close()
print("Finished writing native H264 video!")
