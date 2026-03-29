Team for HACK4IMPACT - MockingBird 


Members- Arkabrata Roy 
         Anangsha Laha



Project Name - AdversaGuard

## Make YOLOv11n + DeBERTa Feasible In This Website

This project now supports real model inference in `backend-engine.py` with automatic fallback to heuristics.

### 1) Install backend dependencies

```bash
pip install -r backend-requirements.txt
```

### 2) Place your fine-tuned models

- YOLOv11n weights: `models/yolov11n-patch.pt`
- DeBERTa-v3-small directory (tokenizer + model): `models/deberta-v3-small-objection/`

You can override locations with environment variables:

```bash
set YOLO_MODEL_PATH=models/yolov11n-patch.pt
set DEBERTA_MODEL_PATH=models/deberta-v3-small-objection
set TEXT_LABELS=normal,objection,manipulation_or_coercion
```

### 3) Start backend + frontend

```bash
uvicorn backend-engine:app --reload --port 8000
npm run dev
```

### 4) Verify model loading

Open:

- `http://127.0.0.1:8000/api/v1/model-status`

If either model is missing, the backend keeps working using fallback heuristics so the demo does not break.

### 5) Live demo flow

- Camera frames are analyzed by YOLO (patch/sticker attack detection).
- Text from the "Live Text Signal" box is analyzed by DeBERTa (normal / objection / manipulation_or_coercion).
- Risk is fused and mapped to actions.
- Strong manipulation/coercion triggers `BLOCKED` automatically.
         
