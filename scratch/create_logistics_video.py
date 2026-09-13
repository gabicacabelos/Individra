import cv2
import numpy as np
import math

width = 1280
height = 720
fps = 30
duration_sec = 8
total_frames = fps * duration_sec
output_path = r"c:\Users\Practical Tecno\web\spline-3d-project\public\logistics_loop_ai.mp4"

fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

# Setup static nodes / hubs
np.random.seed(42)
hubs = [
    (width * 0.25, height * 0.35, "HUB DEPÓSITO NORTE"),
    (width * 0.50, height * 0.55, "CENTRO NEURÁLGICO INDIVIDRA"),
    (width * 0.75, height * 0.30, "ZONA INDUSTRIAL ESTE"),
    (width * 0.35, height * 0.75, "LOGÍSTICA OESTE"),
    (width * 0.80, height * 0.70, "DISTRIBUCIÓN SUR"),
]

# Create routes connecting hubs
routes = [
    (hubs[0], hubs[1]),
    (hubs[1], hubs[2]),
    (hubs[0], hubs[3]),
    (hubs[1], hubs[3]),
    (hubs[1], hubs[4]),
    (hubs[2], hubs[4]),
]

# Secondary feeder points
feeders = []
for hx, hy, _ in hubs:
    for _ in range(4):
        angle = np.random.uniform(0, math.tau)
        dist = np.random.uniform(70, 180)
        fx = int(hx + math.cos(angle) * dist)
        fy = int(hy + math.sin(angle) * dist)
        feeders.append(((hx, hy), (fx, fy)))

# Mobile vehicle fleets
vehicles = []
for i, ((x1, y1, _), (x2, y2, _)) in enumerate(routes):
    vehicles.append({
        "p1": (x1, y1),
        "p2": (x2, y2),
        "speed": 1.0 + (i % 3) * 0.4,
        "offset": (i * 0.22) % 1.0,
        "id": f"MOVIL-{i+1:02d}"
    })

print("Rendering high-tech logistics loop video...")

for f in range(total_frames):
    t = f / total_frames  # normalized 0.0 to 1.0
    phase = t * math.tau

    # Dark atmospheric base #0B0D0E
    frame = np.zeros((height, width, 3), dtype=np.uint8)
    frame[:] = (14, 13, 11)  # BGR

    # Draw faint grid lines
    grid_size = 64
    for gx in range(0, width, grid_size):
        cv2.line(frame, (gx, 0), (gx, height), (22, 20, 18), 1)
    for gy in range(0, height, grid_size):
        cv2.line(frame, (0, gy), (width, gy), (22, 20, 18), 1)

    # Radar sweep circle centered on main hub
    cx, cy, _ = hubs[1]
    sweep_r = int(120 + 80 * math.sin(phase))
    cv2.circle(frame, (int(cx), int(cy)), sweep_r, (35, 25, 20), 1)
    cv2.circle(frame, (int(cx), int(cy)), sweep_r + 40, (25, 20, 16), 1)

    # Secondary feeder routes
    for (px, py), (fx, fy) in feeders:
        cv2.line(frame, (int(px), int(py)), (fx, fy), (32, 28, 24), 1, cv2.LINE_AA)
        cv2.circle(frame, (fx, fy), 3, (45, 38, 32), -1)

    # Primary arterial routes with glowing pulses
    for (x1, y1, _), (x2, y2, _) in routes:
        cv2.line(frame, (int(x1), int(y1)), (int(x2), int(y2)), (60, 45, 30), 2, cv2.LINE_AA)
        # Fast pulse particle traveling along line
        pulse_pos = (t * 3.0) % 1.0
        px = int(x1 + (x2 - x1) * pulse_pos)
        py = int(y1 + (y2 - y1) * pulse_pos)
        cv2.circle(frame, (px, py), 5, (20, 106, 200), -1, cv2.LINE_AA) # Orange glowing pulse BGR

    # Draw moving vehicles
    for v in vehicles:
        x1, y1 = v["p1"]
        x2, y2 = v["p2"]
        vt = (t * v["speed"] + v["offset"]) % 1.0
        # Smooth bounce back and forth
        u = 0.5 - 0.5 * math.cos(vt * math.tau)
        vx = int(x1 + (x2 - x1) * u)
        vy = int(y1 + (y2 - y1) * u)

        # Vehicle orange beacon
        cv2.circle(frame, (vx, vy), 7, (20, 80, 220), -1, cv2.LINE_AA)
        cv2.circle(frame, (vx, vy), 14, (10, 40, 110), 1, cv2.LINE_AA)
        cv2.putText(frame, v["id"], (vx + 10, vy + 4), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (160, 150, 140), 1, cv2.LINE_AA)

    # Draw Hub nodes
    for hx, hy, label in hubs:
        cv2.circle(frame, (int(hx), int(hy)), 16, (40, 35, 30), -1, cv2.LINE_AA)
        cv2.circle(frame, (int(hx), int(hy)), 16, (20, 106, 200), 2, cv2.LINE_AA)
        cv2.circle(frame, (int(hx), int(hy)), 6, (255, 255, 255), -1, cv2.LINE_AA)
        cv2.putText(frame, label, (int(hx) - 70, int(hy) - 22), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (180, 170, 160), 1, cv2.LINE_AA)

    # Telemetry timestamp & status overlay
    cv2.putText(frame, "INDIVIDRA TELEMETRY NETWORK · 60 FPS LIVE FEED", (40, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (20, 106, 200), 1, cv2.LINE_AA)
    cv2.putText(frame, f"DISPATCH NODES: {len(hubs)} | FLOTA EN CALLE: {len(vehicles)} | STATUS: ALL SYSTEMS NOMINAL", (40, 75), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (120, 115, 110), 1, cv2.LINE_AA)

    out.write(frame)

out.release()
print(f"Video saved successfully to {output_path}")
