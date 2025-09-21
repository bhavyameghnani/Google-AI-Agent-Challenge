# Pitch Analysis Service
This is a FastAPI application which uses Gemini API to analyse pitch deck, founder call transcriptions and video content to make investment ready insights


## Playbook for deployment

### Set env variables to be used later in the commands
export PROJECT_ID=""
export REGION=""
export REPOSITORY_NAME=""

### Set project ID
gcloud config set project ${PROJECT_ID}

### Create repository
gcloud artifacts repositories create ${REPOSITORY_NAME} \
    --repository-format=docker \
    --location=${REGION}

### Build
gcloud builds submit --tag asia-south1-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY_NAME}/${SERVICE_NAME}

gcloud run deploy $SERVICE_NAME \
    --image=${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY_NAME}/${SERVICE_NAME}:latest \
 --platform=managed \
 --allow-unauthenticated \
 --max-instances=1 \
 --set-env-vars="GOOGLE_GENAI_USE_VERTEXAI=FALSE" \
 --set-env-vars="GOOGLE_API_KEY="