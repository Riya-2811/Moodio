# Face-API.js Models Setup

This folder contains the required models for face-api.js emotion detection.

## Download Instructions

You need to download the following model files and place them in this `public/models/` folder:

### Required Models:

1. **tiny_face_detector_model-weights_manifest.json** and **tiny_face_detector_model-shard1**
   - Download from: https://github.com/justadudewhohacks/face-api.js-models/blob/master/tiny_face_detector_model-weights_manifest.json
   - Download from: https://github.com/justadudewhohacks/face-api.js-models/blob/master/tiny_face_detector_model-shard1

2. **face_landmark_68_model-weights_manifest.json** and **face_landmark_68_model-shard1**
   - Download from: https://github.com/justadudewhohacks/face-api.js-models/blob/master/face_landmark_68_model-weights_manifest.json
   - Download from: https://github.com/justadudewhohacks/face-api.js-models/blob/master/face_landmark_68_model-shard1

3. **face_recognition_model-weights_manifest.json** and **face_recognition_model-shard1** and **face_recognition_model-shard2**
   - Download from: https://github.com/justadudewhohacks/face-api.js-models/blob/master/face_recognition_model-weights_manifest.json
   - Download from: https://github.com/justadudewhohacks/face-api.js-models/blob/master/face_recognition_model-shard1
   - Download from: https://github.com/justadudewhohacks/face-api.js-models/blob/master/face_recognition_model-shard2

4. **face_expression_model-weights_manifest.json** and **face_expression_model-shard1**
   - Download from: https://github.com/justadudewhohacks/face-api.js-models/blob/master/face_expression_model-weights_manifest.json
   - Download from: https://github.com/justadudewhohacks/face-api.js-models/blob/master/face_expression_model-shard1

## Quick Download Script (Optional)

You can use this script in your terminal to download all models at once:

### On Windows (PowerShell):
```powershell
cd public/models
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/tiny_face_detector_model-weights_manifest.json" -OutFile "tiny_face_detector_model-weights_manifest.json"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/tiny_face_detector_model-shard1" -OutFile "tiny_face_detector_model-shard1"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_landmark_68_model-weights_manifest.json" -OutFile "face_landmark_68_model-weights_manifest.json"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_landmark_68_model-shard1" -OutFile "face_landmark_68_model-shard1"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_recognition_model-weights_manifest.json" -OutFile "face_recognition_model-weights_manifest.json"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_recognition_model-shard1" -OutFile "face_recognition_model-shard1"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_recognition_model-shard2" -OutFile "face_recognition_model-shard2"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_expression_model-weights_manifest.json" -OutFile "face_expression_model-weights_manifest.json"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_expression_model-shard1" -OutFile "face_expression_model-shard1"
```

### On Mac/Linux:
```bash
cd public/models
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/tiny_face_detector_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/tiny_face_detector_model-shard1
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_landmark_68_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_landmark_68_model-shard1
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_recognition_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_recognition_model-shard1
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_recognition_model-shard2
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_expression_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_expression_model-shard1
```

## Alternative: Manual Download

1. Go to: https://github.com/justadudewhohacks/face-api.js-models
2. Navigate to the repository
3. Download each file listed above
4. Place all files in this `public/models/` folder

## Verification

After downloading, your `public/models/` folder should contain:
- tiny_face_detector_model-weights_manifest.json
- tiny_face_detector_model-shard1
- face_landmark_68_model-weights_manifest.json
- face_landmark_68_model-shard1
- face_recognition_model-weights_manifest.json
- face_recognition_model-shard1
- face_recognition_model-shard2
- face_expression_model-weights_manifest.json
- face_expression_model-shard1

## Note

The models are not included in the repository due to their size. You must download them manually or use the scripts above before running the emotion detection feature.

