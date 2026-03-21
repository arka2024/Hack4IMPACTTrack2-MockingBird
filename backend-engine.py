import cv2
import numpy as np
import base64
import time
import asyncio
import re
import os
import logging
from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

try:
    from ultralytics import YOLO
except Exception:
    YOLO = None

try:
    import torch
    from transformers import AutoTokenizer, AutoModelForSequenceClassification
except Exception:
    torch = None
    AutoTokenizer = None
    AutoModelForSequenceClassification = None

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("adversaguard")

YOLO_MODEL_PATH = os.getenv("YOLO_MODEL_PATH", "models/yolov11n-patch.pt")
YOLO_CONF_THRESHOLD = float(os.getenv("YOLO_CONF_THRESHOLD", "0.35"))

DEBERTA_MODEL_PATH = os.getenv("DEBERTA_MODEL_PATH", "models/deberta-v3-small-objection")
TEXT_LABELS = [x.strip() for x in os.getenv("TEXT_LABELS", "normal,objection,manipulation_or_coercion").split(",") if x.strip()]

VISION_MODEL = None
TEXT_MODEL = None
TEXT_TOKENIZER = None

# Statistics tracker for dashboard
ANALYSIS_STATS = {
    "total_frames": 0,
    "total_blocked": 0,
    "total_threats": 0,
    "honeypot_captures": 0,
    "threat_distribution": {"MONITOR": 0, "RESTRICT": 0, "DEGRADE": 0, "TRANSFER": 0, "EM_STOP": 0, "BLOCKED": 0},
    "last_update": None,
}

app = FastAPI(title="AdversaGuard Backend Engine", version="1.0")

# Allow CORS so the frontend can hit this API locally
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class FrameData(BaseModel):
    image_b64: str  # The base64 string from the webcam
    device_id: str = "CAM-01"
    signal_text: str = ""

class ThreatResponse(BaseModel):
    threat_score: int
    attack_type: str
    action: str
    message: str
    detection_flags: List[str] = Field(default_factory=list)

def load_models() -> None:
    """Loads optional ML models. If unavailable, system keeps heuristic fallbacks active."""
    global VISION_MODEL, TEXT_MODEL, TEXT_TOKENIZER

    # Vision model (YOLOv11n fine-tuned for patch/sticker attacks)
    if YOLO is not None and os.path.exists(YOLO_MODEL_PATH):
        try:
            VISION_MODEL = YOLO(YOLO_MODEL_PATH)
            logger.info("Loaded YOLO model from %s", YOLO_MODEL_PATH)
        except Exception as exc:
            logger.warning("Failed to load YOLO model (%s). Using heuristic fallback.", exc)
            VISION_MODEL = None
    else:
        logger.info("YOLO model not loaded. Set YOLO_MODEL_PATH to enable model inference.")

    # Text model (DeBERTa-v3-small fine-tuned for normal/objection/manipulation)
    if (
        torch is not None
        and AutoTokenizer is not None
        and AutoModelForSequenceClassification is not None
        and os.path.exists(DEBERTA_MODEL_PATH)
    ):
        try:
            TEXT_TOKENIZER = AutoTokenizer.from_pretrained(DEBERTA_MODEL_PATH)
            TEXT_MODEL = AutoModelForSequenceClassification.from_pretrained(DEBERTA_MODEL_PATH)
            TEXT_MODEL.eval()
            logger.info("Loaded DeBERTa model from %s", DEBERTA_MODEL_PATH)
        except Exception as exc:
            logger.warning("Failed to load DeBERTa model (%s). Using heuristic fallback.", exc)
            TEXT_MODEL = None
            TEXT_TOKENIZER = None
    else:
        logger.info("DeBERTa model not loaded. Set DEBERTA_MODEL_PATH to enable text model inference.")

def decode_image(b64_string: str) -> np.ndarray:
    """Decodes a base64 image string into an OpenCV image (numpy array)."""
    # Remove header if present (e.g. "data:image/jpeg;base64,")
    if "," in b64_string:
        b64_string = b64_string.split(",")[1]
    
    img_data = base64.b64decode(b64_string)
    np_arr = np.frombuffer(img_data, np.uint8)
    return cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

def detect_threats_heuristic(image: np.ndarray) -> dict:
    """
    Main detection logic for adversarial attacks and faults.
    Returns a threat score 0-100 and an attack type.
    """
    if image is None:
        return {"score": 95, "type": "Camera Feed Corrupted"}

    # 1. Detect Adversarial "Tape/Patch" Attacks
    # We look for stark contrast unnatural geometric blobs in the frame (often printed patches or tape)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blurred, 50, 150)
    
    # Calculate density of sharp edges. 
    # Adversarial patches (like QR codes or stark noise) create extremely dense edge clusters.
    edge_density = np.sum(edges) / 255.0 / edges.size
    
    # 2. Add some logic for "Lens Obfuscation / Blindness"
    # If the image is entirely dark or completely washed out (someone covered the camera)
    mean_brightness = np.mean(gray)
    
    # 3. Assess overall score based on the anomalies
    score = 5  # Base normal score (Level 1 Monitor)
    attack_type = "Normal Scene"

    if mean_brightness < 20: 
        score = 85 # Extreme threat (Camera Covered)
        attack_type = "Lens Covered / Sensor Blinded"
    elif edge_density > 0.12:
        # Abnormally high density of edges usually means an adversarial patch is held up
        score = min(int((edge_density - 0.12) * 500) + 40, 98)
        attack_type = "Physical Patch / Sticker Attack"
    elif edge_density > 0.08:
        # Moderate anomaly (maybe complex object)
        score = 35
        attack_type = "Moderate Edge Clustering"

    # Add a little randomness for the live demo "AI feel"
    score = min(max(score + np.random.randint(-5, 5), 0), 100)

    return {"score": score, "type": attack_type, "flags": ["vision_source:heuristic"]}

def detect_threats_yolo(image: np.ndarray) -> dict:
    """Runs YOLO patch/sticker detection if a fine-tuned model is loaded."""
    if image is None:
        return {"score": 95, "type": "Camera Feed Corrupted", "flags": ["vision_source:yolo"]}

    # Ultralytics accepts numpy arrays directly.
    results = VISION_MODEL.predict(source=image, conf=YOLO_CONF_THRESHOLD, verbose=False)
    if not results:
        return {"score": 6, "type": "Normal Scene", "flags": ["vision_source:yolo", "vision:no_detections"]}

    result = results[0]
    boxes = result.boxes
    if boxes is None or len(boxes) == 0:
        return {"score": 6, "type": "Normal Scene", "flags": ["vision_source:yolo", "vision:no_detections"]}

    confidences = boxes.conf.detach().cpu().numpy() if hasattr(boxes.conf, "detach") else np.array(boxes.conf)
    class_ids = boxes.cls.detach().cpu().numpy().astype(int) if hasattr(boxes.cls, "detach") else np.array(boxes.cls).astype(int)
    names = result.names if hasattr(result, "names") else {}

    max_idx = int(np.argmax(confidences))
    max_conf = float(confidences[max_idx])
    class_name = str(names.get(int(class_ids[max_idx]), "Patch/Sticker Attack"))

    # Convert model confidence to demo risk score.
    # 0.35 conf => ~58 score, 1.0 conf => 100 score.
    score = int(min(max(35 + (max_conf * 65), 0), 100))
    flags = [
        "vision_source:yolo",
        f"vision:class={class_name}",
        f"vision:confidence={max_conf:.3f}"
    ]
    return {"score": score, "type": class_name, "flags": flags}

def detect_scene_context(image: np.ndarray) -> dict:
    """
    Scene-aware heuristic:
    - Human-only frame should stay low risk.
    - Handheld/rectangular high-frequency objects (phone, ID card, accessories) raise risk.
    """
    if image is None:
        return {"score": 90, "type": "Camera Feed Corrupted", "flags": ["scene:invalid"]}

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    h, w = gray.shape

    # Detect frontal faces to identify human presence.
    face_detector = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    faces = face_detector.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(40, 40))
    face_count = 0 if faces is None else len(faces)

    # Focus on torso-hand area where phones, cards, and bracelets are commonly held.
    y1, y2 = int(0.35 * h), int(0.95 * h)
    x1, x2 = int(0.20 * w), int(0.80 * w)
    roi = gray[y1:y2, x1:x2]

    if roi.size == 0:
        return {
            "score": 12 if face_count > 0 else 20,
            "type": "Human Presence Verified" if face_count > 0 else "No Human Context",
            "flags": [f"scene:faces={face_count}", "scene:roi_empty"],
        }

    edges = cv2.Canny(roi, 60, 180)
    edge_density = float(np.sum(edges) / 255.0 / edges.size)

    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    roi_area = float(roi.shape[0] * roi.shape[1])
    rect_like = 0
    for c in contours:
        area = cv2.contourArea(c)
        if area < 0.007 * roi_area or area > 0.35 * roi_area:
            continue
        peri = cv2.arcLength(c, True)
        if peri <= 0:
            continue
        approx = cv2.approxPolyDP(c, 0.03 * peri, True)
        x, y, cw, ch = cv2.boundingRect(c)
        if ch == 0:
            continue
        aspect = cw / float(ch)
        if 4 <= len(approx) <= 9 and 0.35 <= aspect <= 2.8:
            rect_like += 1

    has_object_cue = rect_like >= 1 or edge_density >= 0.115

    if face_count > 0 and not has_object_cue:
        return {
            "score": 10,
            "type": "Human Presence Verified",
            "flags": [
                f"scene:faces={face_count}",
                f"scene:edge_density={edge_density:.3f}",
                "scene:human_only",
            ],
        }

    if has_object_cue:
        if rect_like >= 2:
            obj_type = "Phone/ID-like Rectangular Object"
        elif edge_density >= 0.15:
            obj_type = "Reflective Accessory / Bracelet-like Object"
        else:
            obj_type = "Foreign Handheld Object"

        obj_score = min(88, max(55, 50 + (rect_like * 10) + int(edge_density * 120)))
        return {
            "score": int(obj_score),
            "type": obj_type,
            "flags": [
                f"scene:faces={face_count}",
                f"scene:rect_like={rect_like}",
                f"scene:edge_density={edge_density:.3f}",
                "scene:object_cue",
            ],
        }

    return {
        "score": 22 if face_count == 0 else 16,
        "type": "Uncertain Scene Context",
        "flags": [f"scene:faces={face_count}", f"scene:edge_density={edge_density:.3f}"]
    }

def detect_threats(image: np.ndarray) -> dict:
    if VISION_MODEL is not None:
        try:
            base = detect_threats_yolo(image)
        except Exception as exc:
            logger.warning("YOLO inference failed (%s). Falling back to heuristic detector.", exc)
            base = detect_threats_heuristic(image)
    else:
        base = detect_threats_heuristic(image)

    context = detect_scene_context(image)
    base_score = int(base.get("score", 0))
    context_score = int(context.get("score", 0))

    # If scene is confidently human-only, keep risk low unless another detector is strongly certain.
    if "scene:human_only" in context.get("flags", []) and base_score < 35:
        score = min(18, max(base_score, context_score))
        threat_type = "Human Presence Verified"
    else:
        score = max(base_score, context_score)
        threat_type = context.get("type") if context_score >= base_score else base.get("type", "Normal Scene")

    return {
        "score": score,
        "type": threat_type,
        "flags": (base.get("flags", []) + context.get("flags", [])),
    }

def detect_language_risk_heuristic(signal_text: str) -> dict:
    """
    Lightweight objection/manipulation detector for live demos.
    Returns linguistic risk score, label, and whether the input should be blocked.
    """
    if not signal_text or not signal_text.strip():
        return {
            "score": 0,
            "type": "No Linguistic Threat",
            "flags": [],
            "block": False,
            "message": "No objection/manipulation signal provided.",
            "label": "normal"
        }

    text = signal_text.lower()

    objection_patterns = [
        "i don't agree", "i do not agree", "i refuse", "i won't", "i will not",
        "this is unsafe", "i dont trust", "i don't trust", "not comfortable",
        "stop this", "decline", "reject"
    ]

    manipulation_patterns = [
        "act now", "limited time", "only today", "or else", "trust me",
        "keep this secret", "don't tell", "guaranteed return", "no risk",
        "everyone is doing it", "you have no choice", "urgent transfer",
        "send immediately", "bypass"
    ]

    coercion_patterns = [
        "if you don't", "you must", "do it now", "or you will", "forced"
    ]

    flags = []
    score = 0

    for p in objection_patterns:
        if p in text:
            flags.append(f"objection:{p}")
            score += 10

    for p in manipulation_patterns:
        if p in text:
            flags.append(f"manipulation:{p}")
            score += 22

    for p in coercion_patterns:
        if p in text:
            flags.append(f"coercion:{p}")
            score += 25

    # Bonus for suspicious punctuation pressure like "!!!" often used in coercive prompts.
    if re.search(r"!{2,}", signal_text):
        flags.append("pressure:excessive_exclamation")
        score += 8

    score = min(score, 100)
    has_manipulation = any(f.startswith("manipulation:") or f.startswith("coercion:") for f in flags)

    if has_manipulation:
        label = "Manipulative Prompting"
    elif flags:
        label = "User Objection Signal"
    else:
        label = "No Linguistic Threat"

    block = score >= 45 and has_manipulation

    if block:
        message = "Manipulation/coercion pattern detected. Request blocked for safety review."
    elif flags:
        message = "Objection/manipulation indicators detected. Request restricted pending validation."
    else:
        message = "No significant linguistic risk patterns detected."

    return {
        "score": score,
        "type": label,
        "flags": flags,
        "block": block,
        "message": message,
        "label": "manipulation_or_coercion" if has_manipulation else ("objection" if flags else "normal")
    }

def detect_language_risk_deberta(signal_text: str) -> dict:
    """Runs DeBERTa classifier if available. Expects 3 labels: normal, objection, manipulation_or_coercion."""
    text = (signal_text or "").strip()
    if not text:
        return {
            "score": 0,
            "type": "No Linguistic Threat",
            "flags": ["text_source:deberta", "text:empty"],
            "block": False,
            "message": "No objection/manipulation signal provided.",
            "label": "normal"
        }

    inputs = TEXT_TOKENIZER(text, return_tensors="pt", truncation=True, max_length=256)
    with torch.no_grad():
        logits = TEXT_MODEL(**inputs).logits
        probs = torch.softmax(logits, dim=-1).squeeze(0)

    pred_idx = int(torch.argmax(probs).item())
    pred_prob = float(probs[pred_idx].item())
    pred_label = TEXT_LABELS[pred_idx] if pred_idx < len(TEXT_LABELS) else str(pred_idx)

    if pred_label == "normal":
        score = int(max(0, min(20, pred_prob * 15)))
        attack_type = "No Linguistic Threat"
        block = False
        message = "No significant linguistic risk patterns detected."
    elif pred_label == "objection":
        score = int(max(20, min(55, 20 + pred_prob * 35)))
        attack_type = "User Objection Signal"
        block = False
        message = "Objection indicators detected. Restricted flow recommended for validation."
    else:
        score = int(max(55, min(100, 55 + pred_prob * 45)))
        attack_type = "Manipulative Prompting"
        block = score >= 65
        message = (
            "Manipulation/coercion pattern detected. Request blocked for safety review."
            if block
            else "Manipulation risk detected. Escalation required before execution."
        )

    flags = [
        "text_source:deberta",
        f"text:label={pred_label}",
        f"text:confidence={pred_prob:.3f}"
    ]
    return {
        "score": score,
        "type": attack_type,
        "flags": flags,
        "block": block,
        "message": message,
        "label": pred_label
    }

def detect_language_risk(signal_text: str) -> dict:
    if TEXT_MODEL is not None and TEXT_TOKENIZER is not None and torch is not None:
        try:
            return detect_language_risk_deberta(signal_text)
        except Exception as exc:
            logger.warning("DeBERTa inference failed (%s). Falling back to heuristic detector.", exc)
    out = detect_language_risk_heuristic(signal_text)
    out["flags"] = ["text_source:heuristic"] + out["flags"]
    return out

def map_hierarchy(score: int, device_id: str) -> dict:
    """ Maps the 0-100 score to the 5-Level Response Hierarchy """
    if score <= 20:
        return {"action": "MONITOR", "msg": "Silent logging active. System operating normally."}
    elif score <= 40:
        return {"action": "RESTRICT", "msg": f"High stakes decisions blocked for {device_id}."}
    elif score <= 60:
        return {"action": "DEGRADE", "msg": "Confidence mathematically reduced. Maintenance scheduled."}
    elif score <= 80:
        return {"action": "TRANSFER", "msg": f"Camera disabled. System transferred to LiDAR failover."}
    else:
        return {"action": "EM_STOP", "msg": "CRITICAL ATTACK: Physical system locked down!"}

@app.on_event("startup")
async def startup_event() -> None:
    load_models()

@app.get("/api/v1/model-status")
async def model_status():
    return {
        "vision_model_loaded": VISION_MODEL is not None,
        "vision_model_path": YOLO_MODEL_PATH,
        "text_model_loaded": TEXT_MODEL is not None and TEXT_TOKENIZER is not None,
        "text_model_path": DEBERTA_MODEL_PATH,
        "text_labels": TEXT_LABELS,
        "fallback_active": VISION_MODEL is None or TEXT_MODEL is None or TEXT_TOKENIZER is None
    }

@app.get("/api/v1/dashboard-stats")
async def get_dashboard_stats():
    """Returns current analysis statistics for dashboard display"""
    return ANALYSIS_STATS

@app.post("/api/v1/analyze-frame", response_model=ThreatResponse)
async def process_frame(data: FrameData):
    """
    Endpoint that accepts webcam frames from the frontend, runs OpenCV heuristics
    to detect adversarial patches, and returns the 5-Level Response.
    """
    # 1. Decode Image
    try:
        img = decode_image(data.image_b64)
    except Exception as e:
        return ThreatResponse(
            threat_score=100, 
            attack_type="Data Corruption", 
            action="EM_STOP", 
            message="Failed to parse image data format."
        )

    # 2. Run Vision Detection (Asynchronous simulation to prevent blocking)
    threat_intel = await asyncio.to_thread(detect_threats, img)
    language_intel = await asyncio.to_thread(detect_language_risk, data.signal_text)
    # Simulate slight AI processing delay for dramatic effect in demo
    await asyncio.sleep(0.3)

    # 3. Fuse vision + linguistic signals
    fused_score = max(threat_intel["score"], language_intel["score"])
    attack_type = threat_intel["type"]
    if language_intel["score"] >= threat_intel["score"] and language_intel["score"] > 0:
        attack_type = language_intel["type"]

    hierarchy = map_hierarchy(fused_score, data.device_id)

    if language_intel["block"]:
        action = "BLOCKED"
        message = language_intel["message"]
    elif language_intel["score"] >= 25 and hierarchy["action"] == "MONITOR":
        action = "RESTRICT"
        message = language_intel["message"]
    else:
        action = hierarchy["action"]
        message = hierarchy["msg"]

    # Record statistics for dashboard
    ANALYSIS_STATS["total_frames"] += 1
    if action == "BLOCKED":
        ANALYSIS_STATS["total_blocked"] += 1
    if fused_score > 20:
        ANALYSIS_STATS["total_threats"] += 1
    if action == "HONEYPOT":
        ANALYSIS_STATS["honeypot_captures"] += 1
    if action in ANALYSIS_STATS["threat_distribution"]:
        ANALYSIS_STATS["threat_distribution"][action] += 1
    ANALYSIS_STATS["last_update"] = time.strftime("%Y-%m-%d %H:%M:%S")

    return ThreatResponse(
        threat_score=fused_score,
        attack_type=attack_type,
        action=action,
        message=message,
        detection_flags=(threat_intel.get("flags", []) + language_intel["flags"])
    )
